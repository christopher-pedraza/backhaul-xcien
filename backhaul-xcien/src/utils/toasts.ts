import { addToast } from "@heroui/react"

interface ToastOptions {
  title: string;
  description?: string;
}

export const showSuccessToast = ({
  title,
  description
}: ToastOptions) => {
  addToast({
    title,
    description,
    color: "success",
  })
}


export const showInfoToast = ({
  title,
  description
}: ToastOptions) => {
  addToast({
    title,
    description,
    color: "primary",
  })
}