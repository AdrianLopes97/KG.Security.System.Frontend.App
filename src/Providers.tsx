import { AuthProvider } from "@/contexts/auth-context";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter } from "react-router";
import { queryClient } from "./lib/tanstack-query";

interface ProvidersProps {
  readonly children: React.ReactNode;
}

export function Providers(props: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>{props.children}</BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
