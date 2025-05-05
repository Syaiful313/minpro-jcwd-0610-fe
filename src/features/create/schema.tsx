import * as Yup from "yup";

export const CreateEventSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  category: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
  thumbnail: Yup.mixed().required("Thumbnail is required"),
  location: Yup.string().required("Location is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), "End date must be after start date")
    .required("End date is required"),
  tickets: Yup.array()
    .of(
      Yup.object().shape({

        name: Yup.string().required("Ticket type is required"),

        price: Yup.number().required("Ticket price is required").min(0, "Price must be positive"),
        quantity: Yup.number().required("Ticket quantity is required").min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one ticket type is required"),
  vouchers: Yup.array().of(
    Yup.object().shape({
      code: Yup.string().required("Voucher code is required"),
      discount: Yup.number().required("Discount is required").min(0, "Discount must be positive"),
    })
  ),
});