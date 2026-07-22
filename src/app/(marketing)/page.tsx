import type { Metadata } from "next";
import Link from "next/link";
import { MarketingHeader } from "@/components/layout/marketing-header";

const title = "Interviewly AI | AI Mock Interview Practice";
const description =
  "Practice technical, behavioral, and general job interviews with AI-generated questions, written or voice answers, and actionable feedback.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    siteName: "Interviewly AI",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

const features = [
  ["AI-powered mock interviews", "Practice role-specific questions generated for your goals."],
  ["Instant feedback", "Receive scores, strengths, weaknesses, and improved answers."],
  ["Written and voice-ready", "Build confidence in a realistic, distraction-free experience."],
  ["Measurable progress", "Track readiness, streaks, history, and skill growth."],
];

const faqs = [
  ["What interview types can I practice?", "You can configure technical, behavioral, or general mock interviews for a target role and experience level."],
  ["Can I answer by voice?", "Yes. Voice practice uses supported browser speech and microphone features, with a written answer fallback when voice tools are unavailable."],
  ["Who is Interviewly AI designed for?", "The platform is designed for students and job seekers who want structured practice, answer feedback, and progress tracking."],
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ai-interview-coach-sigma-bay.vercel.app/#website",
      url: "https://ai-interview-coach-sigma-bay.vercel.app/",
      name: "Interviewly AI",
      description,
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://ai-interview-coach-sigma-bay.vercel.app/#application",
      name: "Interviewly AI",
      url: "https://ai-interview-coach-sigma-bay.vercel.app/",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      description,
      featureList: [
        "Role-specific AI mock interviews",
        "Technical, behavioral, and general interview practice",
        "Written and voice answer modes",
        "Per-answer feedback and final reports",
        "Interview history and progress analytics",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://ai-interview-coach-sigma-bay.vercel.app/#faq",
      mainEntity: faqs.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <MarketingHeader />
      <main>
        <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,#e0e7ff,transparent_38%),radial-gradient(circle_at_top_right,#dbeafe,transparent_35%)] py-24">
          <div className="container grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="badge">Your personal AI interview coach</span>
              <h1 className="mt-6 text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-950 md:text-7xl">Turn interview anxiety into <span className="text-indigo-600">career confidence.</span></h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Practice technical, behavioral, and general interviews with intelligent feedback designed for students and job seekers.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/sign-up" className="btn btn-primary">Start practicing free →</Link><a href="#how" className="btn btn-secondary">See how it works</a></div>
            </div>
            <div className="card shadow-soft p-4"><div className="rounded-2xl bg-slate-950 p-6 text-white"><p className="text-sm text-slate-400">Mock interview</p><h3 className="mt-1 text-xl font-bold">Frontend Developer</h3><div className="mt-8 rounded-2xl bg-white/10 p-5"><p className="text-xs uppercase tracking-widest text-indigo-300">Question 3 of 8</p><p className="mt-3 text-xl font-semibold">Tell me about a challenging project and how you handled it.</p><div className="mt-6 h-28 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">Your answer appears here...</div></div></div></div>
          </div>
        </section>
        <section id="features" className="py-24"><div className="container"><span className="badge">Everything you need</span><h2 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight">Practice with purpose, improve with evidence.</h2><div className="grid-auto mt-10">{features.map(([title, description], index) => <article key={title} className="card p-6"><div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 font-extrabold text-indigo-600">0{index + 1}</div><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 leading-7 text-slate-600">{description}</p></article>)}</div></div></section>
        <section id="how" className="bg-slate-950 py-24 text-white"><div className="container text-center"><span className="badge">Simple workflow</span><h2 className="mt-5 text-4xl font-extrabold">Ready in four focused steps</h2><div className="mt-12 grid gap-5 md:grid-cols-4">{["Create your profile", "Choose interview type", "Answer realistic questions", "Review your improvement plan"].map((step, index) => <div className="rounded-2xl border border-white/10 bg-white/5 p-6" key={step}><span className="text-sm font-bold text-indigo-300">STEP {index + 1}</span><h3 className="mt-3 text-lg font-bold">{step}</h3></div>)}</div></div></section>
        <section id="faq" className="py-24"><div className="container"><div className="text-center"><span className="badge">Common questions</span><h2 className="mt-5 text-4xl font-extrabold">AI interview practice FAQ</h2></div><div className="mx-auto mt-10 grid max-w-4xl gap-5">{faqs.map(([question, answer]) => <article className="card p-6" key={question}><h3 className="text-lg font-bold">{question}</h3><p className="mt-2 leading-7 text-slate-600">{answer}</p></article>)}</div></div></section>
        <section id="get-started" className="bg-slate-50 py-24"><div className="container text-center"><h2 className="text-4xl font-extrabold">Start building confidence today.</h2><p className="mx-auto mt-4 max-w-xl text-slate-600">Create your account and complete your first personalized mock interview.</p><Link href="/sign-up" className="btn btn-primary mt-8">Create account</Link></div></section>
      </main>
      <footer className="border-t bg-white py-8"><div className="container flex flex-wrap justify-between gap-4 text-sm text-slate-500"><span>© 2026 Interviewly AI</span><span>Built for ambitious students and job seekers.</span></div></footer>
    </>
  );
}
