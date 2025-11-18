import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppNavbar } from "@/components/AppNavbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Copy, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface WalletData {
  id: string;
  name: string;
  address: string;
  balance: string;
  currency: string;
}

const mockWallets: WalletData[] = [
  {
    id: "1",
    name: "Main Wallet",
    address: "0xAb3c4D5e6F7890aBcDeF1234567890AbCdEf12",
    balance: "2,450.00",
    currency: "USD",
  },
  {
    id: "2",
    name: "Business Wallet",
    address: "0x1234567890AbCdEf1234567890AbCdEf123456",
    balance: "5,780.50",
    currency: "USD",
  },
  {
    id: "3",
    name: "Savings Wallet",
    address: "0xDeF1234567890AbCdEf1234567890AbCdEf123",
    balance: "10,250.00",
    currency: "USD",
  },
];

const Wallets = () => {
  const [wallets, setWallets] = useState<WalletData[]>(mockWallets);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Wallet address copied to clipboard!");
  };

  const handleDeleteWallet = (id: string, name: string) => {
    setWallets(wallets.filter((wallet) => wallet.id !== id));
    toast.success(`${name} deleted successfully`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <AppNavbar />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Wallets</h1>
                  <p className="text-muted-foreground">Manage your connected wallets and balances.</p>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Wallet
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wallets.map((wallet) => (
                  <Card key={wallet.id} className="p-5 border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Wallet className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{wallet.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-2xl font-bold text-foreground">${wallet.balance}</p>
                      <p className="text-xs text-muted-foreground">{wallet.currency}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handleCopyAddress(wallet.address)}
                      >
                        <Copy className="h-3 w-3" />
                        Copy Address
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteWallet(wallet.id, wallet.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Wallets;
