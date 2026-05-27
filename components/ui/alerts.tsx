import { toaster } from "./toaster";

export function loading(description: string) {
  toaster.create({
    type: "loading",
    description,
  });
}

export function success(title: string, description: string) {
  toaster.create({
    type: "success",
    title,
    description,
  });
}

export function error(title: string, description: string) {
  toaster.create({
    type: "error",
    title,
    description,
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