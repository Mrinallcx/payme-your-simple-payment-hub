import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppNavbar } from "@/components/AppNavbar";
import { DashboardCard } from "@/components/DashboardCard";
import { PaymentLinkItem } from "@/components/PaymentLinkItem";
import { QuickActions } from "@/components/QuickActions";
import { CreateLinkModal } from "@/components/CreateLinkModal";
import { Button } from "@/components/ui/button";
import { Plus, Link2, Loader2, Receipt, ArrowDownLeft, CheckCircle2, ExternalLink, Wallet, Sparkles, ArrowRight } from "lucide-react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { getAllPaymentRequests } from "@/lib/api";
import { getExplorerUrl } from "@/lib/contracts";

const formatDate = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    }
    return `${hours}h ago`;
  }
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const Index = () => {
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Wallet connection
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  // React Query for fetching payment data
  const { data, isLoading } = useQuery({
    queryKey: ['paymentRequests', address],
    queryFn: () => getAllPaymentRequests(address!),
    enabled: isConnected && !!address,
    staleTime: 10000,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  // Derive payment links and transactions from query data
  const paymentLinks = data?.requests?.slice(0, 4) ?? [];
  const recentTransactions = data?.requests?.filter(r => r.status === 'PAID').slice(0, 4) ?? [];

  const handleCreateLinkClick = () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    setIsCreateLinkOpen(true);
  };

  const handleLinkCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['paymentRequests', address] });
  };

  const handleDelete = () => {
    queryClient.invalidateQueries({ queryKey: ['paymentRequests', address] });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50/50 via-white to-primary/5 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-blue-200/30 to-primary/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0066ff05_1px,transparent_1px),linear-gradient(to_bottom,#0066ff05_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>

          <AppNavbar />
          
          <main className="flex-1 p-6 relative z-10">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header Section */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-primary/10 shadow-sm mb-4">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-foreground/70">Your Payment Hub</span>
                  </div>
                  <h1 className="text-4xl font-syne font-bold text-foreground mb-2">
                    Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    {isConnected 
                      ? "Welcome back! Here's what's happening with your payments."
                      : "Connect your wallet to view your payments."}
                  </p>
                </div>
              </div>

              {/* Connect Wallet Prompt */}
              {!isConnected ? (
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 text-center shadow-xl shadow-primary/5 border border-white/50">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/10">
                    <Wallet className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-syne font-bold mb-3">Connect Your Wallet</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Connect your wallet to create payment links and view your transaction history
                  </p>
                  <Button 
                    onClick={() => openConnectModal?.()} 
                    className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 rounded-xl px-8 py-6 text-base"
                  >
                    <Wallet className="h-5 w-5" />
                    Connect Wallet
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <DashboardCard 
                      title="Recent Transactions"
                      action={
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs hover:bg-primary/10 hover:text-primary transition-colors rounded-lg gap-1"
                          onClick={() => navigate('/transactions')}
                        >
                          View All
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      }
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">Loading...</span>
                          </div>
                        </div>
                      ) : recentTransactions.length > 0 ? (
                        <div className="space-y-1">
                          {recentTransactions.map((txn) => (
                            <div 
                              key={txn.id} 
                              className="flex items-center justify-between py-3 border-b last:border-0 border-border/50 hover:bg-gradient-to-r hover:from-transparent hover:to-green-500/5 transition-colors duration-200 -mx-2 px-2 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/20 shadow-sm">
                                  <ArrowDownLeft className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {txn.description?.trim() ? txn.description : 'Payment received'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{formatDate(txn.paidAt!)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-sm font-bold text-green-600">
                                    +{txn.amount} {txn.token}
                                  </p>
                                  <div className="flex items-center gap-1 justify-end">
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                    <span className="text-xs text-green-600 font-medium">Success</span>
                                  </div>
                                </div>
                                {txn.txHash && (
                                  <a
                                    href={`${getExplorerUrl(txn.network)}/tx/${txn.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                                    title="View on Explorer"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-4 shadow-inner">
                            <Receipt className="h-7 w-7 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium text-foreground mb-1">No transactions yet</p>
                          <p className="text-xs text-muted-foreground">Completed payments will appear here</p>
                        </div>
                      )}
                    </DashboardCard>

                    {/* Payment Links */}
                    <DashboardCard 
                      title="Payment Links"
                      action={
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs gap-1 hover:bg-primary/10 hover:text-primary transition-colors rounded-lg"
                          onClick={handleCreateLinkClick}
                        >
                          <Plus className="h-3 w-3" />
                          New
                        </Button>
                      }
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">Loading...</span>
                          </div>
                        </div>
                      ) : paymentLinks.length > 0 ? (
                        <div className="space-y-1">
                          {paymentLinks.map((link) => (
                            <PaymentLinkItem 
                              key={link.id} 
                              id={link.id}
                              title={`${link.amount} ${link.token}`}
                              amount={link.amount}
                              token={link.token}
                              status={link.status}
                              link={`${window.location.origin}/pay/${link.id}`}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-4 shadow-inner">
                            <Link2 className="h-7 w-7 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium text-foreground mb-1">No payment links</p>
                          <p className="text-xs text-muted-foreground">Create one to get started</p>
                        </div>
                      )}
                    </DashboardCard>
                  </div>

                  <QuickActions onCreateLink={handleCreateLinkClick} />
                </>
              )}
            </div>
          </main>
        </div>
      </div>
      
      <CreateLinkModal 
        open={isCreateLinkOpen} 
        onOpenChange={setIsCreateLinkOpen}
        onCreateLink={handleLinkCreated}
      />
    </SidebarProvider>
  );
};

export default Index;
