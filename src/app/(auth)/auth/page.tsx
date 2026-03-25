import Link from "next/link";
import { auth } from "../auth";
import { loginAction } from "../actions";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/chat");
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2" />
      </div>

      {/* Top Left Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Button variant="ghost" asChild className="group text-muted-foreground hover:text-foreground">
          <Link href="/" className="flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>

      {/* Centered Auth Card */}
      <div className="relative z-10 w-full max-w-md p-6 animate-in fade-in zoom-in duration-500">
        <div className="glass-card rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">

          {/* Header */}
          <div className="text-center space-y-6 mb-8">
            <div className="flex justify-center">
              <div className="size-16 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <img src="/fuseion.png" alt="Fuseion" className="size-10 object-contain" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Fuseion</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign in to unlock your creative potential
              </p>
            </div>
          </div>

          {/* Login Actions */}
          <div className="space-y-4">
            <form action={loginAction}>
              <Button variant="outline" className="w-full h-12 relative overflow-hidden group border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center justify-center gap-3 font-medium">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continue with Google</span>
                </div>
              </Button>
            </form>
          </div>

          {/* Footer / Legal */}
          <div className="mt-8 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-black/40 px-2 text-muted-foreground backdrop-blur-sm">
                  Protected & Secure
                </span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground/60 leading-relaxed px-4">
              By continuing, you agree to our{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-primary transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
