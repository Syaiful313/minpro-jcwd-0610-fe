import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);

export const registerSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 8 characters")
    .minLowercase(1)
    .minUppercase(1)
    .minNumbers(1)
    .required("Password is required"),
});
