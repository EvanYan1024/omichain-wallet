import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import { ETHWallet } from "./pages/ETHWallet";
import { ADAWallet } from "./pages/ADAWallet";
import { OKXWallet } from "./pages/OKX";
import { TonWallet } from "./pages/TonWallet";
import { RainbowAppPage } from "./pages/Rainbow";
import SignIn from "./pages/SignIn";
import { DocuSign } from "./pages/DocuSign.tsx";
import { StarknetProvider } from "./pages/StarkNet.tsx";
import { Web3ModalPage } from "./pages/Web3Modal.tsx";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/404/index.tsx";
import SolanaToken from "./pages/SolanaToken";
import { AppLayout } from "./components/layout/app-layout.tsx";

const routerConfig = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "eth",
        element: <ETHWallet />,
      },
      {
        path: "web3modal",
        element: <Web3ModalPage />,
      },
      {
        path: "rainbow",
        element: <RainbowAppPage />,
      },
      {
        path: "ada",
        element: <ADAWallet />,
      },
      {
        path: "starknet",
        element: <StarknetProvider />,
      },
      {
        path: "okx",
        element: <OKXWallet />,
      },
      {
        path: "ton",
        element: <TonWallet />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "solana",
        element: <SolanaToken />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
const router = createBrowserRouter(routerConfig);

export const Router = () => {
  return <RouterProvider router={router} />;
};
