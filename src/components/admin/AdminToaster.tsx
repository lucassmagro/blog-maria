"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** Container global dos toasts do admin. */
export function AdminToaster() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="light"
    />
  );
}
