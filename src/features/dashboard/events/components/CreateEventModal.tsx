"use client";

import TiptapRichTextEditor from "@/components/TiptapRichEditor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { CreateEventSchema } from "@/features/create/schema";
import useCreateEvent from "@/hooks/api/event/useCreateEvent";
import { useFormik } from "formik";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

interface Ticket {
  name: string;
  price: string;
  quantity: string;
}

interface Voucher {
  code: string;
  discount: string;
  startDate: string;
  endDate: string;
}

interface FormValues {
  name: string;
  thumbnail: File | null;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  tickets: Ticket[];
  vouchers: Voucher[];
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

const CreateEventModal = ({ triggerButtonText = "Create New Event" }) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createEvent, isPending } = useCreateEvent();

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      thumbnail: null,
      description: "",
      category: "",
      location: "",
      startDate: "",
      endDate: "",
      tickets: [{ name: "", price: "", quantity: "" }],
      vouchers: [],
    },
    validationSchema: CreateEventSchema,
    onSubmit: async (values) => {
      try {
        const formattedTickets = values.tickets.map((ticket) => ({
          name: ticket.name || "",
          price: Number(ticket.price) || 0,
          quantity: Number(ticket.quantity) || 0,
        }));

        const formattedVouchers = values.vouchers.map((voucher) => ({
          code: voucher.code || "",
          discount: Number(voucher.discount) || 0,
          startDate: voucher.startDate,
          endDate: voucher.endDate,
        }));

        const eventPayload = {
          ...values,
          tickets: JSON.stringify(formattedTickets),
          vouchers: JSON.stringify(formattedVouchers),
        };

        console.log("Formatted Payload:", eventPayload);
        await createEvent(eventPayload);

        toast.success("Event created successfully!");
        setOpen(false);
        formik.resetForm();
        setSelectedImage("");
      } catch (error) {
        toast.error("Failed to create event");
        console.error(error);
      }
    },
  });

  const [selectedImage, setSelectedImage] = useState<string>("");
  const thumbnailRef = useRef<HTMLInputElement>(null);

  const onChangeThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length) {
      formik.setFieldValue("thumbnail", files[0]);
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };

  const removeThumbnail = () => {
    formik.setFieldValue("thumbnail", null);
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
      { code: "", discount: "", startDate: "", endDate: "" },
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-gray-800 transition-colors">
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl w-[95vw] md:w-auto overflow-y-auto bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader className="sticky top-0 z-10 bg-white pb-2 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-black dark:text-white">
              Create New Event
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleModalClose} className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form className="space-y-4 px-1 md:px-2" onSubmit={formik.handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-black dark:text-white">Event Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Title"
              value={formik.values.name}
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white"
            />
            {!!formik.touched.name && !!formik.errors.name && (
              <p className="text-red-600 text-sm">{formik.errors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category" className="text-black dark:text-white">Category</Label>
            <Select
              value={formik.values.category}
              onValueChange={(value) => formik.setFieldValue("category", value)}
            >
              <SelectTrigger className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-black dark:text-white">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!!formik.touched.category && !!formik.errors.category && (
              <p className="text-red-600 text-sm">
                {formik.errors.category}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location" className="text-black dark:text-white">Location</Label>
            <Select
              value={formik.values.location}
              onValueChange={(value) => formik.setFieldValue("location", value)}
            >
              <SelectTrigger className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="max-h-[40vh] overflow-y-auto bg-white dark:bg-gray-800">
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc} className="text-black dark:text-white">
                    {loc.replaceAll("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!!formik.touched.location && !!formik.errors.location && (
              <p className="text-red-600 text-sm">
                {formik.errors.location}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="startDate" className="text-black dark:text-white">Start Event</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={formik.values.startDate}
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white"
              />
              {!!formik.touched.startDate && !!formik.errors.startDate && (
                <p className="text-red-600 text-sm">
                  {formik.errors.startDate}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate" className="text-black dark:text-white">Event End</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={formik.values.endDate}
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white"
              />
              {!!formik.touched.endDate && !!formik.errors.endDate && (
                <p className="text-red-600 text-sm">
                  {formik.errors.endDate}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <TiptapRichTextEditor
              label="Description"
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

          <div className="grid gap-2">
            <Label htmlFor="thumbnail" className="text-black dark:text-white">Thumbnail</Label>
            <Input
              ref={thumbnailRef}
              name="thumbnail"
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={onChangeThumbnail}
              className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white file:bg-gray-200 file:text-black dark:file:bg-gray-700 dark:file:text-white file:border-0"
            />
            {!!formik.touched.thumbnail && !!formik.errors.thumbnail && (
              <p className="text-red-600 text-sm">
                {formik.errors.thumbnail}
              </p>
            )}
          </div>

          {selectedImage && (
            <div className="space-y-2">
              <div className="relative h-[150px] w-full max-w-[300px]">
                <Image
                  src={selectedImage}
                  alt="thumbnail"
                  className="rounded-md object-cover"
                  fill
                />
              </div>

              <Button
                variant="outline"
                type="button"
                onClick={removeThumbnail}
                className="border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800"
              >
                Remove
              </Button>
            </div>
          )}

          <div className="grid gap-2">
            <Label className="text-black dark:text-white">Tickets</Label>
            {formik.values.tickets.map((ticket, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-3 rounded-md border border-gray-300 dark:border-gray-600 p-3 md:grid-cols-3"
              >
                <div className="w-full md:col-span-1">
                  <Select
                    value={ticket.name}
                    onValueChange={(value) => {
                      const newTickets = [...formik.values.tickets];
                      newTickets[index].name = value;
                      formik.setFieldValue("tickets", newTickets);
                    }}
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white">
                      <SelectValue placeholder="Select ticket type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      {ticketTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-black dark:text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:col-span-1">
                  <Input
                    type="number"
                    placeholder="Price"
                    value={ticket.price}
                    onChange={(e) => {
                      const newTickets = [...formik.values.tickets];
                      newTickets[index].price = e.target.value;
                      formik.setFieldValue("tickets", newTickets);
                    }}
                    className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="w-full md:col-span-1">
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={ticket.quantity}
                    onChange={(e) => {
                      const newTickets = [...formik.values.tickets];
                      newTickets[index].quantity = e.target.value;
                      formik.setFieldValue("tickets", newTickets);
                    }}
                    className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="w-full md:col-span-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800"
                    onClick={() => removeTicket(index)}
                    disabled={formik.values.tickets.length <= 1}
                  >
                    Remove Ticket
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={addTicket}
              variant="outline"
              className="flex items-center gap-1 border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" /> Add Ticket
            </Button>
          </div>

          <div className="grid gap-2">
            <Label className="text-black dark:text-white">Vouchers</Label>
            {formik.values.vouchers.map((voucher, index) => (
              <div key={index} className="grid gap-3 rounded-md border border-gray-300 dark:border-gray-600 p-3">
                <Input
                  type="text"
                  placeholder="Code"
                  value={voucher.code}
                  onChange={(e) => {
                    const newVouchers = [...formik.values.vouchers];
                    newVouchers[index].code = e.target.value;
                    formik.setFieldValue("vouchers", newVouchers);
                  }}
                  className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white"
                />
                <Input
                  type="number"
                  placeholder="Discount"
                  value={voucher.discount}
                  onChange={(e) => {
                    const newVouchers = [...formik.values.vouchers];
                    newVouchers[index].discount = e.target.value;
                    formik.setFieldValue("vouchers", newVouchers);
                  }}
                  className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white"
                />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-sm font-medium text-black dark:text-white">
                      Start Valid Voucher
                    </p>
                    <Input
                      type="datetime-local"
                      placeholder="Start Date"
                      value={voucher.startDate}
                      onChange={(e) => {
                        const newVouchers = [...formik.values.vouchers];
                        newVouchers[index].startDate = e.target.value;
                        formik.setFieldValue("vouchers", newVouchers);
                      }}
                      className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-black dark:text-white">
                      End Valid Voucher
                    </p>
                    <Input
                      type="datetime-local"
                      placeholder="End Date"
                      value={voucher.endDate}
                      onChange={(e) => {
                        const newVouchers = [...formik.values.vouchers];
                        newVouchers[index].endDate = e.target.value;
                        formik.setFieldValue("vouchers", newVouchers);
                      }}
                      className="border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeVoucher(index)}
                  className="w-full border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800"
                >
                  Remove Voucher
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={addVoucher}
              variant="outline"
              className="flex items-center gap-1 border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" /> Add Voucher
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleModalClose}
              className="border-black text-black hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-gray-800 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;