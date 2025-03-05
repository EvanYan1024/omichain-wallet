import { RainbowKitApp, config } from "../components/Rainbowkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@chakra-ui/react";
import { useAccount, useWalletClient, useWriteContract } from "wagmi";
import { writeContract } from "wagmi/actions";
import { baseSepolia, zetachainAthensTestnet } from "viem/chains";
import { useState } from "react";
import { AirdropClient } from "@sign-global/tokentable";
import { useQuery } from "@tanstack/react-query";
import { getAddress, parseEther } from "viem";

const mockEndpoint = "https://dev.dev.ethsign.xyz:3057/api";

const airdropClient = new AirdropClient({
  // projectId: 'AD_TEV94wvkxkvn',
  projectId: "AD_d5aaprvPQEiP",
  endpoint: mockEndpoint,
  // slug: 'move'
});

const Content = () => {
  // const { writeContract } = useWriteContract();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const { data } = useQuery({
    queryKey: ["airdrop", address],
    queryFn: async () => {
      try {
        // const version = await airdropClient.getVersion();
        const res = await airdropClient.getAirdropClaims({
          address: "UQCoGD7p0wn0wputtMcST45gfq-FobqDgwOHEy1RU9pkkOI5",
        });
        console.log(res);

        const isClaimedArr = await airdropClient.checkClaimed(res[0].claimId);

        console.log(isClaimedArr, "is claim");

        return isClaimedArr;
      } catch (e) {
        console.log(e);
      }
    },
  });

  console.log(data, "data");

  const deploy = async () => {
    console.log("deploy");
    try {
      // await writeContract(config, {
      //   abi: abi,
      //   address: "0xa5E010eC818b715B339AbB21C4eC4F9A779AF0Df",
      //   functionName: "mint",
      //   value: parseEther("0.2"),
      //   // args: [parseEther("0.1"), "0xb2476CF9599Bd75DD5d024e42DbEEa666E6c23C3"],
      //   // functionName: "setAuctionParams",
      //   // args: [
      //   //   "1737604800",
      //   //   "1737691200",
      //   //   parseEther("0.2"),
      //   //   "0xbC37Ee54F066e79C23389C55925f877f79F3CB84",
      //   //   "0x0000000000000000000000000000000000000000",
      //   //   0,
      //   //   1505,
      //   // ],
      // });
    } catch (e) {
      console.log(e);
    }
  };

  const withdraw = async () => {
    try {
      await writeContract(config, {
        abi: abi,
        address: "0xCf95E0F98570210AE2474D6ACDE2F5BE2e765730",
        functionName: "withdraw",
        chainId: baseSepolia.id,
        args: [],
      });
    } catch (e) {
      console.log(e);
    }
  };

  const claim = async () => {
    const hash = await airdropClient.claimAirdrop({
      walletClient: walletClient,
      claimId: data[0].claimId,
    });
    console.log(hash);
  };
  return (
    <div>
      <h1>Content</h1>
      <div className="flex gap-6">
        <Button onClick={deploy}>Deploy</Button>
        <Button onClick={withdraw}>Withdraw</Button>
        <Button onClick={claim}>Claim Airdrop</Button>
      </div>
      <div>{JSON.stringify(window.ethereum.isMetaMask)}</div>
    </div>
  );
};

export const RainbowAppPage = () => {
  return (
    <RainbowKitApp>
      <div>
        <h1>RainbowKit</h1>
        <ConnectButton />
      </div>
      <Content />
    </RainbowKitApp>
  );
};
