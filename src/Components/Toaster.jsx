import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = () => {
  return <ToastContainer />;
};

export const triggerToast = (type, message) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export default Toast;
