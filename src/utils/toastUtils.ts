import { toast } from "react-toastify";

export const showToast = {
  success: (msg: string) =>
    toast.success(msg, { position: "top-right", autoClose: 5000 }),
  error: (msg: string) =>
    toast.error(msg, { position: "top-right", autoClose: 5000 }),
  info: (msg: string) =>
    toast.info(msg, { position: "top-right", autoClose: 3000 }),
};
