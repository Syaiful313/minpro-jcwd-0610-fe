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
  DropdownMenuCheckboxItem,
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
import useDeleteOrganizerEvent from "@/hooks/api/dasboard-organizer/useDeleteOrganizerEvent";
import useGetOrganizerevents from "@/hooks/api/dasboard-organizer/useGetOrganizerEvents";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertTriangle,
  ChevronDownIcon,
  ColumnsIcon,
  Edit,
  Eye,
  MoreVerticalIcon,
  Trash2,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import CreateEventModal from "./CreateEventModal";
import EditEventModal from "./EditEventModal"; // Impor EditEventModal

interface Event {
  id: number;
  name: string;
  thumbnail?: string;
  location?: string;
  category: string;
  startDate: string;
  endDate: string;
  slug: string;
}

function DraggableRow({ row }: { row: Row<Event> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function EventsTable() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounceValue(searchQuery, 500);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const router = useRouter();
  const deleteEvent = useDeleteOrganizerEvent();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  
  // State untuk refresh data setelah edit
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    data: eventsData,
    isLoading,
    error,
  } = useGetOrganizerevents({
    page: currentPage,
    take: pageSize,
    search: debouncedSearch,
  }, ); // Tambahkan refreshTrigger sebagai dependency

  const [data, setData] = React.useState<Event[]>([]);

  React.useEffect(() => {
    if (eventsData?.data) {
      setData(eventsData.data);
    }
  }, [eventsData]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    try {
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      return date.toLocaleDateString("en-US", options);
    }
  };

  const handleNavigateToAttendees = (slug: string) => {
    router.push(`/dashboard/events/${slug}`);
  };

  const handleEditEvent = (slug: string) => {
    router.push(`/dashboard/edit/${slug}`);
  };

  const handleViewEvent = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  // Handler untuk refresh data setelah event diedit
  const handleEventEdited = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEvent.mutate(eventToDelete.id);
    }
    setIsDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "index",
      header: () => <div className="text-center">No.</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: "thumbnail",
      header: () => <div className="text-center">Thumbnail</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <div className="relative h-16 w-24">
            <Image
              src={row.original.thumbnail || "/placeholder-image.jpg"}
              alt={row.original.name}
              fill
              className="rounded-md object-cover"
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: () => <div className="text-left">Event Name</div>,
      cell: ({ row }) => (
        <div className="text-left font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "location",
      header: () => <div className="text-left">Location</div>,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-left">
          {row.original.location || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: () => <div className="text-center">Category</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.category}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: () => <div className="text-center">Start Date</div>,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-center">
          {formatDate(row.original.startDate)}
        </div>
      ),
    },
    {
      accessorKey: "endDate",
      header: () => <div className="text-center">End Date</div>,
      cell: ({ row }) => (
        <div className="text-muted-foreground text-center">
          {formatDate(row.original.endDate)}
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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => handleNavigateToAttendees(row.original.slug)}
              >
                <Users className="h-4 w-4" /> View Attendees
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => handleViewEvent(row.original.slug)}
              >
                <Eye className="h-4 w-4" /> View Event
              </DropdownMenuItem>
              {/* Gunakan komponen EditEventModal sebagai pengganti redirect */}
              <EditEventModal 
                eventId={row.original.id} 
                triggerButtonText="Edit Event"
                triggerButtonIcon={false}
                onSuccess={handleEventEdited}
              />
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600"
                onClick={() => handleDeleteEvent(row.original)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      columnVisibility,
      rowSelection,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:max-w-md"
          />
          <div className="flex flex-wrap items-center gap-2">
            <CreateEventModal triggerButtonText="Create Event" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <ColumnsIcon className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Columns</span>
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide(),
                  )
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
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
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
                        Loading events...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-red-500"
                      >
                        Error loading events: {error.message}
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No events found. Try a different search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DndContext>

          {eventsData && eventsData.meta && (
            <div className="border-t p-2 md:p-4">
              <PaginationSection
                page={eventsData.meta.page}
                take={eventsData.meta.take}
                total={eventsData.meta.total}
                onChangePage={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Delete Event
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{eventToDelete?.name}"? This
              action will hide the event from public view, but data will be
              preserved in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteEvent.isPending ? "Deleting..." : "Delete Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}