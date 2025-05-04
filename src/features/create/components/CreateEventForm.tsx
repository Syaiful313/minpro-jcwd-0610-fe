// "use client";
// import TiptapRichTextEditor from "@/components/TiptapRichEditor";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import useCreateEvent, {
//   CreateEventPayload,
// } from "@/hooks/api/event/useCreateEvent";
// import { useFormik } from "formik";
// import { CreateEventSchema } from "../schema";
// import { ChangeEvent, useRef, useState } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";

// const CreateEventForm = () => {
//   const { mutateAsync: createEvent, isPending } = useCreateEvent();

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       thumbnail: null,
//       description: "",
//       category: "",
//       location: "",
//       startDate: "",
//       endDate: "",
//     },
//     validationSchema: CreateEventSchema,
//     onSubmit: async (values) => {
//       await createEvent(values);
//     },
//   });

//   const [selectedImage, setSelectedImage] = useState<string>("");
//   const thumbnailReff = useRef<HTMLInputElement>(null);

//   const onChangeThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;

//     if (files && files.length) [formik.setFieldValue("thumbnail", files[0])];
//     setSelectedImage(URL.createObjectURL(files![0]));
//   };

//   const removeThumbnail = () => {
//     formik.setFieldValue("thumbnail", null);
//     setSelectedImage("");
//     if (thumbnailReff.current) {
//       thumbnailReff.current.value = "";
//     }
//   };

//   return (
//     <form className="mt-10 mb-20 space-y-4" onSubmit={formik.handleSubmit}>
//       <div className="grid gap-2">
//         <Label htmlFor="name">Event Name</Label>
//         <Input
//           id="name"
//           name="name"
//           type="text"
//           placeholder="Title"
//           value={formik.values.name}
//           required
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           className="w-full"
//         />
//         {!!formik.touched.name && !!formik.errors.name && (
//           <p className="text-destructive text-sm">{formik.errors.name}</p>
//         )}
//       </div>

//       <div className="grid gap-2">
//         <Label htmlFor="category">Category</Label>
//         <Input
//           id="category"
//           name="category"
//           type="text"
//           placeholder="category"
//           value={formik.values.category}
//           required
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           className="w-full"
//         />
//         {!!formik.touched.category && !!formik.errors.category && (
//           <p className="text-destructive text-sm">{formik.errors.category}</p>
//         )}
//       </div>

//       <div className="grid gap-2">
//         <Label htmlFor="location">Location</Label>
//         <Input
//           id="location"
//           name="location"
//           type="text"
//           placeholder="location"
//           value={formik.values.location}
//           required
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           className="w-full"
//         />
//         {!!formik.touched.location && !!formik.errors.location && (
//           <p className="text-destructive text-sm">{formik.errors.location}</p>
//         )}
//       </div>

//       <div className="grid gap-2">
//         <Label htmlFor="startDate">Start Event</Label>
//         <Input
//           id="startDate"
//           name="startDate"
//           type="text"
//           placeholder="startDate"
//           value={formik.values.startDate}
//           required
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           className="w-full"
//         />
//         {!!formik.touched.startDate && !!formik.errors.startDate && (
//           <p className="text-destructive text-sm">{formik.errors.startDate}</p>
//         )}
//       </div>

//       <div className="grid gap-2">
//         <Label htmlFor="endDate">Event End</Label>
//         <Input
//           id="endDate"
//           name="endDate"
//           type="text"
//           placeholder="endDate"
//           value={formik.values.endDate}
//           required
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           className="w-full"
//         />
//         {!!formik.touched.endDate && !!formik.errors.endDate && (
//           <p className="text-destructive text-sm">{formik.errors.endDate}</p>
//         )}
//       </div>

//       <div className="grid gap-2">
//         <TiptapRichTextEditor
//           label="Description"
//           field="description"
//           isTouch={formik.touched.description}
//           description={formik.values.description}
//           onChange={(value: string) =>
//             formik.setFieldValue("description", value)
//           }
//           setError={formik.setFieldError}
//           setTouch={formik.setFieldTouched}
//         />
//       </div>

//       {selectedImage && (
//         <>
//           <div className="relative h-[150px] w-[200px]">
//             <Image
//               src={selectedImage}
//               alt="thumbnail"
//               className="object-cover"
//               fill
//             />
//           </div>

//           <Button variant="destructive" type="button" onClick={removeThumbnail}>
//             Remove
//           </Button>
//         </>
//       )}

//       <div className="grid gap-2">
//         <Label htmlFor="thumbnail">Thumbnail</Label>
//         <Input
//           ref={thumbnailReff}
//           name="thumbnail"
//           id="thumbnail"
//           type="file"
//           accept="image/*"
//           onChange={onChangeThumbnail}
//         />
//         {!!formik.touched.thumbnail && !!formik.errors.thumbnail && (
//           <p className="text-destructive text-sm">{formik.errors.thumbnail}</p>
//         )}
//       </div>

//       <div className="flex justify-end">
//         <Button className="in-hover:via-violet-400" type="submit" disabled={isPending}>
//           {isPending ? "Creating..." : "Create"}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default CreateEventForm;

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreateEvent from "@/hooks/api/event/useCreateEvent";
import { useFormik } from "formik";
import { CreateEventSchema } from "../schema";
import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TiptapRichTextEditor from "@/components/TiptapRichEditor";

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
  "ACEH", "SUMATERA_UTARA", "SUMATERA_BARAT", "RIAU", "JAMBI",
  "SUMATERA_SELATAN", "BENGKULU", "LAMPUNG", "KEPULAUAN_BANGKA_BELITUNG",
  "KEPULAUAN_RIAU", "DKI_JAKARTA", "JAWA_BARAT", "JAWA_TENGAH",
  "DI_YOGYAKARTA", "JAWA_TIMUR", "BANTEN", "BALI",
  "NUSA_TENGGARA_BARAT", "NUSA_TENGGARA_TIMUR", "KALIMANTAN_BARAT",
  "KALIMANTAN_TENGAH", "KALIMANTAN_SELATAN", "KALIMANTAN_TIMUR",
  "KALIMANTAN_UTARA", "SULAWESI_UTARA", "SULAWESI_TENGAH",
  "SULAWESI_SELATAN", "SULAWESI_TENGGARA", "GORONTALO",
  "SULAWESI_BARAT", "MALUKU", "MALUKU_UTARA", "PAPUA",
  "PAPUA_BARAT", "PAPUA_TENGAH", "PAPUA_PEGUNUNGAN",
  "PAPUA_SELATAN", "PAPUA_BARAT_DAYA"
];

const ticketTypes = ["REGULER", "VIP", "VVIP"];

const CreateEventForm = () => {
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
      tickets: [{ name: '', price: '', quantity: '' }],
      vouchers: []
    },
    validationSchema: CreateEventSchema,
    onSubmit: async (values) => {
      try {
        const formattedTickets = values.tickets.map(ticket => ({
          name: ticket.name || '',
          price: Number(ticket.price) || 0,
          quantity: Number(ticket.quantity) || 0
        }));

        const formattedVouchers = values.vouchers.map(voucher => ({
          code: voucher.code || '',
          discount: Number(voucher.discount) || 0,
          startDate: voucher.startDate,
          endDate: voucher.endDate
        }));

        const eventPayload = {
          ...values,
          tickets: JSON.stringify(formattedTickets),
          vouchers: JSON.stringify(formattedVouchers)
        };
        console.log("Event Payload:", eventPayload);
        await createEvent(eventPayload);
      } catch (error) {
        console.error("Error creating event:", error);
      }
    },
  });

  const [selectedImage, setSelectedImage] = useState<string>("");
  const thumbnailReff = useRef<HTMLInputElement>(null);

  const onChangeThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length) [formik.setFieldValue("thumbnail", files[0])];
    setSelectedImage(URL.createObjectURL(files![0]));
  };

  const removeThumbnail = () => {
    formik.setFieldValue("thumbnail", null);
    setSelectedImage("");
    if (thumbnailReff.current) {
      thumbnailReff.current.value = "";
    }
  };

  const addTicket = () => formik.setFieldValue("tickets", [...formik.values.tickets, { type: '', price: '', quantity: '' }]);
  
  const removeTicket = (index: number) => {
    const newTickets = [...formik.values.tickets];
    newTickets.splice(index, 1);
    formik.setFieldValue("tickets", newTickets);
  };

  const addVoucher = () => formik.setFieldValue("vouchers", [...formik.values.vouchers, { code: '', discount: '', startDate: '', endDate: '' }]);

  const removeVoucher = (index: number) => {
    const newVouchers = [...formik.values.vouchers];
    newVouchers.splice(index, 1);
    formik.setFieldValue("vouchers", newVouchers);
  };

  return (
    <form
      className="mt-10 mb-20 space-y-6 max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg"
      onSubmit={formik.handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Event Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Title"
          value={formik.values.name}
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {!!formik.touched.name && !!formik.errors.name && (
          <p className="text-destructive text-sm">{formik.errors.name}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formik.values.category}
          onValueChange={(value) => formik.setFieldValue("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!!formik.touched.category && !!formik.errors.category && (
          <p className="text-destructive text-sm">{formik.errors.category}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Select
          value={formik.values.location}
          onValueChange={(value) => formik.setFieldValue("location", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc.replaceAll("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!!formik.touched.location && !!formik.errors.location && (
          <p className="text-destructive text-sm">{formik.errors.location}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="startDate">Start Event</Label>
        <Input
          id="startDate"
          name="startDate"
          type="datetime-local"
          value={formik.values.startDate}
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {!!formik.touched.startDate && !!formik.errors.startDate && (
          <p className="text-destructive text-sm">{formik.errors.startDate}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="endDate">Event End</Label>
        <Input
          id="endDate"
          name="endDate"
          type="datetime-local"
          value={formik.values.endDate}
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {!!formik.touched.endDate && !!formik.errors.endDate && (
          <p className="text-destructive text-sm">{formik.errors.endDate}</p>
        )}
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

      {selectedImage && (
        <div className="space-y-2">
          <div className="relative h-[150px] w-[200px]">
            <Image
              src={selectedImage}
              alt="thumbnail"
              className="object-cover rounded-md"
              fill
            />
          </div>

          <Button variant="destructive" type="button" onClick={removeThumbnail}>
            Remove
          </Button>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="thumbnail">Thumbnail</Label>
        <Input
          ref={thumbnailReff}
          name="thumbnail"
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={onChangeThumbnail}
        />
        {!!formik.touched.thumbnail && !!formik.errors.thumbnail && (
          <p className="text-destructive text-sm">{formik.errors.thumbnail}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label>Tickets</Label>
        {formik.values.tickets.map((ticket, index) => (
          <div key={index} className="grid gap-2">
            <Select
              value={ticket.name}
              onValueChange={(value) => {
                const newTickets = [...formik.values.tickets];
                newTickets[index].name = value;
                formik.setFieldValue("tickets", newTickets);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ticket type" />
              </SelectTrigger>
              <SelectContent>
                {ticketTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Price"
              value={ticket.price}
              onChange={(e) => {
                const newTickets = [...formik.values.tickets];
                newTickets[index].price = e.target.value;
                formik.setFieldValue("tickets", newTickets);
              }}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={ticket.quantity}
              onChange={(e) => {
                const newTickets = [...formik.values.tickets];
                newTickets[index].quantity = e.target.value;
                formik.setFieldValue("tickets", newTickets);
              }}
            />
            <Button type="button" onClick={() => removeTicket(index)}>
              Remove Ticket
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addTicket}>
          Add Ticket
        </Button>
      </div>

      <div className="grid gap-2">
        <Label>Vouchers</Label>
        {formik.values.vouchers.map((voucher, index) => (
          <div key={index} className="grid gap-2">
            <Input
              type="text"
              placeholder="Code"
              value={voucher.code}
              onChange={(e) => {
                const newVouchers = [...formik.values.vouchers];
                newVouchers[index].code = e.target.value;
                formik.setFieldValue("vouchers", newVouchers);
              }}
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
            />
            <p>Start Valid Voucher</p>
            <Input
              type="datetime-local"
              placeholder="Start Date"
              value={voucher.startDate}
              onChange={(e) => {
                const newVouchers = [...formik.values.vouchers];
                newVouchers[index].startDate = e.target.value;
                formik.setFieldValue("vouchers", newVouchers);
              }}
            />
            <p>End Valid Voucher</p>
            <Input
              type="datetime-local"
              placeholder="End Date"
              value={voucher.endDate}
              onChange={(e) => {
                const newVouchers = [...formik.values.vouchers];
                newVouchers[index].endDate = e.target.value;
                formik.setFieldValue("vouchers", newVouchers);
              }}
            />
            <Button type="button" onClick={() => removeVoucher(index)}>
              Remove Voucher
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addVoucher}>
          Add Voucher
        </Button>
      </div>

      <div className="flex justify-end">
        <Button
          className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default CreateEventForm;
