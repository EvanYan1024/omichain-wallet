import React from "react";
import ReactDOM from "react-dom/client";
import "bulma/css/bulma.css";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Router } from "./Router.tsx";
import { SolanaProvider } from "./core/providers/solana/index.tsx";

console.log(Buffer, "b");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <SolanaProvider>
        <Router />
      </SolanaProvider>
    </ChakraProvider>
  </React.StrictMode>
);
