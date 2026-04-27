import { TriangleAlert, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useRouter } from "next/navigation";

export const ErrorMessage = ({ error, cause, onRetry }: { error: string; cause?: string; onRetry?: () => void }) => {
  const router = useRouter();

  const isRateLimit = error.toLowerCase().includes("rate limit") || error.toLowerCase().includes("quota");

  return (
    <Alert
      variant="destructive"
      className="bg-red-950/20 border-red-500/30 text-red-200 shadow-lg backdrop-blur-sm"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-red-500/20 rounded-full shrink-0 mt-0.5">
          {isRateLimit ? <AlertCircle className="h-5 w-5 text-red-400" /> : <TriangleAlert className="h-5 w-5 text-red-400" />}
        </div>
        <div className="flex flex-col gap-3 flex-1 pt-1">
          <AlertTitle className="text-base font-bold text-red-100 flex items-center justify-between">
            {isRateLimit ? "Rate Limit Reached" : "Request Error"}
          </AlertTitle>
          <AlertDescription className="text-red-200/90 text-sm leading-relaxed">
            {error ?? "An error occurred. Something went wrong."}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-xs text-red-300/80">
                Switching to a different model usually helps.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-100 text-xs gap-1.5"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-3 w-3" />
                  Try Again
                </Button>
                <a
                  className="text-xs font-semibold text-red-300 hover:text-red-100 underline underline-offset-4"
                  href="mailto:amegwu255@gmail.com"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </AlertDescription>
          
          {cause && (
            <div className="mt-2 group">
              <div className="text-[10px] uppercase font-bold text-red-400/60 mb-1 flex items-center gap-1.5">
                Technical Details
              </div>
              <div className="text-[11px] font-mono bg-black/40 p-3 rounded-md border border-red-500/10 text-red-300/80 max-h-40 overflow-y-auto break-all whitespace-pre-wrap leading-tight">
                {cause}
              </div>
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};
