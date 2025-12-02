import { Bell, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateLinkModal } from "./CreateLinkModal";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
export function AppNavbar() {
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false);
  const navigate = useNavigate();
  const {
    isConnected
  } = useAccount();
  const {
    openConnectModal
  } = useConnectModal();
  const handleCreateLinkClick = () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    setIsCreateLinkOpen(true);
  };
  return <>
      <header className="sticky top-0 z-50 h-16 border-b border-border bg-background">
        <div className="flex h-full items-center justify-between px-6">
          <SidebarTrigger />
          
          <div className="flex items-center gap-3">
            
            
            <Button size="sm" className="gap-2" onClick={handleCreateLinkClick}>
              <Plus className="h-4 w-4" />
              <span>Create Link</span>
            </Button>
            
            
          </div>
        </div>
      </header>
      
      <CreateLinkModal open={isCreateLinkOpen} onOpenChange={setIsCreateLinkOpen} />
    </>;
}