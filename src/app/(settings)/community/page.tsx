"use client";

import { 
  X, 
  MessageCircle, 
  Twitter, 
  Github, 
  ExternalLink,
  Users,
  MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommunityPage() {
  const router = useRouter();

  const platforms = [
    { name: "Discord", icon: MessageSquare, description: "Real-time chat and community support", link: "#", color: "text-[#5865F2]" },
    { name: "Twitter / X", icon: Twitter, description: "Latest updates and announcements", link: "#", color: "text-white" },
    { name: "GitHub", icon: Github, description: "Contribute to our open source components", link: "#", color: "text-zinc-400" },
  ];

  return (
    <div className="w-full min-h-full flex items-start justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-[800px] bg-[#1c1c1e] rounded-2xl border border-zinc-800/50 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400">
               <Users className="h-6 w-6" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-white">Join the Community</h2>
               <p className="text-zinc-500 text-sm">Follow us and connect with the Fuseion ecosystem.</p>
             </div>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Channels */}
        <div className="p-8 pt-2 grid grid-cols-1 gap-4">
          {platforms.map((platform) => (
            <button
              key={platform.name}
              className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all text-left"
            >
              <div className="flex items-center gap-5">
                <div className={`h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center ${platform.color}`}>
                  <platform.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{platform.name}</h3>
                  <p className="text-sm text-zinc-500">{platform.description}</p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-zinc-700" />
            </button>
          ))}
        </div>

        <div className="p-8 bg-zinc-900/10 border-t border-zinc-800/50 text-center">
          <p className="text-xs text-zinc-600 font-medium">Looking for direct human support? Email us at <span className="text-blue-500 underline decoration-blue-500/30">support@fuseion.example.com</span></p>
        </div>

      </div>
    </div>
  );
}
