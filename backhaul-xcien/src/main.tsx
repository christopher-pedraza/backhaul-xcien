import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import {
  HeroUIProviderWrapper,
  CytoscapeProvider,
  ChangeLogProvider,
} from "@/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastProvider } from "@heroui/toast";



import "@/styles/globals.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HeroUIProviderWrapper>
        <ToastProvider />
        <CytoscapeProvider>
          <ChangeLogProvider>
            <QueryClientProvider client={queryClient}>
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </ChangeLogProvider>
        </CytoscapeProvider>
      </HeroUIProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>,
);
