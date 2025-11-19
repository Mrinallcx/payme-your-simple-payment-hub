import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, CheckCircle2 } from "lucide-react";

type PaymentStep = "select-network" | "payment" | "success";

// Mock data - in production this would come from an API/database
const MOCK_PAYMENT_LINK = {
  id: "1",
  title: "Website Design Project",
  description: "Final payment for redesign",
  amount: "2.5",
  token: "ETH",
  networks: ["ETH", "BASE"], // Multiple networks from CreateLinkModal
  creatorName: "John Doe",
  creatorWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
  wallets: {
    ETH: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
    BASE: "0x8a4C5f3b2D1e9A7F6C8E2B3D4A5F6C7D8E9F0A1B",
  },
  gasFee: "0.002",
};

export default function PaymentView() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<PaymentStep>("select-network");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [transactionHash, setTransactionHash] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const paymentData = MOCK_PAYMENT_LINK;

  // Auto-select if only one network
  useEffect(() => {
    if (paymentData.networks.length === 1) {
      setSelectedNetwork(paymentData.networks[0]);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (step === "payment" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            toast.error("Transaction timeout. Please try again.");
            setStep("select-network");
            setTimeRemaining(120);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleContinueToPayment = () => {
    if (!selectedNetwork) {
      toast.error("Please select a network");
      return;
    }
    setStep("payment");
    setTimeRemaining(120);
  };

  const handlePaymentDone = () => {
    if (!transactionHash) {
      toast.error("Please enter transaction hash");
      return;
    }
    setStep("success");
    toast.success("Payment confirmed!");
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
      toast.success("Screenshot uploaded!");
    }
  };

  const selectedWalletAddress = selectedNetwork ? paymentData.wallets[selectedNetwork as keyof typeof paymentData.wallets] : "";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {step === "select-network" && (
          <Card className="p-6 md:p-8 border border-border">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {paymentData.title}
                </h1>
                <p className="text-muted-foreground">{paymentData.description}</p>
              </div>

              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <p className="text-3xl font-bold text-foreground">
                  {paymentData.amount} {paymentData.token}
                </p>
                <p className="text-sm text-muted-foreground mt-1">+ {paymentData.gasFee} {paymentData.token} gas fee</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Payment to</p>
                <p className="font-semibold text-foreground mb-2">{paymentData.creatorName}</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded font-mono">
                    {paymentData.creatorWallet.slice(0, 10)}...{paymentData.creatorWallet.slice(-8)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopyAddress(paymentData.creatorWallet)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-foreground mb-3 block">Select Network</Label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentData.networks.map((network) => (
                    <Button
                      key={network}
                      type="button"
                      variant={selectedNetwork === network ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedNetwork(network)}
                    >
                      {network}
                    </Button>
                  ))}
                </div>
                
                {selectedNetwork && (
                  <div className="mt-4 p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground mb-2">Wallet Address</p>
                    <code className="text-xs text-foreground break-all font-mono">
                      {selectedWalletAddress}
                    </code>
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleContinueToPayment}
                disabled={!selectedNetwork}
              >
                Continue to Payment
              </Button>
            </div>
          </Card>
        )}

        {step === "payment" && (
          <Card className="p-6 md:p-8 border border-border">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Complete Payment</h2>
                  <p className="text-sm text-muted-foreground mt-1">Scan QR or copy address</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold tabular-nums ${timeRemaining < 30 ? "text-destructive" : "text-foreground"}`}>
                    {formatTime(timeRemaining)}
                  </p>
                  <p className="text-xs text-muted-foreground">remaining</p>
                </div>
              </div>

              <div className="text-center py-6 border-b">
                <div className="inline-flex items-center justify-center w-48 h-48 bg-muted rounded-lg mb-4">
                  <div className="text-muted-foreground text-sm">QR Code</div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {paymentData.amount} {paymentData.token}
                </p>
                <p className="text-sm text-muted-foreground mt-1">+ {paymentData.gasFee} gas fee</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground mb-3">How to Pay</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Open your {paymentData.token} wallet</li>
                    <li>Scan the QR code or copy the address below</li>
                    <li>Send exactly {paymentData.amount} {paymentData.token} on {selectedNetwork} network</li>
                    <li>Click "Payment Done" after sending</li>
                  </ol>
                </div>

                <div>
                  <Label className="text-foreground mb-2 block">Wallet Address</Label>
                  <div className="flex gap-2">
                    <code className="flex-1 text-xs text-foreground bg-muted px-3 py-2 rounded break-all font-mono">
                      {selectedWalletAddress}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopyAddress(selectedWalletAddress)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-foreground mb-2 block">Transaction Hash</Label>
                  <Input
                    placeholder="0x..."
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePaymentDone}
                  disabled={!transactionHash}
                >
                  Payment Done
                </Button>
              </div>
            </div>
          </Card>
        )}

        {step === "success" && (
          <Card className="p-6 md:p-8 border border-border">
            <div className="space-y-6">
              <div className="text-center pb-6 border-b">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Payment Submitted!</h2>
                <p className="text-muted-foreground">Your payment has been submitted for verification</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold text-foreground">{paymentData.amount} {paymentData.token}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-semibold text-foreground">{paymentData.creatorName}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Network</span>
                  <Badge variant="secondary">{selectedNetwork}</Badge>
                </div>
                <div className="py-3">
                  <p className="text-muted-foreground mb-2">Transaction Hash</p>
                  <code className="text-xs text-foreground break-all bg-muted px-3 py-2 rounded block font-mono">
                    {transactionHash}
                  </code>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-foreground mb-3 block">Upload Screenshot (Optional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                {screenshot && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {screenshot.name}
                  </p>
                )}
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate("/")}
              >
                Done
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
