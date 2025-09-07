"use client";

import { Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <div className="bg-gray-800 text-white py-12 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-6">
          <img
            src="/Logo for enreached.svg"
            alt="ENRECHED Logo"
            className="h-12 w-auto filter brightness-0 invert mx-auto"
          />
        </div>
        
        {/* Tagline */}
        <div className="mb-8">
          <h3 className="text-lg font-medium leading-tight">
            Turn Skip Tracing Data Into Real
          </h3>
          <h3 className="text-lg font-medium">
            Conversations
          </h3>
        </div>
        
        {/* Buttons */}
        <div className="space-y-3 mb-8">
          {/* Email Button */}
          <a
            href="mailto:hello@enreached.co"
            className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors w-full max-w-sm mx-auto"
          >
            <Mail className="h-5 w-5" />
            <span className="text-sm font-medium">hello@enreached.co</span>
          </a>
          
          {/* Website Button */}
          <a
            href="https://www.enreached.co"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors w-full max-w-sm mx-auto"
          >
            <ExternalLink className="h-5 w-5" />
            <span className="text-sm font-medium">www.enreached.co</span>
          </a>
        </div>
        
        {/* Copyright */}
        <div className="text-sm text-gray-400">
          © 2025 Enreached.co | All rights reserved.
        </div>
      </div>
    </div>
  );
}
