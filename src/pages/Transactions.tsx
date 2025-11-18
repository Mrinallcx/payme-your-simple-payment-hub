import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppNavbar } from "@/components/AppNavbar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: string;
  type: "sent" | "received";
  status: "success" | "pending" | "failed";
  amount: string;
  date: string;
  from: string;
  recipient: string;
}

const statusConfig = {
  success: {
    color: "bg-success/10 text-success border-success/20",
    label: "Success",
  },
  pending: {
    color: "bg-warning/10 text-warning border-warning/20",
    label: "Pending",
  },
  failed: {
    color: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Failed",
  },
};

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "received",
    status: "success",
    amount: "1,250.00",
    date: "2025-01-15 10:30 AM",
    from: "0x456a...7c9d",
    recipient: "0x742d...4e8a",
  },
  {
    id: "2",
    type: "sent",
    status: "success",
    amount: "500.00",
    date: "2025-01-14 03:45 PM",
    from: "0x742d...4e8a",
    recipient: "0x893f...2b1c",
  },
  {
    id: "3",
    type: "received",
    status: "pending",
    amount: "750.00",
    date: "2025-01-13 09:15 AM",
    from: "0x123b...5e6f",
    recipient: "0x456a...7c9d",
  },
  {
    id: "4",
    type: "sent",
    status: "failed",
    amount: "200.00",
    date: "2025-01-12 02:20 PM",
    from: "0x742d...4e8a",
    recipient: "0x893f...2b1c",
  },
  {
    id: "5",
    type: "received",
    status: "success",
    amount: "2,100.00",
    date: "2025-01-11 11:00 AM",
    from: "0x789c...1a2b",
    recipient: "0x123b...5e6f",
  },
];

const Transactions = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <AppNavbar />
          
          <main className="flex-1 p-3 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Transactions</h1>
                <p className="text-sm text-muted-foreground">View all your payment transactions</p>
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead className="hidden sm:table-cell">From</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-center w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => {
                        const TypeIcon = transaction.type === "sent" ? ArrowUpRight : ArrowDownLeft;
                        
                        return (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <div className={`p-1.5 rounded-md ${transaction.type === "sent" ? "bg-muted" : "bg-primary/10"}`}>
                                <TypeIcon className={`h-3 w-3 ${transaction.type === "sent" ? "text-foreground" : "text-primary"}`} />
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className="text-xs text-muted-foreground">{transaction.from}</span>
                            </TableCell>
                            <TableCell>
                              <div>
                                <span className="text-xs text-muted-foreground">{transaction.recipient}</span>
                                <p className="text-xs text-muted-foreground md:hidden mt-1">{transaction.date}</p>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-xs text-muted-foreground">{transaction.date}</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-sm font-semibold text-foreground">
                                {transaction.type === "sent" ? "-" : "+"} ${transaction.amount}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Badge variant="outline" className={`text-xs ${statusConfig[transaction.status].color}`}>
                                  {statusConfig[transaction.status].label}
                                </Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Transactions;
