/**
 * TypeScript definitions for Beehiiv API integration
 * Based on Beehiiv API v2 documentation
 */

// Base interfaces for API requests and responses
export interface BeehiivSubscriber {
  email: string;
  first_name?: string;
  last_name?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referring_site?: string;
}

export interface BeehiivSubscriptionRequest {
  email: string;
  first_name?: string;
  last_name?: string;
  reactivate_existing?: boolean;
  send_welcome_email?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referring_site?: string;
}

export interface BeehiivSubscriptionResponse {
  id?: string;
  email?: string;
  status?: 'active' | 'inactive' | 'pending';
  created?: string;
  updated?: string;
  first_name?: string;
  last_name?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referring_site?: string;
  // Handle potential nested data structure
  data?: {
    id?: string;
    email?: string;
    status?: 'active' | 'inactive' | 'pending';
    created?: string;
    updated?: string;
    first_name?: string;
    last_name?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referring_site?: string;
  };
}

export interface BeehiivAutomationEnrollmentRequest {
  email: string;
  automation_id: string;
}

export interface BeehiivAutomationEnrollmentResponse {
  id: string;
  email: string;
  automation_id: string;
  status: 'enrolled' | 'completed' | 'paused';
  enrolled_at: string;
}

// Error handling types
export interface BeehiivErrorResponse {
  error: {
    type: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface BeehiivValidationError {
  field: string;
  message: string;
}

// API response wrapper types
export type BeehiivAPIResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: BeehiivErrorResponse['error'];
  status?: number;
};

// Custom application types
export interface WaitlistSubscriptionData {
  email: string;
  firstName?: string;
  source?: string;
  campaign?: string;
}

export interface SubscriptionResult {
  success: boolean;
  message: string;
  data?: {
    subscriber_id?: string;
    automation_enrolled?: boolean;
    email: string;
  };
  error?: {
    type: 'validation' | 'duplicate' | 'api_error' | 'network_error' | 'rate_limit';
    message: string;
    details?: Record<string, unknown>;
  };
}

// Environment configuration type
export interface BeehiivConfig {
  apiKey: string;
  publicationId: string;
  automationId?: string;
  isDevelopment?: boolean;
}

// Beehiiv API endpoints
export const BEEHIIV_ENDPOINTS = {
  SUBSCRIBE: '/subscriptions',
  AUTOMATION_ENROLLMENT: '/automations/enroll',
} as const;

// Common error types
export const BEEHIIV_ERROR_TYPES = {
  VALIDATION_ERROR: 'validation_error',
  DUPLICATE_SUBSCRIBER: 'duplicate_subscriber',
  INVALID_EMAIL: 'invalid_email',
  AUTOMATION_NOT_FOUND: 'automation_not_found',
  API_ERROR: 'api_error',
  NETWORK_ERROR: 'network_error',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SUBSCRIBED: "You're on the list! We'll email you as soon as early access opens.",
  ALREADY_SUBSCRIBED: "You're already on our waitlist! We'll be in touch soon.",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address.',
  NETWORK_ERROR: 'Connection issue. Please try again in a moment.',
  API_ERROR: 'Something went wrong. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  GENERAL_ERROR: 'Unable to join waitlist right now. Please try again later.',
} as const;