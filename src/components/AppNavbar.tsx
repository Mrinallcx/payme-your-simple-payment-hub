import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { CreateLinkModal } from "./CreateLinkModal";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export function AppNavbar() {
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const handleCreateLinkClick = () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    setIsCreateLinkOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-16 border-b border-border/50 bg-white/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-6">
          <SidebarTrigger className="hover:bg-primary/5 transition-colors" />
          
          <div className="flex items-center gap-3">
            {/* Create Link Button */}
            <Button 
              size="sm" 
              className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 rounded-xl"
              onClick={handleCreateLinkClick}
            >
              <div className="relative">
                <Plus className="h-4 w-4" />
                <Sparkles className="h-2 w-2 absolute -top-1 -right-1 text-yellow-300" />
              </div>
              <span className="font-semibold">Create Link</span>
            </Button>
          </div>
        </div>
      </header>
      
      <CreateLinkModal open={isCreateLinkOpen} onOpenChange={setIsCreateLinkOpen} />
    </>
  );
}
