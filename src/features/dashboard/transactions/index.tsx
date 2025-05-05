import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { SiteHeaderTransaction } from "./components/SiteHeaderTransaction";
import { TransactionTable } from "./components/TransactionTable";

const DashboardTransactionsPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeaderTransaction />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Your Transactions</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all your transactions in one place
            </p>
          </div>
          <TransactionTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardTransactionsPage;
