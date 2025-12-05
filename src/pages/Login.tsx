import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, Zap, Shield, ArrowRight, Sparkles } from "lucide-react";

const Login = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  // Redirect to dashboard when connected
  useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orb */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-accent/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/40 to-primary/20 rounded-full blur-3xl" />
        
        {/* Floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
        <div className="absolute top-2/3 right-1/4 w-5 h-5 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0066ff08_1px,transparent_1px),linear-gradient(to_bottom,#0066ff08_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-syne font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PayMe
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/10 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">Simple & Secure Payments</span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-syne font-bold text-foreground leading-tight">
              Your Simple
              <span className="block bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent">
                Payment Hub
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Create payment links, receive crypto, and manage your transactions seamlessly across multiple chains.
            </p>
          </div>

          {/* Connect Wallet Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-primary/10 border border-white/50 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-syne font-semibold text-foreground">Get Started</h2>
              <p className="text-sm text-muted-foreground">Connect your wallet to access your dashboard</p>
            </div>
            
            {/* Connect Button Container */}
            <div className="flex justify-center">
              <ConnectButton.Custom>
                {({ openConnectModal, mounted }) => {
                  const ready = mounted;
                  
                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      <button
                        onClick={openConnectModal}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Wallet className="w-5 h-5" />
                        <span>Connect Wallet</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden">
                          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>
                      </button>
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {/* Security note */}
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Your wallet stays in your control. We never access your private keys.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Instant</span>
              <span className="text-xs text-muted-foreground">Fast transactions</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Secure</span>
              <span className="text-xs text-muted-foreground">Non-custodial</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Multi-Chain</span>
              <span className="text-xs text-muted-foreground">ETH, BNB & more</span>
            </div>
          </div>
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

export default Login;

