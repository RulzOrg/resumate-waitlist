"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { SubscriptionResult } from "@/lib/beehiiv-types";

type MessageState = { type: "success" | "error"; text: string } | null;

interface WaitlistFormProps {
  id: string;
  buttonLabel: string;
  placeholder?: string;
  helper?: { icon: ReactNode; text: string };
  inputIcon?: ReactNode;
  buttonSuffix?: ReactNode;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const waitlistStorageKey = "resumate_waitlist";

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#waitlist", label: "Waitlist" },
  { href: "#faq", label: "FAQ" },
];

const avatars = [
  { src: "/images/avatars/avatar-1.webp", alt: "ResuMate early adopter 1" },
  { src: "/images/avatars/avatar-2.webp", alt: "ResuMate early adopter 2" },
  { src: "/images/avatars/avatar-3.webp", alt: "ResuMate early adopter 3" },
  { src: "/images/avatars/avatar-4.webp", alt: "ResuMate early adopter 4" },
  { src: "/images/avatars/avatar-5.webp", alt: "ResuMate early adopter 5" },
];

const howItWorksSteps = [
  {
    title: "1. Upload Your Master Resume",
    description: "Start with your generic resume. We'll transform it into job-specific versions.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-emerald-400"
        aria-hidden
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m17 8-5-5-5 5" />
        <path d="M12 3v12" />
      </svg>
    ),
  },
  {
    title: "2. Paste Job Description",
    description: "Add the specific job posting. Our AI analyzes requirements and tailors accordingly.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-emerald-400"
        aria-hidden
      >
        <path d="m12 11 4-4-4-4" />
        <path d="m18 17-4 4-4-4" />
        <path d="M2 12h20" />
        <path d="M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
  {
    title: "3. Get Tailored Resume",
    description: "Download your job-specific resume optimized for that exact role and ATS system.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-emerald-400"
        aria-hidden
      >
        <path d="M12 15V3" />
        <path d="m8 11 4 4 4-4" />
        <path d="M2 17h.01" />
        <path d="M7 17h.01" />
        <path d="M12 17h.01" />
        <path d="M17 17h.01" />
        <path d="M22 17h.01" />
        <path d="M2 21h20" />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: "Why shouldn't I use the same resume for every job?",
    answer:
      "ATS systems in 2025 can detect generic resumes and automatically filter them out. 88% of qualified candidates get rejected because they use one-size-fits-all resumes. Job-specific tailoring dramatically improves your chances.",
  },
  {
    question: "How does ResuMate AI customize my resume for each job?",
    answer:
      "Our AI analyzes the specific job posting, identifies key requirements, and rewrites your experience to match exactly what that employer is looking for. It optimizes keywords, skills, and achievements for each role.",
  },
  {
    question: "How long does it take to tailor a resume for each job?",
    answer:
      "With ResuMate AI, you can get a fully customized, job-specific resume in under 2 minutes. No more spending hours manually editing your resume for each application.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Absolutely. Your resume and personal information are encrypted and never used to train AI models. You have full control over your data and can delete it at any time.",
  },
  {
    question: "How many tailored resumes can I create?",
    answer:
      "Unlimited. Create as many job-specific resume versions as you need. Our platform keeps them organized so you can track which version you sent to which employer.",
  },
];

const arrowIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const mailIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-white/60"
    aria-hidden
  >
    <path d="m22 7-9 5.727a2 2 0 0 1-2 0L2 7" />
    <rect x="2" y="4" width="20" height="16" rx="2" />
  </svg>
);

const shieldIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5 text-white/50"
    aria-hidden
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
);

const sparklesIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
  >
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
    <path d="M20 2v4" />
    <path d="M22 4h-4" />
    <circle cx="4" cy="20" r="2" />
  </svg>
);

const bellIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
  >
    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
    <path d="M22 8c0-2.3-.8-4.3-2-6" />
    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    <path d="M4 2C2.8 3.7 2 5.7 2 8" />
  </svg>
);

function WaitlistForm({
  id,
  buttonLabel,
  placeholder = "you@domain.com",
  helper,
  inputIcon,
  buttonSuffix = arrowIcon,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<MessageState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailPattern.test(email.trim())) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call Beehiiv API through our backend
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'waitlist',
          campaign: 'resumate-ai-waitlist',
        }),
      });

      const result: SubscriptionResult = await response.json();

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message,
        });
        setEmail("");

        // Optional: Still save to localStorage as backup for development
        if (typeof window !== "undefined" && process.env.NODE_ENV === 'development') {
          try {
            const existing = window.localStorage.getItem(waitlistStorageKey);
            const parsed = existing ? JSON.parse(existing) : [];
            parsed.push({
              email: email.trim(),
              ts: Date.now(),
              beehiiv_success: true,
              subscriber_id: result.data?.subscriber_id
            });
            window.localStorage.setItem(waitlistStorageKey, JSON.stringify(parsed));
          } catch (error) {
            console.error("Local storage backup failed", error);
          }
        }
      } else {
        setMessage({
          type: "error",
          text: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Waitlist submission failed", error);

      // Fallback to localStorage in development if API fails
      if (typeof window !== "undefined" && process.env.NODE_ENV === 'development') {
        try {
          const existing = window.localStorage.getItem(waitlistStorageKey);
          const parsed = existing ? JSON.parse(existing) : [];
          parsed.push({
            email: email.trim(),
            ts: Date.now(),
            beehiiv_success: false,
            fallback: true
          });
          window.localStorage.setItem(waitlistStorageKey, JSON.stringify(parsed));

          setMessage({
            type: "success",
            text: "You're on the list! We'll email you as soon as early access opens.",
          });
          setEmail("");
        } catch {
          setMessage({
            type: "error",
            text: "Connection issue. Please try again in a moment."
          });
        }
      } else {
        setMessage({
          type: "error",
          text: "Connection issue. Please try again in a moment."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageClassName =
    "mt-4 rounded-lg border px-4 py-3 text-sm transition-colors" +
    (message?.type === "success"
      ? " border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : message?.type === "error"
      ? " border-red-500/30 bg-red-500/10 text-red-200"
      : " hidden");

  return (
    <div>
      <form
        id={id}
        className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="relative flex-1">
          {inputIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              {inputIcon}
            </span>
          )}
          <input
            aria-label="Email address"
            autoComplete="email"
            className={
              "w-full rounded-full border border-white/15 bg-white/5 py-3 pr-4 text-sm text-white placeholder-white/40 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/60" +
              (inputIcon ? " pl-9" : " px-4")
            }
            onChange={(event) => setEmail(event.target.value)}
            placeholder={placeholder}
            required
            type="email"
            value={email}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-80"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                />
              </svg>
              <span>Joining...</span>
            </>
          ) : (
            <>
              <span>{buttonLabel}</span>
              {buttonSuffix}
            </>
          )}
        </button>
      </form>
      <div
        className={message?.type ? messageClassName : "mt-4 hidden"}
        role="status"
        aria-live="polite"
      >
        {message?.text}
      </div>
      {helper && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-white/60">
          {helper.icon}
          <p className="font-geist">{helper.text}</p>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div id="top" className="relative overflow-hidden bg-black text-white">
      <div
        aria-hidden
        className="absolute left-0 top-0 -z-10 h-[880px] w-full"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120,119,198,0.3), rgba(255,255,255,0))",
        }}
      />

      <header className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mt-6 flex items-center justify-between">
            <a
              href="#top"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M21 21v-5h-5" />
                </svg>
              </span>
              <span className="text-base font-medium tracking-tighter font-geist">
                ResuMate AI
              </span>
            </a>

            <div
              className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur md:flex"
              role="navigation"
              aria-label="Primary"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-white/80 transition hover:text-white font-geist"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <a
              href="#waitlist"
              className="hidden items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400 font-geist md:inline-flex"
            >
              Join Waitlist
            </a>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium backdrop-blur font-geist md:hidden"
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileMenuOpen}
              aria-controls="primary-navigation"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-5 w-5 transition-transform ${mobileMenuOpen ? "rotate-90" : ""}`}
                aria-hidden
              >
                {mobileMenuOpen ? (
                  <>
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
              <span>{mobileMenuOpen ? "Close" : "Menu"}</span>
            </button>
          </nav>

          <div
            id="primary-navigation"
            className={`md:hidden ${mobileMenuOpen ? "mt-4" : "hidden"}`}
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
              <nav className="flex flex-col gap-2" aria-label="Primary mobile">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white font-geist"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#waitlist"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Waitlist
                </a>
              </nav>
            </div>
          </div>

          <section
            id="waitlist"
            className="relative z-10 mx-auto max-w-5xl pt-14 pb-12 text-center sm:pt-20 md:pt-28"
          >
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="flex -space-x-3">
                {avatars.map((avatar) => (
                  <Image
                    key={avatar.src}
                    src={avatar.src}
                    alt={avatar.alt}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-black/60"
                    sizes="36px"
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-white"
                      aria-hidden
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-1 text-xs font-medium text-white/70 font-geist">
                  Be among the first to get access
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-200">
              {sparklesIcon}
              <span className="text-xs font-medium font-geist">Early access beta</span>
            </div>

            <h1 className="mx-auto mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl font-space-grotesk">
              Stop using the same resume for every job.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base font-normal text-white/70 sm:text-lg font-geist">
              88% of qualified candidates get rejected using generic resumes. Get job-specific resumes tailored to each role with AI. Join the waitlist for early access.
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <WaitlistForm
                id="waitlist-form"
                buttonLabel="Join waitlist"
                inputIcon={mailIcon}
                helper={{
                  icon: shieldIcon,
                  text: "No spam, unsubscribe anytime. We’ll email you when invites roll out.",
                }}
              />
            </div>
          </section>
        </div>
      </header>

      <main>
        <section
          id="how-it-works"
          className="relative overflow-hidden py-16 sm:py-24"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl font-space-grotesk">
                Transform generic resumes into job-winning applications.
              </h2>
              <p className="mt-4 text-base text-white/70 font-geist">
                Stop sending the same resume everywhere. Our platform makes it effortless to create a perfectly tailored application for every opportunity, boosting your visibility to recruiters and hiring managers.
              </p>
              <div className="mt-8 space-y-6">
                {howItWorksSteps.map((step) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white font-geist">{step.title}</h3>
                      <p className="mt-1 text-sm text-white/60 font-geist">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src="/images/features/hero-ui.webp"
                  alt="ResuMate AI job-specific resume tailoring interface showing before and after resume customization"
                  width={1080}
                  height={810}
                  className="aspect-[4/3] w-full object-cover"
                  sizes="(min-width: 1024px) 560px, 100vw"
                  priority
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" aria-hidden />
            </div>
          </div>
        </section>

        <section
          id="features"
          className="relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6 lg:px-8"
        >
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl font-space-grotesk">
                Why generic resumes fail in 2025.
              </h2>
              <p className="mt-3 text-base text-white/70 font-geist">
                ATS systems now detect generic applications and auto-reject them. Our job-specific tailoring beats these filters and gets you noticed by recruiters.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 md:col-span-2 md:row-span-2">
              <div className="relative flex-1">
                <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl font-space-grotesk">
                  Job-Specific Resume Tailoring
                </h3>
              <p className="mt-2 text-sm text-white/70 sm:text-base font-geist">
                  No more generic resumes. Our AI analyzes each job posting and customizes your resume to match specific requirements, keywords, and company culture, dramatically increasing your interview chances.
              </p>
              </div>
              <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
                <Image
                  src="/images/features/feature-analysis.webp"
                  alt="Job-specific resume analysis showing keyword optimization and ATS compatibility scoring"
                  width={1080}
                  height={720}
                  className="w-full object-cover"
                  sizes="(min-width: 1024px) 720px, 100vw"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="flex items-center gap-2 text-xl font-medium tracking-tight text-white font-geist">
                ATS-Friendly Templates
              </h3>
              <p className="mt-2 text-sm text-white/70 font-geist">
                Choose from a library of professionally designed templates, all proven to be compatible with modern Applicant Tracking Systems.
              </p>
              <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
                <Image
                  src="/images/features/feature-templates.webp"
                  alt="ATS-friendly resume templates optimized for different job roles and industries"
                  width={1080}
                  height={720}
                  className="w-full object-cover"
                  sizes="(min-width: 1024px) 360px, 100vw"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="flex items-center gap-2 text-xl font-medium tracking-tight text-white font-geist">
                Instant Resume Score
              </h3>
              <p className="mt-2 text-sm text-white/70 font-geist">
                Get a real-time score on how well your resume matches a job. Track your improvements and know when it&apos;s ready.
              </p>
              <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
                <Image
                  src="/images/features/instant-resume.webp"
                  alt="Real-time resume scoring dashboard showing job match percentage and optimization suggestions"
                  width={1080}
                  height={720}
                  className="w-full object-cover"
                  sizes="(min-width: 1024px) 360px, 100vw"
                  loading="lazy"
                />
              </div>
            </div>

            {[
              {
                title: "Unlimited Job Targeting",
                description:
                  "Generate as many tailored resume versions as you need. Our platform keeps them organized for you.",
              },
              {
                title: "Impactful Bullet Points",
                description:
                  "Turn bland descriptions into powerful, achievement-oriented statements with AI suggestions.",
              },
              {
                title: "Cover Letter Generator",
                description:
                  "Create compelling cover letters that complement your resume and target the specific role.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-lg font-medium tracking-tight text-white font-geist">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-white/70 font-geist">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80">
              {bellIcon}
              <span className="text-xs font-medium font-geist">Get notified at launch</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl font-space-grotesk">
              Join the waitlist and get early invites.
            </h3>
            <p className="mt-2 text-sm text-white/70 font-geist">
              We’ll roll out access to waitlisters first.
            </p>
            <div className="mx-auto mt-6 max-w-md">
              <WaitlistForm id="waitlist-form-secondary" buttonLabel="Join" />
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="relative overflow-hidden pt-16 pb-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl font-space-grotesk">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-base text-white/70 font-geist">
                Everything you need to know about ResuMate AI.
              </p>
            </div>

            <div className="mx-auto max-w-3xl space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <div
                    key={faq.question}
                    className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
                  >
                    <button
                      className="flex w-full items-center justify-between p-5 text-left"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                    >
                      <h3 className="pr-4 text-base font-medium text-white font-geist">
                        {faq.question}
                      </h3>
                      <span
                        className={`flex h-5 w-5 items-center justify-center text-white/60 transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                        aria-hidden
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                      </span>
                    </button>
                    <div className={isOpen ? "block" : "hidden"}>
                      <p className="px-5 pb-5 text-sm text-white/70 font-geist">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-white/50 font-geist">
            © {currentYear} ResuMate AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-white/60 transition hover:text-white"
              aria-label="ResuMate AI on X"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-white/60 transition hover:text-white"
              aria-label="ResuMate AI on LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
