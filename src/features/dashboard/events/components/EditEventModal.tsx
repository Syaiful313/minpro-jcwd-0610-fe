"use client";

import TiptapRichTextEditor from "@/components/TiptapRichEditor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetEventById from "@/hooks/api/event/useGetEventById";
import useUpdateEvent from "@/hooks/api/event/useUpdateEvent";
import { useFormik } from "formik";
import { Edit, Loader2, Plus, Trash, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Ticket {
  id?: string;
  name: string;
  price: string;
  quantity: string;
}

interface Voucher {
  id?: string;
  code: string;
  discount: string;
  maxUsage?: string;
  startDate: string;
  endDate: string;
}

interface FormValues {
  id: string;
  name: string;
  thumbnail: File | null;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  tickets: Ticket[];
  vouchers: Voucher[];
  currentThumbnail?: string;
}

interface EditEventModalProps {
  eventId: string | number;
  triggerButtonText?: string;
  triggerButtonIcon?: boolean;
  onSuccess?: () => void;
}

const categories = ["Sports", "Festivals", "Concerts", "Theater"];
const locations = [
  "ACEH",
  "SUMATERA_UTARA",
  "SUMATERA_BARAT",
  "RIAU",
  "JAMBI",
  "SUMATERA_SELATAN",
  "BENGKULU",
  "LAMPUNG",
  "KEPULAUAN_BANGKA_BELITUNG",
  "KEPULAUAN_RIAU",
  "DKI_JAKARTA",
  "JAWA_BARAT",
  "JAWA_TENGAH",
  "DI_YOGYAKARTA",
  "JAWA_TIMUR",
  "BANTEN",
  "BALI",
  "NUSA_TENGGARA_BARAT",
  "NUSA_TENGGARA_TIMUR",
  "KALIMANTAN_BARAT",
  "KALIMANTAN_TENGAH",
  "KALIMANTAN_SELATAN",
  "KALIMANTAN_TIMUR",
  "KALIMANTAN_UTARA",
  "SULAWESI_UTARA",
  "SULAWESI_TENGAH",
  "SULAWESI_SELATAN",
  "SULAWESI_TENGGARA",
  "GORONTALO",
  "SULAWESI_BARAT",
  "MALUKU",
  "MALUKU_UTARA",
  "PAPUA",
  "PAPUA_BARAT",
  "PAPUA_TENGAH",
  "PAPUA_PEGUNUNGAN",
  "PAPUA_SELATAN",
  "PAPUA_BARAT_DAYA",
];

const ticketTypes = ["REGULER", "VIP", "VVIP"];

const EditEventModal = ({
  eventId,
  triggerButtonText = "Edit Event",
  triggerButtonIcon = false,
  onSuccess,
}: EditEventModalProps) => {
  const [open, setOpen] = useState(false);

  const { data: event, isLoading: isEventLoading } = useGetEventById(
    Number(eventId),
  );
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent(
    Number(eventId),
  );

  const initialValues: FormValues = {
    id: "",
    name: "",
    thumbnail: null,
    description: "",
    category: "",
    location: "",
    startDate: "",
    endDate: "",
    tickets: [{ name: "", price: "", quantity: "" }],
    vouchers: [],
    currentThumbnail: "",
  };

  const formik = useFormik<FormValues>({
    initialValues,
    // Menggunakan fungsi validasi kustom yang lebih fleksibel daripada schema
    validate: (values) => {
      const errors: any = {};
      
      // Validasi minimal yang diperlukan
      if (!values.name) {
        errors.name = "Nama event harus diisi";
      }
      
      if (values.startDate && values.endDate) {
        if (new Date(values.endDate) < new Date(values.startDate)) {
          errors.endDate = "Tanggal selesai harus setelah tanggal mulai";
        }
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const ticketsData = values.tickets.filter(ticket => ticket.name && ticket.price && ticket.quantity).map((ticket) => ({
          name: ticket.name,
          price: parseInt(ticket.price),
          quantity: parseInt(ticket.quantity),
        }));

        const vouchersData = values.vouchers.filter(voucher => voucher.code && voucher.discount).map((voucher) => ({
          code: voucher.code,
          discount: parseInt(voucher.discount),
          maxUsage: parseInt(voucher.maxUsage || "1"),
          startDate: voucher.startDate,
          endDate: voucher.endDate,
        }));

        // Hanya kirim field yang berubah
        const eventPayload: any = {};
        
        if (values.name) eventPayload.name = values.name;
        if (values.description) eventPayload.description = values.description;
        if (values.category) eventPayload.category = values.category;
        if (values.location) eventPayload.location = values.location;
        if (values.startDate) eventPayload.startDate = values.startDate;
        if (values.endDate) eventPayload.endDate = values.endDate;
        
        // Hanya kirim tiket dan voucher jika ada data
        if (ticketsData.length > 0) {
          eventPayload.tickets = JSON.stringify(ticketsData);
        }
        
        if (vouchersData.length > 0) {
          eventPayload.vouchers = JSON.stringify(vouchersData);
        }
        
        // Tambahkan thumbnail jika ada
        if (values.thumbnail) {
          eventPayload.thumbnail = values.thumbnail;
        }

        updateEvent(eventPayload, {
          onSuccess: () => {
            toast.success("Event berhasil diperbarui");
            setOpen(false);
            if (onSuccess) onSuccess();
          },
          onError: (error: any) => {
            toast.error(
              "Gagal memperbarui event: " +
                (error.message || "Terjadi kesalahan"),
            );
            console.error(error);
          },
        });
      } catch (error) {
        toast.error("Gagal memperbarui event");
        console.error(error);
      }
    },
  });

  const [selectedImage, setSelectedImage] = useState<string>("");
  const thumbnailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (event && open) {
      let tickets = [];
      if (event.tickets && Array.isArray(event.tickets)) {
        tickets = event.tickets;
      } else if (typeof event.tickets === "string") {
        try {
          tickets = JSON.parse(event.tickets);
        } catch (error) {
          console.error("Error parsing ticket types:", error);
          tickets = [];
        }
      }

      let vouchers = [];
      if (event.vouchers && Array.isArray(event.vouchers)) {
        vouchers = event.vouchers;
      } else if (typeof event.vouchers === "string") {
        try {
          vouchers = JSON.parse(event.vouchers);
        } catch (error) {
          console.error("Error parsing vouchers:", error);
          vouchers = [];
        }
      }

      const formattedTickets =
        tickets.length > 0
          ? tickets.map((ticket: any) => ({
              id: ticket.id?.toString() || undefined,
              name: ticket.name || "",
              price: ticket.price?.toString() || "0",
              quantity: ticket.quantity?.toString() || "0",
            }))
          : [{ name: "", price: "", quantity: "" }];

      const formattedVouchers =
        vouchers.length > 0
          ? vouchers.map((voucher: any) => ({
              id: voucher.id?.toString() || undefined,
              code: voucher.code || "",
              discount: voucher.discount?.toString() || "0",
              maxUsage: voucher.maxUsage?.toString() || "1",
              startDate: formatDateForInput(voucher.startDate) || "",
              endDate: formatDateForInput(voucher.endDate) || "",
            }))
          : [];

      formik.setValues({
        id: event.id?.toString() || "",
        name: event.name || "",
        thumbnail: null,
        description: event.description || "",
        category: event.category || "",
        location: event.location || "",
        startDate: formatDateForInput(event.startDate) || "",
        endDate: formatDateForInput(event.endDate) || "",
        tickets: formattedTickets,
        vouchers: formattedVouchers,
        currentThumbnail: event.thumbnail || "",
      });

      if (event.thumbnail) {
        setSelectedImage(event.thumbnail);
      }
    }
  }, [event, open]);

  const formatDateForInput = (dateString: string | Date | undefined) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().slice(0, 16);
  };

  const onChangeThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length) {
      formik.setFieldValue("thumbnail", files[0]);
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };

  const removeThumbnail = () => {
    formik.setFieldValue("thumbnail", null);
    formik.setFieldValue("currentThumbnail", "");
    setSelectedImage("");
    if (thumbnailRef.current) {
      thumbnailRef.current.value = "";
    }
  };

  const addTicket = () =>
    formik.setFieldValue("tickets", [
      ...formik.values.tickets,
      { name: "", price: "", quantity: "" },
    ]);

  const removeTicket = (index: number) => {
    const newTickets = [...formik.values.tickets];
    newTickets.splice(index, 1);
    formik.setFieldValue("tickets", newTickets);
  };

  const addVoucher = () =>
    formik.setFieldValue("vouchers", [
      ...formik.values.vouchers,
      { code: "", discount: "", maxUsage: "1", startDate: "", endDate: "" },
    ]);

  const removeVoucher = (index: number) => {
    const newVouchers = [...formik.values.vouchers];
    newVouchers.splice(index, 1);
    formik.setFieldValue("vouchers", newVouchers);
  };

  const handleModalClose = () => {
    setOpen(false);
    formik.resetForm();
    setSelectedImage("");
  };

  // Komponen trigger sesuai dengan apakah itu menu item atau tombol reguler
  const renderTrigger = () => {
    if (triggerButtonIcon) {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          onClick={() => setOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      );
    } else {
      return (
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Edit className="h-4 w-4" /> {triggerButtonText}
        </DropdownMenuItem>
      );
    }
  };

  return (
    <>
      {renderTrigger()}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-y-auto border border-gray-200 bg-white md:w-auto dark:border-gray-700 dark:bg-gray-900">
          <DialogHeader className="sticky top-0 z-10 bg-white pb-2 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-black dark:text-white">
                  Edit Event
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  Perbarui detail event Anda
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleModalClose}
                className="text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {isEventLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
              <p className="ml-2 text-black dark:text-white">
                Memuat data event...
              </p>
            </div>
          ) : (
            <form
              className="space-y-4 px-1 md:px-2"
              onSubmit={formik.handleSubmit}
            >
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-black dark:text-white">
                  Nama Event
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nama Event"
                  value={formik.values.name}
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                />
                {!!formik.touched.name && !!formik.errors.name && (
                  <p className="text-sm text-red-600">{formik.errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label
                    htmlFor="category"
                    className="text-black dark:text-white"
                  >
                    Kategori
                  </Label>
                  <Select
                    value={formik.values.category}
                    onValueChange={(value) =>
                      formik.setFieldValue("category", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="text-black dark:text-white"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!!formik.touched.category && !!formik.errors.category && (
                    <p className="text-sm text-red-600">
                      {formik.errors.category}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="location"
                    className="text-black dark:text-white"
                  >
                    Lokasi
                  </Label>
                  <Select
                    value={formik.values.location}
                    onValueChange={(value) =>
                      formik.setFieldValue("location", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white">
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[40vh] overflow-y-auto bg-white dark:bg-gray-800">
                      {locations.map((loc) => (
                        <SelectItem
                          key={loc}
                          value={loc}
                          className="text-black dark:text-white"
                        >
                          {loc.replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!!formik.touched.location && !!formik.errors.location && (
                    <p className="text-sm text-red-600">
                      {formik.errors.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label
                    htmlFor="startDate"
                    className="text-black dark:text-white"
                  >
                    Tanggal Mulai
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                  />
                  {!!formik.touched.startDate && !!formik.errors.startDate && (
                    <p className="text-sm text-red-600">
                      {formik.errors.startDate}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="endDate" className="text-black dark:text-white">
                    Tanggal Selesai
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                  />
                  {!!formik.touched.endDate && !!formik.errors.endDate && (
                    <p className="text-sm text-red-600">
                      {formik.errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <TiptapRichTextEditor
                  label="Deskripsi"
                  field="description"
                  isTouch={formik.touched.description}
                  description={formik.values.description}
                  onChange={(value: string) =>
                    formik.setFieldValue("description", value)
                  }
                  setError={formik.setFieldError}
                  setTouch={formik.setFieldTouched}
                />
              </div>

              <div className="grid gap-4">
                <Label htmlFor="thumbnail" className="text-black dark:text-white">
                  Thumbnail
                </Label>
                {selectedImage && (
                  <div className="space-y-2">
                    <div className="relative h-[200px] w-full max-w-[300px] overflow-hidden rounded-md">
                      <Image
                        src={selectedImage}
                        alt="thumbnail"
                        className="object-cover"
                        fill
                      />
                    </div>

                    <Button
                      variant="outline"
                      type="button"
                      onClick={removeThumbnail}
                      className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-gray-800"
                    >
                      <Trash className="h-4 w-4" /> Hapus Thumbnail
                    </Button>
                  </div>
                )}

                <Input
                  ref={thumbnailRef}
                  name="thumbnail"
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={onChangeThumbnail}
                  className="border-gray-300 file:border-0 file:bg-gray-200 file:text-black focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:file:bg-gray-700 dark:file:text-white dark:focus:border-white"
                />
                {!!formik.touched.thumbnail && !!formik.errors.thumbnail && (
                  <p className="text-sm text-red-600">
                    {formik.errors.thumbnail}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-black dark:text-white">Tiket</Label>
                  <Button
                    type="button"
                    onClick={addTicket}
                    variant="outline"
                    className="flex items-center gap-1 border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800"
                    size="sm"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tambah Tiket
                  </Button>
                </div>

                <div className="space-y-3">
                  {formik.values.tickets.map((ticket, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-3 rounded-md border border-gray-300 p-3 md:grid-cols-3 dark:border-gray-600"
                    >
                      <div className="w-full md:col-span-1">
                        <Label
                          htmlFor={`ticket-type-${index}`}
                          className="mb-1 block text-xs font-medium text-black dark:text-white"
                        >
                          Jenis Tiket
                        </Label>
                        <Select
                          value={ticket.name}
                          onValueChange={(value) => {
                            const newTickets = [...formik.values.tickets];
                            newTickets[index].name = value;
                            formik.setFieldValue("tickets", newTickets);
                          }}
                        >
                          <SelectTrigger className="w-full border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white">
                            <SelectValue placeholder="Pilih jenis tiket" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800">
                            {ticketTypes.map((type) => (
                              <SelectItem
                                key={type}
                                value={type}
                                className="text-black dark:text-white"
                              >
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full md:col-span-1">
                        <Label
                          htmlFor={`ticket-price-${index}`}
                          className="mb-1 block text-xs font-medium text-black dark:text-white"
                        >
                          Harga
                        </Label>
                        <Input
                          id={`ticket-price-${index}`}
                          type="number"
                          placeholder="Harga"
                          value={ticket.price}
                          onChange={(e) => {
                            const newTickets = [...formik.values.tickets];
                            newTickets[index].price = e.target.value;
                            formik.setFieldValue("tickets", newTickets);
                          }}
                          className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                        />
                      </div>
                      <div className="w-full md:col-span-1">
                        <Label
                          htmlFor={`ticket-quantity-${index}`}
                          className="mb-1 block text-xs font-medium text-black dark:text-white"
                        >
                          Jumlah
                        </Label>
                        <Input
                          id={`ticket-quantity-${index}`}
                          type="number"
                          placeholder="Jumlah"
                          value={ticket.quantity}
                          onChange={(e) => {
                            const newTickets = [...formik.values.tickets];
                            newTickets[index].quantity = e.target.value;
                            formik.setFieldValue("tickets", newTickets);
                          }}
                          className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                        />
                      </div>
                      <div className="w-full md:col-span-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex w-full items-center justify-center gap-2 border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-gray-800"
                          onClick={() => removeTicket(index)}
                          disabled={formik.values.tickets.length <= 1}
                        >
                          <Trash className="h-3.5 w-3.5" /> Hapus Tiket
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-black dark:text-white">Voucher</Label>
                  <Button
                    type="button"
                    onClick={addVoucher}
                    variant="outline"
                    className="flex items-center gap-1 border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800"
                    size="sm"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tambah Voucher
                  </Button>
                </div>

                <div className="space-y-3">
                  {formik.values.vouchers.map((voucher, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-md border border-gray-300 p-3 dark:border-gray-600"
                    >
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <Label
                            htmlFor={`voucher-code-${index}`}
                            className="mb-1 block text-xs font-medium text-black dark:text-white"
                          >
                            Kode Voucher
                          </Label>
                          <Input
                            id={`voucher-code-${index}`}
                            type="text"
                            placeholder="Kode Voucher"
                            value={voucher.code}
                            onChange={(e) => {
                              const newVouchers = [...formik.values.vouchers];
                              newVouchers[index].code = e.target.value;
                              formik.setFieldValue("vouchers", newVouchers);
                            }}
                            className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`voucher-discount-${index}`}
                            className="mb-1 block text-xs font-medium text-black dark:text-white"
                          >
                            Diskon (%)
                          </Label>
                          <Input
                            id={`voucher-discount-${index}`}
                            type="number"
                            placeholder="Diskon"
                            value={voucher.discount}
                            onChange={(e) => {
                              const newVouchers = [...formik.values.vouchers];
                              newVouchers[index].discount = e.target.value;
                              formik.setFieldValue("vouchers", newVouchers);
                            }}
                            className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                          />
                        </div>
                      </div>

                      {/* Tambahkan field maxUsage untuk voucher */}
                      <div>
                        <Label
                          htmlFor={`voucher-maxUsage-${index}`}
                          className="mb-1 block text-xs font-medium text-black dark:text-white"
                        >
                          Maksimal Penggunaan
                        </Label>
                        <Input
                          id={`voucher-maxUsage-${index}`}
                          type="number"
                          placeholder="Maks Penggunaan"
                          value={voucher.maxUsage || "1"}
                          onChange={(e) => {
                            const newVouchers = [...formik.values.vouchers];
                            newVouchers[index].maxUsage = e.target.value;
                            formik.setFieldValue("vouchers", newVouchers);
                          }}
                          className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <Label
                            htmlFor={`voucher-start-${index}`}
                            className="mb-1 block text-xs font-medium text-black dark:text-white"
                          >
                            Tanggal Mulai Voucher
                          </Label>
                          <Input
                            id={`voucher-start-${index}`}
                            type="datetime-local"
                            placeholder="Tanggal Mulai"
                            value={voucher.startDate}
                            onChange={(e) => {
                              const newVouchers = [...formik.values.vouchers];
                              newVouchers[index].startDate = e.target.value;
                              formik.setFieldValue("vouchers", newVouchers);
                            }}
                            className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`voucher-end-${index}`}
                            className="mb-1 block text-xs font-medium text-black dark:text-white"
                          >
                            Tanggal Berakhir Voucher
                          </Label>
                          <Input
                            id={`voucher-end-${index}`}
                            type="datetime-local"
                            placeholder="Tanggal Berakhir"
                            value={voucher.endDate}
                            onChange={(e) => {
                              const newVouchers = [...formik.values.vouchers];
                              newVouchers[index].endDate = e.target.value;
                              formik.setFieldValue("vouchers", newVouchers);
                            }}
                            className="border-gray-300 focus:border-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeVoucher(index)}
                        className="flex w-full items-center justify-center gap-2 border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-gray-800"
                      >
                        <Trash className="h-3.5 w-3.5" /> Hapus Voucher
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-end gap-2 border-t border-gray-200 pt-4 sm:flex-row dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleModalClose}
                  className="w-full border-black text-black hover:bg-gray-100 sm:w-auto dark:border-white dark:text-white dark:hover:bg-gray-800"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 sm:w-auto"
                  disabled={isUpdating} // Hapus kondisi !formik.isValid agar tombol selalu aktif
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memperbarui...
                    </>
                  ) : (
                    "Perbarui Event"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditEventModal;