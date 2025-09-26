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

### Integration Considerations
- **Email Service**: Consider integrating with services like ConvertKit, Mailchimp, or Beehiiv for email collection
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