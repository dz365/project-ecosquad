import { createContext } from "react";

type ToastType = "info" | "success" | "error";
interface IToastContext {
  createToast: (type: ToastType, message: string) => void;
}

export const ToastContext = createContext<IToastContext>({
  createToast: () => {},
});
