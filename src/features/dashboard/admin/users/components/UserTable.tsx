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
  CheckIcon,
  XIcon,
  EyeIcon,
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
import useApproveOrganizer from "@/hooks/api/admin/useApproveOrganizer";
import useRejectOrganizer from "@/hooks/api/admin/useRejectOrganizer";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UserTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [organizerPending, setOrganizerPending] = useState(false);
  const [organizerApproved, setOrganizerApproved] = useState(false);

  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { data, isLoading, error } = useGetUsers({
    page: pagination.pageIndex + 1,
    take: pagination.pageSize,
    sortBy: sorting.length > 0 ? sorting[0].id : "createdAt",
    sortOrder: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc",
    search: debouncedSearch,
    organizerPending,
    organizerApproved,
  });

  const approveMutation = useApproveOrganizer();
  const rejectMutation = useRejectOrganizer();

  const handleOpenDetailDialog = (user: User) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  const handleOpenApproveDialog = (user: User) => {
    setSelectedUser(user);
    setIsApproveDialogOpen(true);
  };

  const handleOpenRejectDialog = (user: User) => {
    setSelectedUser(user);
    setIsRejectDialogOpen(true);
  };

  const handleApproveOrganizer = async () => {
    if (selectedUser) {
      try {
        console.log("Approving user:", selectedUser.id);
        await approveMutation.mutateAsync({
          userIdTarget: selectedUser.id,
        });
        setIsApproveDialogOpen(false);
      } catch (error) {
        console.error("Error in component when approving:", error);
      }
    }
  };

  const handleRejectOrganizer = async () => {
    if (selectedUser) {
      try {
        await rejectMutation.mutateAsync({
          userIdTarget: selectedUser.id,
        });
        setIsRejectDialogOpen(false);
      } catch (error) {}
    }
  };

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
      accessorKey: "organizer",
      header: "Status Organizer",
      cell: ({ row }) => {
        const user = row.original as any;
        if (!user.organizerId || user.organizerId.length === 0) {
          return <span className="text-gray-400">-</span>;
        }

        return user.organizerId[0]?.acceptedAt ? (
          <Badge variant="default">Disetujui</Badge>
        ) : (
          <Badge variant="destructive">Pending</Badge>
        );
      },
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
          {/* Tombol Detail */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-1 h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => handleOpenDetailDialog(row.original)}
            title="Lihat Detail"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>

          {/* Tombol Approve jika organizer pending */}
          {row.original.organizer && !row.original.organizer.acceptedAt && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="mr-1 h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => handleOpenApproveDialog(row.original)}
                title="Setujui Organizer"
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="mr-1 h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleOpenRejectDialog(row.original)}
                title="Tolak Organizer"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleOpenDetailDialog(row.original)}
              >
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Pengguna</DropdownMenuItem>
              {row.original.organizer && !row.original.organizer.acceptedAt && (
                <>
                  <DropdownMenuItem
                    onClick={() => handleOpenApproveDialog(row.original)}
                  >
                    Setujui Organizer
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleOpenRejectDialog(row.original)}
                    className="text-red-600"
                  >
                    Tolak Organizer
                  </DropdownMenuItem>
                </>
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
                          : column.id === "organizer"
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

      {/* Dialog Detail Pengguna */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detail Pengguna</DialogTitle>
            <DialogDescription>
              Informasi lengkap pengguna dan status organizer
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs defaultValue="profile" className="mt-4">
              <TabsList>
                <TabsTrigger value="profile">Profil Pengguna</TabsTrigger>
                {selectedUser.organizer && (
                  <TabsTrigger value="organizer">Data Organizer</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="profile" className="mt-4 space-y-4">
                <div className="flex items-start gap-4">
                  {selectedUser.profilePicture ? (
                    <img
                      src={selectedUser.profilePicture}
                      alt={selectedUser.fullName}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full text-xl font-medium uppercase">
                      {selectedUser.fullName.charAt(0)}
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {selectedUser.fullName}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedUser.email}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge>{selectedUser.role}</Badge>
                      {selectedUser.organizer && (
                        <Badge
                          variant={
                            selectedUser.organizer.acceptedAt
                              ? "default"
                              : "destructive"
                          }
                        >
                          {selectedUser.organizer.acceptedAt
                            ? "Organizer Disetujui"
                            : "Organizer Pending"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="mb-1 font-medium">Terdaftar sejak</h4>
                    <p>
                      {new Date(selectedUser.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium">Point</h4>
                    <p>{selectedUser.point}</p>
                  </div>
                </div>

                {selectedUser.bio && (
                  <div>
                    <h4 className="mb-1 font-medium">Bio</h4>
                    <p className="text-muted-foreground">{selectedUser.bio}</p>
                  </div>
                )}
              </TabsContent>

              {selectedUser.organizer && (
                <TabsContent value="organizer" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="mb-1 font-medium">Nama Perusahaan</h4>
                      <p>{selectedUser.organizer.companyName}</p>
                    </div>
                    <div>
                      <h4 className="mb-1 font-medium">Website</h4>
                      <a
                        href={selectedUser.organizer.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedUser.organizer.companyWebsite}
                      </a>
                    </div>
                    <div className="col-span-2">
                      <h4 className="mb-1 font-medium">Alamat</h4>
                      <p>{selectedUser.organizer.companyAddress}</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="mb-1 font-medium">Detail</h4>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {selectedUser.organizer.details}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1 font-medium">Tanggal Pengajuan</h4>
                      <p>
                        {new Date(
                          selectedUser.organizer.createdAt,
                        ).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1 font-medium">Status</h4>
                      {selectedUser.organizer.acceptedAt ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Disetujui</Badge>
                          <span className="text-muted-foreground text-sm">
                            pada{" "}
                            {new Date(
                              selectedUser.organizer.acceptedAt,
                            ).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="destructive">Pending</Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">NPWP</h4>
                    <div className="rounded border p-2">
                      <img
                        src={selectedUser.organizer.npwp}
                        alt="NPWP Document"
                        className="mx-auto max-h-60 object-contain"
                      />
                    </div>
                  </div>

                  {!selectedUser.organizer.acceptedAt && (
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setIsDetailDialogOpen(false);
                          handleOpenRejectDialog(selectedUser);
                        }}
                      >
                        <XIcon className="mr-2 h-4 w-4" />
                        Tolak Permohonan
                      </Button>
                      <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setIsDetailDialogOpen(false);
                          handleOpenApproveDialog(selectedUser);
                        }}
                      >
                        <CheckIcon className="mr-2 h-4 w-4" />
                        Setujui Permohonan
                      </Button>
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog konfirmasi persetujuan organizer */}
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Setujui Permintaan Organizer</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menyetujui permintaan dari{" "}
              <strong>{selectedUser?.fullName}</strong>? Pengguna akan
              mendapatkan peran Organizer dan akses ke fitur pembuatan event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveOrganizer}
              disabled={approveMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveMutation.isPending ? (
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

      {/* Dialog konfirmasi penolakan organizer */}
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tolak Permintaan Organizer</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menolak permintaan dari{" "}
              <strong>{selectedUser?.fullName}</strong>? Permohonan organizer
              akan dihapus dan pengguna akan menerima notifikasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectOrganizer}
              disabled={rejectMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {rejectMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                  Memproses...
                </span>
              ) : (
                "Tolak"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
