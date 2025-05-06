"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  SearchIcon,
  PlusIcon,
  LoaderIcon,
  CheckIcon, // Tambahkan ikon untuk persetujuan
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User } from "@/types/user";
import useGetUsers from "@/hooks/api/admin/useGetUsers";
import useUpdateRole from "@/hooks/api/admin/useUpdateRole"; // Import hook untuk update role
import { toast } from "react-toastify"; // Import toast untuk notifikasi

// Import komponen dialog untuk konfirmasi
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

export function UserTable() {
  // State untuk filter dan sorting
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // State untuk pagination dan pencarian
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // State untuk filter organizer
  const [organizerPending, setOrganizerPending] = useState(false);
  const [organizerApproved, setOrganizerApproved] = useState(false);

  // State untuk dialog konfirmasi persetujuan
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch data menggunakan custom hook
  const { data, isLoading, error } = useGetUsers({
    page: pagination.pageIndex + 1,
    take: pagination.pageSize,
    sortBy: sorting.length > 0 ? sorting[0].id : "createdAt",
    sortOrder: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc",
    search: debouncedSearch,
    organizerPending,
    organizerApproved,
  });

  // Gunakan hook untuk mutation update role
  const updateRoleMutation = useUpdateRole();

  // Handler untuk membuka dialog konfirmasi
  const handleOpenConfirmDialog = (userId: number) => {
    setSelectedUserId(userId);
    setIsConfirmDialogOpen(true);
  };

  // Handler untuk persetujuan organizer
  const handleApproveOrganizer = async () => {
    if (selectedUserId) {
      try {
        await updateRoleMutation.mutateAsync({
          userIdTarget: selectedUserId,
        });
        // Dialog akan ditutup on success karena refresh dari useUpdateRole
      } catch (error) {
        // Error sudah ditangani di useUpdateRole
        setIsConfirmDialogOpen(false);
      }
    }
  };

  // Definisi kolom tabel
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "index",
      header: () => <div className="text-center">No.</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "fullName",
      header: "Nama Lengkap",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.profilePicture ? (
            <img
              src={row.original.profilePicture}
              alt={row.original.fullName}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium uppercase">
              {row.original.fullName.charAt(0)}
            </div>
          )}
          <div>{row.original.fullName}</div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Peran",
      cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
    },
    {
      accessorKey: "createdAt",
      header: "Tgl Pendaftaran",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center">
          {/* Tambahkan tombol approve langsung jika organizer pending */}
          {row.original.organizerId &&
            !row.original.organizerId[0].acceptedAt && (
              <Button
                variant="ghost"
                size="icon"
                className="mr-1 h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => handleOpenConfirmDialog(row.original.id)}
                title="Setujui Organizer"
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
            )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
              <DropdownMenuItem>Edit Pengguna</DropdownMenuItem>
              {row.original.organizerId &&
                !row.original.organizerId[0].acceptedAt && (
                  <DropdownMenuItem
                    onClick={() => handleOpenConfirmDialog(row.original.id)}
                  >
                    Setujui Organizer
                  </DropdownMenuItem>
                )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    manualPagination: true,
    pageCount: data ? Math.ceil(data.meta.total / data.meta.take) : 0,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Manajemen Pengguna</h2>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Cari nama, email, atau peran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />
          <Button type="submit" size="icon" className="h-10 w-10">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="organizerPending"
              checked={organizerPending}
              onCheckedChange={(checked) => setOrganizerPending(!!checked)}
            />
            <Label htmlFor="organizerPending">Organizer Pending</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="organizerApproved"
              checked={organizerApproved}
              onCheckedChange={(checked) => setOrganizerApproved(!!checked)}
            />
            <Label htmlFor="organizerApproved">Organizer Disetujui</Label>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <ColumnsIcon className="mr-2 h-4 w-4" />
                Kolom
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "fullName"
                        ? "Nama Lengkap"
                        : column.id === "createdAt"
                          ? "Tgl Pendaftaran"
                          : column.id === "organizerStatus"
                            ? "Status Organizer"
                            : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
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
                  <div className="flex items-center justify-center">
                    <LoaderIcon className="text-muted-foreground h-8 w-8 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.data.length ? (
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
                  Tidak ada data pengguna.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-muted-foreground text-sm">
          {data?.meta?.total
            ? `Menampilkan ${pagination.pageIndex * pagination.pageSize + 1}-${Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.meta.total)} dari ${data.meta.total} pengguna`
            : "Tidak ada data"}
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ke halaman pertama</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ke halaman sebelumnya</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="mx-2 text-sm font-medium">
              Halaman {pagination.pageIndex + 1} dari{" "}
              {table.getPageCount() || 1}
            </span>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ke halaman berikutnya</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ke halaman terakhir</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog konfirmasi persetujuan organizer */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Setujui Permintaan Organizer</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menyetujui permintaan ini? Pengguna akan
              mendapatkan peran Organizer dan akses ke fitur organizer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveOrganizer}
              disabled={updateRoleMutation.isPending}
            >
              {updateRoleMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                  Memproses...
                </span>
              ) : (
                "Setujui"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
