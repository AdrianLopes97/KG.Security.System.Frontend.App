import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClient } from "./lib/tanstack-query";
import { BrowserRouter } from "react-router";

interface ProvidersProps {
    children: React.ReactNode;
}

export function Providers(props: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            {props.children}
        </BrowserRouter>
    </QueryClientProvider>
  )
}
