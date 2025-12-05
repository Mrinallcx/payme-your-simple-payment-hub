import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Wallet, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary/5 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary/15 to-accent/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/40 to-primary/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0066ff08_1px,transparent_1px),linear-gradient(to_bottom,#0066ff08_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-syne font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PayMe
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* 404 Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-destructive/20 shadow-sm">
            <Search className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Page Not Found</span>
          </div>

          {/* Big 404 */}
          <div className="relative">
            <h1 className="text-[150px] sm:text-[200px] font-syne font-bold text-foreground/5 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                <h2 className="text-3xl sm:text-4xl font-syne font-bold text-foreground mb-2">
                  Oops!
                </h2>
                <p className="text-lg text-muted-foreground">
                  This page got lost in the blockchain
                </p>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-primary/10 border border-white/50 space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <code className="text-xs bg-muted px-3 py-1.5 rounded-lg text-muted-foreground block">
                {location.pathname}
              </code>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 rounded-xl"
              >
                <Link to="/">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="gap-2 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>
          </div>

          {/* Help text */}
          <p className="text-sm text-muted-foreground">
            Need help? Check out our{" "}
            <Link to="/" className="text-primary hover:underline font-medium">
              homepage
            </Link>{" "}
            to get started.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Built with ❤️ for seamless crypto payments
        </p>
      </footer>
    </div>
  );
};

export default NotFound;
