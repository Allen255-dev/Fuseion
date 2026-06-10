import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 max-w-4xl mx-auto">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="size-4" />
        <span>Back to App</span>
      </Link>
      
      <h1 className="text-4xl font-bold font-heading mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Privacy Policy
      </h1>
      
      <div className="prose prose-invert max-w-none space-y-6 text-zinc-300">
        <p className="text-lg font-medium text-white italic">Effective Date: May 12, 2026</p>
        
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">1. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> When you sign up, we collect your email address and name (if provided via Google Auth).</li>
            <li><strong>Chat Data:</strong> We store your chat history (messages, threads, and AI responses) to provide a persistent experience across sessions.</li>
            <li><strong>Usage Data:</strong> We collect information about how you interact with our service to improve performance.</li>
            <li><strong>Technical Data:</strong> IP addresses and browser information are collected for security and rate limiting.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
          <p>We use your information to provide, maintain, and improve our AI services, as well as to protect against abuse and ensure the security of our platform.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">3. Data Storage and Security</h2>
          <p>We use industry-standard encryption and secure cloud providers (Convex) to ensure your data is safe. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">4. AI Providers</h2>
          <p>Your messages are processed by third-party AI models (Google, Groq, OpenRouter). These providers have their own strict privacy standards for data handling.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">5. Scalability</h2>
          <p>Fuseion is designed to scale efficiently, supporting thousands of users simultaneously while maintaining data privacy and response speed.</p>
        </section>
        
        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <p className="text-zinc-400 mb-2">Have questions about your privacy?</p>
          <a href="mailto:support@fuseion.ai" className="text-blue-400 hover:underline">support@fuseion.ai</a>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-zinc-500 text-sm">
        &copy; 2026 Fuseion AI. All rights reserved.
      </footer>
    </div>
  );
}
