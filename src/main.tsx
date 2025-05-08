import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Router } from "./Router.tsx";
import { SolanaProvider } from "./core/providers/solana/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <SolanaProvider>
        <Router />
      </SolanaProvider>
    </ChakraProvider>
  </React.StrictMode>
);
