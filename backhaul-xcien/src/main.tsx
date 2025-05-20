import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import {
  HeroUIProviderWrapper,
  CytoscapeProvider,
  HistoryProvider,
} from "@/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@/styles/globals.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HeroUIProviderWrapper>
        <CytoscapeProvider>
          <HistoryProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </HistoryProvider>
        </CytoscapeProvider>
      </HeroUIProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>,
);
