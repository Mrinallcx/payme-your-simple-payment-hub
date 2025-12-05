import { Plus, ArrowRight, Sparkles } from "lucide-react";

interface QuickActionsProps {
  onCreateLink: () => void;
}

export function QuickActions({ onCreateLink }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <button 
        className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-white to-accent/10 border border-primary/10 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1" 
        onClick={onCreateLink}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        
        <div className="relative flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 transition-all duration-300">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-syne font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
              Create Payment Link
            </h3>
            <p className="text-sm text-muted-foreground">
              Generate a new payment link instantly
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </button>
    </div>
  );
}
