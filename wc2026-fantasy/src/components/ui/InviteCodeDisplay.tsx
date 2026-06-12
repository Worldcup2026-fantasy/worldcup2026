"use client";

import { useState } from "react";

interface InviteCodeDisplayProps {
  code: string;
  leagueName: string;
}

export default function InviteCodeDisplay({ code, leagueName }: InviteCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/leagues/join?code=${code}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
      <p className="text-xs font-medium text-blue-500 uppercase tracking-widest mb-1">
        Invite code
      </p>
      <p className="text-xs text-blue-400 mb-3">
        Share this with friends to join <span className="font-medium text-blue-600">{leagueName}</span>
      </p>

      {/* Code display */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-white border border-blue-200 rounded-xl px-4 py-3 text-center">
          <span className="text-2xl font-bold tracking-[0.25em] text-gray-900 font-mono">
            {code}
          </span>
        </div>
        <button
          onClick={copyCode}
          className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
            copied
              ? "bg-green-600 text-white border-green-600"
              : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
          }`}
        >
          {copied ? "✓ Copied!" : "Copy code"}
        </button>
      </div>

      {/* Copy link */}
      <button
        onClick={copyLink}
        className="w-full text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2 decoration-dashed transition-colors"
      >
        Or copy invite link
      </button>
    </div>
  );
}
