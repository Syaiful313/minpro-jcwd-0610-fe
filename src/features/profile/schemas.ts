import * as Yup from "yup";

export const EditProfileSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  bio: Yup.string().max(500, "Bio must be 500 characters or less"),
})

export const ChangePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your new password"),
})

export const ApplyOrganizerSchema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required").max(50),
  companyWebsite: Yup.string()
    .required("Company website is required")
    .max(50)
    .url("Invalid URL"),
  companyAddress: Yup.string().required("Company address is required").max(200),
  companyRole: Yup.string().required("Role in company is required").max(50),
  details: Yup.string().required("Company details are required").max(1000),
  governmentId: Yup.mixed().nullable().required("Government ID is required"),
});

export const validationOrganizerSchema = Yup.object({
    companyName: Yup.string().required("Organization name is required"),
    companyWebsite: Yup.string().nullable(),
    companyAddress: Yup.string().required("Address is required"),
    details: Yup.string().required("Organization description is required"),
  });
