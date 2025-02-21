"use client";

import type { NextPage } from "next";
import { useAccount } from "@starknet-react/core";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useState } from "react";
import { OverviewSection } from "~~/components/OverviewSection";
import { MaintenanceExplorer } from "~~/components/maintenance/MaintenanceExplorer";

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

  // const handleMintItem = async () => {
  //   setStatus("Minting NFT");
  //   setIsMinting(true);
  //   const tokenIdCounterNumber = Number(tokenIdCounter);

  //   // circle back to the zero item if we've reached the end of the array
  //   if (
  //     tokenIdCounter === undefined ||
  //     tokenIdCounterNumber === lastMintedTokenId
  //   ) {
  //     setStatus("Mint NFT");
  //     setIsMinting(false);
  //     notification.warning(
  //       "Cannot mint the same token again, please wait for the new token ID"
  //     );
  //     return;
  //   }

  //   // const currentTokenMetaData = nftsMetadata[tokenIdCounterNumber % nftsMetadata.length];
  //   const currentTokenMetaData = nftMetadata();
  //   // console.log("currentTokenMetaData: ", currentTokenMetaData);
  //   const notificationId = notification.loading("Uploading to IPFS");
  //   try {
  //     const uploadedItem = await addToIPFS(currentTokenMetaData);

  //     // First remove previous loading notification and then show success notification
  //     notification.remove(notificationId);
  //     notification.success("Metadata uploaded to IPFS");

  //     await mintItem({
  //       args: [connectedAddress, uploadedItem.path],
  //     });
  //     setStatus("Updating NFT List");
  //     refetch();
  //     setLastMintedTokenId(tokenIdCounterNumber);
  //     setIsMinting(false);
  //   } catch (error) {
  //     notification.remove(notificationId);
  //     console.error(error);
  //     setStatus("Mint NFT");
  //     setIsMinting(false);
  //   }
  // };

  return (
    <>
      <OverviewSection />
      <MaintenanceExplorer setStatus={setStatus} />
      {/* <div className="flex items-center flex-col pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">My NFTs</span>
          </h1>
        </div>
      </div> */}
      {/* <div className="flex justify-center">
        {!isConnected || isConnecting ? (
          <CustomConnectButton />
        ) : (
          <button
            className="btn btn-secondary text-white"
            disabled={status !== "Mint NFT" || isMinting}
            onClick={handleMintItem}
          >
            {status !== "Mint NFT" && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
            {status}
          </button>
        )}
      </div> */}
      {/* <MyHoldings setStatus={setStatus} /> */}
    </>
  );
};

export default Home;
