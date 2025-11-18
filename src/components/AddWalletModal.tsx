import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface AddWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWallet: (wallet: { token: string; network: string; address: string }) => void;
}

const tokens = ["ETH", "LCX", "USDT", "BASE", "SOL", "BTC"];
const networks = ["ETH", "BASE", "SOL", "BNB (BEP20)"];

export function AddWalletModal({ open, onOpenChange, onAddWallet }: AddWalletModalProps) {
  const [step, setStep] = useState(1);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const handleClose = () => {
    setStep(1);
    setSelectedTokens([]);
    setSelectedNetwork("");
    setWalletAddress("");
    onOpenChange(false);
  };

  const handleNetworkSelect = (network: string) => {
    setSelectedNetwork(network);
    setStep(2);
  };

  const handleTokenToggle = (token: string) => {
    setSelectedTokens((prev) =>
      prev.includes(token)
        ? prev.filter((t) => t !== token)
        : [...prev, token]
    );
  };

  const handleContinueToAddress = () => {
    if (selectedTokens.length === 0) {
      toast.error("Please select at least one token");
      return;
    }
    setStep(3);
  };

  const handleAddWallet = () => {
    if (!walletAddress.trim()) {
      toast.error("Please enter a wallet address");
      return;
    }

    // Add wallet for each selected token
    selectedTokens.forEach((token) => {
      onAddWallet({
        token,
        network: selectedNetwork,
        address: walletAddress,
      });
    });

    toast.success(`Wallet added with ${selectedTokens.length} token(s)!`);
    handleClose();
  };

  const handleBack = () => {
    if (step === 2) {
      setSelectedTokens([]);
    } else if (step === 3) {
      setWalletAddress("");
    }
    setStep(step - 1);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Select Network"}
            {step === 2 && "Select Tokens"}
            {step === 3 && "Enter Wallet Address"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Choose which network you want to use"}
            {step === 2 && `Select one or more tokens for ${selectedNetwork}`}
            {step === 3 && `Enter your wallet address for ${selectedNetwork}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 1 && (
            <div className="space-y-3">
              {networks.map((network) => (
                <button
                  key={network}
                  onClick={() => handleNetworkSelect(network)}
                  className="w-full p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left font-medium text-foreground flex items-center justify-between"
                >
                  {network}
                  {selectedNetwork === network && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-2">
                Select all tokens you want to use with this address
              </p>
              <div className="grid grid-cols-2 gap-3">
                {tokens.map((token) => (
                  <button
                    key={token}
                    onClick={() => handleTokenToggle(token)}
                    className={`p-4 border rounded-lg transition-all text-center font-medium ${
                      selectedTokens.includes(token)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {token}
                      {selectedTokens.includes(token) && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {selectedTokens.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedTokens.length} token(s) selected
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <Input
                  id="wallet-address"
                  placeholder="Enter your wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="font-medium text-foreground">{selectedNetwork}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tokens:</span>
                  <span className="font-medium text-foreground">{selectedTokens.join(", ")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {step === 1 && (
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handleContinueToAddress} className="flex-1">
              Continue
            </Button>
          )}
          {step === 3 && (
            <Button onClick={handleAddWallet} className="flex-1">
              Add Wallet
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
