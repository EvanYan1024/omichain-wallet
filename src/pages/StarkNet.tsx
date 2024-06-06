import React from "react";

import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  infuraProvider
} from "@starknet-react/core";
import { StarkWallet } from "./StarkWallet";

export function StarknetProvider() {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [
      argent(),
      braavos(),
    ],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random"
  });

  return (
    <StarknetConfig
      autoConnect
      chains={[sepolia, mainnet]}
      provider={infuraProvider({ apiKey: 'a2ab6d6bba0d466cade2c371d55b8134' })}
      connectors={connectors}
      explorer={voyager}
    >
      <StarkWallet />
    </StarknetConfig>
  )
}