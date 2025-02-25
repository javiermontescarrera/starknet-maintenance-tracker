"use client";

import type { NextPage } from "next";
import { useAccount } from "@starknet-react/core";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useState } from "react";
import { OverviewSection } from "~~/components/OverviewSection";
import { MaintenanceExplorer } from "~~/components/maintenance/MaintenanceExplorer";
import { MyHoldings } from "~~/components/SimpleNFT/MyHoldings";
import ConnectModal from "~~/components/scaffold-stark/CustomConnectButton/ConnectModal";

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const [status, setStatus] = useState("Mint NFT");
  const [isMinting, setIsMinting] = useState(false);
  const [lastMintedTokenId, setLastMintedTokenId] = useState<number>();

  const { sendAsync: mintItem } = useScaffoldWriteContract({
    contractName: "MaintenanceTracker",
    functionName: "mint_item",
    args: [connectedAddress, ""],
  });

  const { data: tokenIdCounter, refetch } = useScaffoldReadContract({
    contractName: "MaintenanceTracker",
    functionName: "current",
    watch: true,
  });
  return (
    <>
      <OverviewSection />
      {isConnected ? (
        <>
          <MaintenanceExplorer setStatus={setStatus} />
          <MyHoldings setStatus={setStatus} />
        </>
      ) : (
        <div className="flex flex-row items-center justify-center gap-4">
          <span className="text-2xl text-red-400 text-center font-bold">
            Connect your wallet to get started 👉
          </span>
          <ConnectModal />
        </div>
      )}
    </>
  );
};

export default Home;
