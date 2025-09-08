"use client";

import { Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <div className="bg-gray-800 text-white py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-3 sm:mb-4">
          <img
            src="/Logo for enreached.svg"
            alt="ENRECHED Logo"
            className="h-6 sm:h-8 w-auto filter brightness-0 invert mx-auto"
          />
        </div>
        
        {/* Tagline */}
        <div className="mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-medium leading-tight">
            Turn Skip Tracing Data Into Real Conversations
          </h3>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4 justify-center">
          {/* Email Button */}
          <a
            href="mailto:hello@enreached.co"
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs font-medium"
          >
            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">hello@enreached.co</span>
            <span className="sm:hidden">Email</span>
          </a>
          
          {/* Website Button */}
          <a
            href="https://www.enreached.co"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs font-medium"
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">www.enreached.co</span>
            <span className="sm:hidden">Website</span>
          </a>
        </div>
        
        {/* Copyright */}
        <div className="text-xs text-gray-400">
          © 2025 Enreached.co | All rights reserved.
        </div>
      </div>
    </div>
  );
}
