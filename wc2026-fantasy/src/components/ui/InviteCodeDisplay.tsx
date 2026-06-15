"use client";

import { useState } from "react";
import { Ticket, Copy, Check, Link2 } from "lucide-react";

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
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl p-5 text-white shadow-xl shadow-blue-500/20">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="flex items-center gap-1.5 mb-1 relative">
        <Ticket className="w-3.5 h-3.5 text-blue-200" strokeWidth={2.5} />
        <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Invite code</p>
      </div>
      <p className="text-xs text-blue-200 font-medium mb-3 relative">
        Share this with friends to join <span className="font-bold text-white">{leagueName}</span>
      </p>

      <div className="flex items-center gap-3 mb-3 relative">
        <div className="flex-1 bg-white/15 backdrop-blur rounded-2xl px-4 py-3 text-center">
          <span className="text-2xl font-display font-extrabold tracking-[0.25em]">
            {code}
          </span>
        </div>
        <button
          onClick={copyCode}
          className={`tap-scale flex items-center gap-1.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
            copied ? "bg-emerald-500 text-white" : "bg-white text-blue-700 hover:shadow-lg"
          }`}
        >
          {copied ? <Check className="w-4 h-4" strokeWidth={3} /> : <Copy className="w-4 h-4" strokeWidth={2.5} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <button
        onClick={copyLink}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-blue-200 hover:text-white transition-colors relative"
      >
        <Link2 className="w-3.5 h-3.5" strokeWidth={2.5} />
        Or copy invite link
      </button>
    </div>
  );
}
