import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter } from "react-router";
import { queryClient } from "./lib/tanstack-query";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers(props: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{props.children}</BrowserRouter>
    </QueryClientProvider>
  );
}
