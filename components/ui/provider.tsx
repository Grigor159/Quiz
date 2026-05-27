"use client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "./toaster";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      {children} <Toaster />
    </ChakraProvider>
  );
}
