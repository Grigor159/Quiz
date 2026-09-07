"use client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "../components/ui/toaster";

export function ChakraUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      {children} <Toaster />
    </ChakraProvider>
  );
}
