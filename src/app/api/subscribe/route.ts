import { NextRequest, NextResponse } from 'next/server';
import {
  BeehiivConfig,
  BeehiivSubscriptionRequest,
  BeehiivSubscriptionResponse,
  BeehiivAutomationEnrollmentRequest,
  BeehiivAutomationEnrollmentResponse,
  SubscriptionResult,
  WaitlistSubscriptionData,
  BeehiivErrorResponse,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from '@/lib/beehiiv-types';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting (simple in-memory store for development)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

/**
 * Get Beehiiv configuration from environment variables
 */
function getBeehiivConfig(): BeehiivConfig {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  const automationId = process.env.BEEHIIV_AUTOMATION_ID;

  if (!apiKey || !publicationId) {
    throw new Error('Missing required Beehiiv configuration. Check BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID environment variables.');
  }

  return {
    apiKey,
    publicationId,
    automationId,
    isDevelopment: process.env.NODE_ENV === 'development',
  };
}

/**
 * Check rate limiting for an IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRate = rateLimitMap.get(ip);

  if (!userRate || now > userRate.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userRate.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userRate.count++;
  return true;
}

/**
 * Subscribe email to Beehiiv publication
 */
async function subscribeToBeehiiv(
  config: BeehiivConfig,
  data: WaitlistSubscriptionData
): Promise<BeehiivSubscriptionResponse> {
  const subscriptionData: BeehiivSubscriptionRequest = {
    email: data.email,
    first_name: data.firstName,
    reactivate_existing: true,
    send_welcome_email: false, // We'll handle this via automation
    utm_source: data.source || 'waitlist',
    utm_campaign: data.campaign || 'resumate-ai-waitlist',
    referring_site: 'resumate.ai',
  };

  const response = await fetch(`https://api.beehiiv.com/v2/publications/${config.publicationId}/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ResuMate-AI-Waitlist/1.0',
    },
    body: JSON.stringify(subscriptionData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (config.isDevelopment) {
      console.error('Beehiiv subscription error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        requestData: subscriptionData,
      });
    }

    throw new Error(`Beehiiv API error: ${response.status} ${response.statusText}`, {
      cause: errorData,
    });
  }

  return await response.json();
}

/**
 * Enroll subscriber in Beehiiv automation
 */
async function enrollInAutomation(
  config: BeehiivConfig,
  email: string
): Promise<BeehiivAutomationEnrollmentResponse | null> {
  if (!config.automationId) {
    if (config.isDevelopment) {
      console.log('No automation ID provided, skipping automation enrollment');
    }
    return null;
  }

  const enrollmentData: BeehiivAutomationEnrollmentRequest = {
    email,
    automation_id: config.automationId,
  };

  const response = await fetch(`https://api.beehiiv.com/v2/automations/enroll`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ResuMate-AI-Waitlist/1.0',
    },
    body: JSON.stringify(enrollmentData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (config.isDevelopment) {
      console.error('Beehiiv automation enrollment error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        requestData: enrollmentData,
      });
    }

    // Don't throw here - automation enrollment failure shouldn't block subscription
    return null;
  }

  return await response.json();
}

/**
 * Handle POST requests for waitlist subscription
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get client IP for rate limiting
    const ip = request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.RATE_LIMIT,
          error: {
            type: 'rate_limit',
            message: ERROR_MESSAGES.RATE_LIMIT,
          },
        } satisfies SubscriptionResult,
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json().catch(() => null);

    if (!body || typeof body.email !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.INVALID_EMAIL,
          error: {
            type: 'validation',
            message: 'Email is required',
          },
        } satisfies SubscriptionResult,
        { status: 400 }
      );
    }

    const { email, firstName, source, campaign } = body as WaitlistSubscriptionData;

    // Validate email format
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.INVALID_EMAIL,
          error: {
            type: 'validation',
            message: ERROR_MESSAGES.INVALID_EMAIL,
          },
        } satisfies SubscriptionResult,
        { status: 400 }
      );
    }

    // Get Beehiiv configuration
    const config = getBeehiivConfig();

    // Subscribe to Beehiiv
    const subscription = await subscribeToBeehiiv(config, {
      email: email.toLowerCase().trim(),
      firstName: firstName?.trim(),
      source,
      campaign,
    });

    // Attempt to enroll in automation (optional)
    const automationEnrollment = await enrollInAutomation(config, subscription.email);

    // Success response
    const result: SubscriptionResult = {
      success: true,
      message: SUCCESS_MESSAGES.SUBSCRIBED,
      data: {
        subscriber_id: subscription.id,
        automation_enrolled: !!automationEnrollment,
        email: subscription.email,
      },
    };

    // Log success in development
    if (config.isDevelopment) {
      console.log('Successful subscription:', {
        email: subscription.email,
        subscriber_id: subscription.id,
        automation_enrolled: !!automationEnrollment,
        automation_id: config.automationId,
      });
    }

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      console.error('Subscription API error:', error);
    }

    // Handle specific Beehiiv API errors
    if (error instanceof Error && error.cause) {
      const beehiivError = error.cause as BeehiivErrorResponse;

      // Handle duplicate subscriber (this is often acceptable)
      if (beehiivError.error?.type === 'duplicate_subscriber' ||
          beehiivError.error?.message?.includes('already exists')) {
        return NextResponse.json(
          {
            success: true,
            message: SUCCESS_MESSAGES.ALREADY_SUBSCRIBED,
            data: {
              email: '', // We don't have the subscriber details in this case
              automation_enrolled: false, // Likely already enrolled if they exist
            },
          } satisfies SubscriptionResult,
          { status: 200 }
        );
      }

      // Handle validation errors
      if (beehiivError.error?.type === 'validation_error') {
        return NextResponse.json(
          {
            success: false,
            message: ERROR_MESSAGES.INVALID_EMAIL,
            error: {
              type: 'validation',
              message: beehiivError.error.message || ERROR_MESSAGES.INVALID_EMAIL,
              details: beehiivError.error.details,
            },
          } satisfies SubscriptionResult,
          { status: 400 }
        );
      }
    }

    // Network or other API errors
    if (error instanceof Error && (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('timeout')
    )) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.NETWORK_ERROR,
          error: {
            type: 'network_error',
            message: ERROR_MESSAGES.NETWORK_ERROR,
          },
        } satisfies SubscriptionResult,
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGES.GENERAL_ERROR,
        error: {
          type: 'api_error',
          message: isDevelopment ? (error instanceof Error ? error.message : 'Unknown error') : ERROR_MESSAGES.GENERAL_ERROR,
        },
      } satisfies SubscriptionResult,
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}