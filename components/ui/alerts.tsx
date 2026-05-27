import { toaster } from "./toaster";

export function loading(description: string) {
  toaster.create({
    type: "loading",
    description,
  });
}

export function success(title: string) {
  toaster.create({
    type: "success",
    title
  });
}

export function error(title: string) {
  toaster.create({
    type: "error",
    title
  });
}

export function warning(description: string) {
  toaster.create({
    type: "warning",
    description,
  });
}

export function info(title: string, description: string) {
  toaster.create({
    type: "info",
    title,
    description,
  });
}