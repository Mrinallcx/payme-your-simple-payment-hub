import { MdSpaceDashboard } from "react-icons/md";
import { IoLink, IoLogOut } from "react-icons/io5";
import { FaMoneyBill } from "react-icons/fa";
import { NavLink } from "@/components/NavLink";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { Wallet, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: MdSpaceDashboard },
  { title: "Payment Links", url: "/payment-links", icon: IoLink },
  { title: "Transactions", url: "/transactions", icon: FaMoneyBill },
];

export function AppSidebar() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Sidebar className="border-r border-border/50 bg-gradient-to-b from-white to-blue-50/30">
      <SidebarContent>
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-syne font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PayMe
            </span>
          </div>
        </div>
        
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/10 transition-all duration-200 rounded-xl group"
                      activeClassName="bg-gradient-to-r from-primary/10 to-accent/20 text-primary font-semibold shadow-sm"
                    >
                      <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-border/50">
        {!isConnected ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Connect to get started</span>
            </div>
            <ConnectButton />
          </div>
        ) : (
          <>
            {/* Connected Wallet Card */}
            <div className="flex items-center gap-3 mb-3 p-3 bg-gradient-to-r from-primary/5 to-accent/10 rounded-xl border border-primary/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {address?.slice(2, 4).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Connected</p>
                <p className="text-xs text-muted-foreground truncate font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            </div>
            
            {/* Disconnect Button */}
            <SidebarMenuButton 
              className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all duration-200"
              onClick={() => disconnect()}
            >
              <IoLogOut className="h-4 w-4 mr-2" />
              <span>Disconnect</span>
            </SidebarMenuButton>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
