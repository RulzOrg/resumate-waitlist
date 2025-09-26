# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **coming soon waitlist page** for **Resumate** - an AI-powered resume optimization and automation platform. This Next.js 15 application serves as the pre-launch landing page to collect early user signups and build anticipation for the main Resumate product.

### Main Resumate Project Context
- **Purpose**: AI-powered resume automation and optimization tool
- **Target Audience**: Job seekers looking to create ATS-optimized, professional resumes
- **Value Proposition**: Leverages AI to help users craft tailored, job-ready resumes that increase interview chances
- **Main Repository**: https://github.com/RulzOrg/resumate (main product)

### Waitlist Page Technical Stack
- **Framework**: Next.js 15.5.4 with App Router (`src/app` directory)
- **Language**: TypeScript 5 with strict mode enabled
- **Styling**: Tailwind CSS 4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **Build Tool**: Turbopack (enabled in both dev and build)

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build` (uses Turbopack)
- **Production server**: `npm start`
- **Linting**: `npm run lint` (ESLint with Next.js config)

## Architecture

### Project Structure
- **`src/app/`**: Next.js App Router directory
  - `layout.tsx`: Root layout with font configuration and global CSS
  - `page.tsx`: Homepage component
  - `globals.css`: Global styles with Tailwind imports and CSS variables
- **`public/`**: Static assets (SVG icons and images)
- **Configuration files**: TypeScript, ESLint, PostCSS, and Next.js configs

### Key Features
- **Turbopack**: Enabled for both development and production builds for faster compilation
- **TypeScript**: Configured with path aliases (`@/*` maps to `./src/*`)
- **Dark Mode**: CSS variables setup in globals.css with `prefers-color-scheme` media query
- **Font Optimization**: Uses Next.js font optimization with Geist font family

### ESLint Configuration
- Uses Next.js core web vitals and TypeScript rules
- Ignores: `node_modules`, `.next`, `out`, `build`, `next-env.d.ts`

### Styling Setup
- Tailwind CSS 4 with inline theme configuration in globals.css
- CSS custom properties for colors and fonts
- Font variables injected via Next.js font optimization

## Waitlist Page Specific Features

### Expected Functionality
This waitlist page should include:
- **Hero Section**: Compelling headline about Resumate's AI resume optimization
- **Value Proposition**: Clear benefits of using AI for resume creation
- **Email Capture**: Form to collect early user signups
- **Social Proof**: Testimonials or early user feedback (if available)
- **Feature Preview**: Teasers of main product capabilities
- **Launch Timeline**: Expected release date or development updates

### Beehiiv Integration (Implemented)
**✅ Email Marketing System**
- **API Integration**: `/src/app/api/subscribe/route.ts` - Full Beehiiv API integration
- **Type Safety**: `/src/lib/beehiiv-types.ts` - Comprehensive TypeScript definitions
- **Form Integration**: Both hero and secondary forms connect to Beehiiv API
- **Automation**: Automatic enrollment in "ResuMate AI Waitlist Sequence"
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Rate Limiting**: Built-in protection against abuse

**Environment Configuration Required**:
```
BEEHIIV_API_KEY=your_api_key
BEEHIIV_PUBLICATION_ID=pub_xxxxx
BEEHIIV_AUTOMATION_ID=aut_xxxxx  # Optional
```

### Additional Integration Considerations
- **Analytics**: Track signup conversion rates and user engagement
- **SEO**: Optimize for resume-related keywords and job seeker search terms
- **Mobile-First**: Ensure responsive design for mobile job seekers

## Common Tasks

When working on this project:
1. **Branding Consistency**: Align design with main Resumate product branding
2. **User Experience**: Focus on converting visitors to waitlist signups
3. **Performance**: Optimize for fast loading (crucial for landing pages)
4. **TypeScript**: Use TypeScript for all new files
5. **App Router**: Follow existing patterns in `src/app/`
6. **Path Aliases**: Import from `@/` for relative imports to src directory
7. **Theming**: Use existing CSS custom properties for consistent styling
8. **Development**: Leverage Turbopack's fast refresh during development

## Content Strategy

### Key Messages to Convey
- **Problem**: Traditional resume building is time-consuming and often ineffective
- **Solution**: AI-powered optimization that adapts resumes for specific jobs
- **Benefit**: Higher interview rates through ATS optimization and tailored content
- **Urgency**: Limited early access spots to encourage signup

### Recommended Sections
1. **Hero**: "Create AI-Optimized Resumes That Get Interviews"
2. **Problem/Solution**: Current resume building pain points
3. **Features Preview**: AI optimization, ATS scanning, job matching
4. **Early Access**: Exclusive waitlist benefits
5. **Footer**: Social links, contact info

## Beehiiv Email Automation Sequence

### Recommended 5-Email Sequence for ResuMate AI:

**Email 1: Welcome + Value (Immediate)**
- Subject: "Welcome to ResuMate AI Early Access! 🚀"
- Content: Welcome message, explain what ResuMate AI does, set expectations
- Include: Early access benefits, timeline expectations

**Email 2: Problem Education (Day +3)**
- Subject: "Why 95% of resumes get rejected by ATS systems"
- Content: Educate about ATS problems, generic resume issues
- Position ResuMate AI as the solution

**Email 3: AI Advantage (Day +7)**
- Subject: "How AI will transform your job search in 2025"
- Content: Benefits of AI-powered resume optimization
- Share success stories or case studies

**Email 4: Early Access Update (Day +14)**
- Subject: "ResuMate AI Beta Update + Timeline"
- Content: Development progress, beta timeline, exclusive features
- Build anticipation for launch

**Email 5: Pre-Launch (Day +21)**
- Subject: "Get your current resume ready for ResuMate AI"
- Content: Tips to prepare their existing resume, what formats we accept
- Final anticipation building before beta launch

### Setup Instructions:

#### Option 1: Recommended - Auto-Trigger Setup
1. Create automation in Beehiiv dashboard named "ResuMate AI Waitlist Sequence"
2. Set trigger to **"New Subscriber"** (this will automatically enroll all new subscribers)
3. Design emails with ResuMate AI branding and messaging
4. Set delays between emails (immediate, +3 days, +7 days, etc.)
5. **Publish** the automation (not draft mode)
6. Leave `BEEHIIV_AUTOMATION_ID` empty or remove it from `.env.local`

#### Option 2: API-Based Enrollment (Advanced)
1. Create automation in Beehiiv dashboard named "ResuMate AI Waitlist Sequence"
2. Set trigger to **"Manual"** or **"API"** (if available)
3. Design emails with ResuMate AI branding and messaging
4. **Publish** the automation (not draft mode)
5. Copy automation ID from URL: `app.beehiiv.com/automations/[AUTOMATION_ID]`
6. Add `BEEHIIV_AUTOMATION_ID=aut_xxxxx` to `.env.local`

**💡 Recommendation**: Use Option 1 (Auto-Trigger) as it's more reliable and doesn't depend on API endpoint changes.

## Testing & Monitoring

### Testing Checklist:
- [ ] Environment variables configured correctly
- [ ] Test email submission through both forms (hero + secondary)
- [ ] Verify subscriber appears in Beehiiv dashboard
- [ ] Check automation enrollment success
- [ ] Test error handling (invalid emails, network issues)
- [ ] Verify fallback localStorage behavior in development
- [ ] Test rate limiting functionality

### Monitoring & Analytics:
- **Beehiiv Dashboard**: Monitor subscriber growth, email open rates, automation performance
- **Browser Console**: Check for API errors and integration issues in development
- **Local Storage**: Backup data available for development/debugging
- **Rate Limiting**: Built-in protection logs abuse attempts

### Common Issues:
- **"Environment variable missing"**: Check .env.local file has all required variables
- **"API key invalid"**: Verify Beehiiv API key has correct permissions
- **"Automation not found"**: Ensure automation is published and ID is correct
- **"Network errors"**: Check Beehiiv service status and internet connection