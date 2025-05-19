import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { HeroUIProviderWrapper, CytoscapeProvider } from "@/providers";

import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HeroUIProviderWrapper>
        <CytoscapeProvider>
          <App />
        </CytoscapeProvider>
      </HeroUIProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>,
);
