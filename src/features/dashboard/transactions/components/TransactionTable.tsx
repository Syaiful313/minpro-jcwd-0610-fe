"use client";
import PaginationSection from "@/components/PaginationSection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetOrganizerTransactions from "@/hooks/api/dasboard-organizer/useGetOrganizerTransactions";
import useUpdateTransaction from "@/hooks/api/dasboard-organizer/useUpdateTransaction";
import { formatCurrency } from "@/lib/utils";
import { TransactionStatus } from "@/types/enums";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CheckCircle, ChevronDownIcon, FileText, MoreVerticalIcon, XCircle } from "lucide-react";
import Image from "next/image";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";

interface TransactionRow {
  id: number;
  user: {
    fullName: string;
    email: string;
  };
  event: {
    name: string;
    startDate: string;
  };
  ticketType: {
    name: string;
    price: number;
  } | null;
  quantity: number;
  totalPrice: number;
  status: TransactionStatus;
  paymentProofUrl: string;
  createdAt: string;
}

function getStatusBadgeVariant(status: TransactionStatus) {
  switch (status) {
    case TransactionStatus.WAITING_FOR_PAYMENT:
      return "default";
    case TransactionStatus.WAITING_FOR_ADMIN_CONFIRMATION:
      return "outline";
    case TransactionStatus.DONE:
      return "default";
    case TransactionStatus.REJECTED:
      return "destructive";
    case TransactionStatus.EXPIRED:
      return "secondary";
    case TransactionStatus.CANCELED:
      return "destructive";
    default:
      return "outline";
  }
}

function getStatusLabel(status: TransactionStatus) {
  switch (status) {
    case TransactionStatus.WAITING_FOR_PAYMENT:
      return "Waiting for Payment";
    case TransactionStatus.WAITING_FOR_ADMIN_CONFIRMATION:
      return "Waiting for Confirmation";
    case TransactionStatus.DONE:
      return "Completed";
    case TransactionStatus.REJECTED:
      return "Rejected";
    case TransactionStatus.EXPIRED:
      return "Expired";
    case TransactionStatus.CANCELED:
      return "Canceled";
    default:
      return status;
  }
}

export function TransactionTable() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounceValue(searchQuery, 500);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | "ALL">("ALL");
  const [columnVisibility, setColumnVisibility] = React.useState({});
  // Add flag to prevent repeated page resets
  const [skipPageReset, setSkipPageReset] = useState(false);

  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  
  // Dialog for transaction confirmation
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);

  // Using created hooks
  const updateTransactionMutation = useUpdateTransaction();

  const {
    data: transactionsData,
    isLoading,
    error,
  } = useGetOrganizerTransactions({
    page: currentPage,
    take: pageSize,
    search: debouncedSearch,
    status: selectedStatus,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Memoize data to avoid unnecessary re-renders
  const memoizedData = useMemo(() => transactionsData?.data || [], [transactionsData]);

  // Effect to handle filter changes without causing a loop
  useEffect(() => {
    // Avoid repeated page resets by adding a flag
    setSkipPageReset(true);
    
    // Reset timeout to avoid conflicts
    const timeoutId = setTimeout(() => {
      setSkipPageReset(false);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [transactionsData]);

  // Effect to reset page when filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearch, selectedStatus]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    try {
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      return date.toLocaleDateString("en-US", options);
    }
  };

  const handleViewProof = (url: string) => {
    setSelectedProofUrl(url);
    setIsPreviewDialogOpen(true);
  };

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Don't set currentPage here, as it will be handled by useEffect
  }, []);

  const handleStatusChange = useCallback((status: TransactionStatus | "ALL") => {
    setSelectedStatus(status);
    // Don't set currentPage here, as it will be handled by useEffect
  }, []);

  // Function to handle transaction confirmation
  const handleConfirmTransaction = useCallback((transactionId: number) => {
    setSelectedTransaction(transactionId);
    setIsConfirmDialogOpen(true);
  }, []);

  // Function to handle transaction rejection
  const handleRejectTransaction = useCallback((transactionId: number) => {
    setSelectedTransaction(transactionId);
    setIsRejectDialogOpen(true);
  }, []);

  // Function to execute transaction confirmation
  const confirmTransaction = useCallback(() => {
    if (selectedTransaction) {
      updateTransactionMutation.mutate({
        transactionId: selectedTransaction,
        isAccepted: true
      });
      setIsConfirmDialogOpen(false);
    }
  }, [selectedTransaction, updateTransactionMutation]);

  // Function to execute transaction rejection
  const rejectTransaction = useCallback(() => {
    if (selectedTransaction) {
      updateTransactionMutation.mutate({
        transactionId: selectedTransaction,
        isRejected: true
      });
      setIsRejectDialogOpen(false);
    }
  }, [selectedTransaction, updateTransactionMutation]);

  const columns: ColumnDef<TransactionRow>[] = useMemo(() => [
    {
      accessorKey: "index",
      header: () => <div className="text-center">No.</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "user.fullName",
      header: () => <div className="text-left">Customer</div>,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium">{row.original.user.fullName}</div>
          <div className="text-muted-foreground text-sm">
            {row.original.user.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "event.name",
      header: () => <div className="text-left">Event</div>,
      cell: ({ row }) => (
        <div className="max-w-64 truncate font-medium">
          {row.original.event.name}
        </div>
      ),
    },
    {
      accessorKey: "ticketType.name",
      header: () => <div className="text-left">Ticket Type</div>,
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.ticketType?.name || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-center">Qty</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.quantity}</div>
      ),
    },
    {
      accessorKey: "totalPrice",
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.original.totalPrice)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant={getStatusBadgeVariant(row.original.status)}>
            {getStatusLabel(row.original.status)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Date</div>,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-center">
          {formatDate(row.original.createdAt)}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-muted-foreground data-[state=open]:bg-muted flex size-8"
                size="icon"
              >
                <MoreVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => handleViewProof(row.original.paymentProofUrl)}
              >
                <FileText className="h-4 w-4" /> View Payment Proof
              </DropdownMenuItem>
              
              {/* Only show these options if transaction status is WAITING_FOR_ADMIN_CONFIRMATION */}
              {row.original.status === TransactionStatus.WAITING_FOR_ADMIN_CONFIRMATION && (
                <>
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-green-600"
                    onClick={() => handleConfirmTransaction(row.original.id)}
                  >
                    <CheckCircle className="h-4 w-4" /> Accept Transaction
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-600"
                    onClick={() => handleRejectTransaction(row.original.id)}
                  >
                    <XCircle className="h-4 w-4" /> Reject Transaction
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ], [handleConfirmTransaction, handleRejectTransaction]);

  // Improved table configuration
  const table = useReactTable({
    data: memoizedData,
    columns,
    state: {
      columnVisibility,
    },
    // Disable autoResetPageIndex to avoid loops
    autoResetPageIndex: !skipPageReset,
    getRowId: (row) => row.id.toString(),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const statusOptions = [
    { value: "ALL", label: "All Statuses" },
    {
      value: TransactionStatus.WAITING_FOR_PAYMENT,
      label: "Waiting for Payment",
    },
    {
      value: TransactionStatus.WAITING_FOR_ADMIN_CONFIRMATION,
      label: "Waiting for Confirmation",
    },
    { value: TransactionStatus.DONE, label: "Completed" },
    { value: TransactionStatus.REJECTED, label: "Rejected" },
    { value: TransactionStatus.EXPIRED, label: "Expired" },
    { value: TransactionStatus.CANCELED, label: "Canceled" },
  ];

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:max-w-md"
          />
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <span>
                    Status:{" "}
                    {
                      statusOptions.find((opt) => opt.value === selectedStatus)
                        ?.label
                    }
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className="flex items-center gap-2"
                    onClick={() =>
                      handleStatusChange(
                        option.value as TransactionStatus | "ALL",
                      )
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="h-12 px-2 font-semibold whitespace-nowrap text-gray-700 md:px-4"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No transactions found. Try a different search.
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination - responsive design */}
          {transactionsData && transactionsData.meta && (
            <div className="border-t p-2 md:p-4">
              <PaginationSection
                page={transactionsData.meta.page}
                take={transactionsData.meta.take}
                total={transactionsData.meta.total}
                onChangePage={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Dialog for viewing payment proof */}
      <AlertDialog
        open={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
      >
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Proof</AlertDialogTitle>
          </AlertDialogHeader>
          {selectedProofUrl && (
            <div className="relative h-96 w-full">
              <Image
                src={selectedProofUrl}
                alt="Payment Proof"
                fill
                className="object-contain"
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for confirming transaction acceptance */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this transaction? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmTransaction}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for confirming transaction rejection */}
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this transaction?
              This action cannot be undone and tickets will be returned to stock.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={rejectTransaction}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}