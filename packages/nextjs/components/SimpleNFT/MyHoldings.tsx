"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NFTCard } from "./NFTcard";
import { useAccount } from "@starknet-react/core";
import { useScaffoldContract } from "~~/hooks/scaffold-stark/useScaffoldContract";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { notification } from "~~/utils/scaffold-stark";
import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { NFTMetaData } from "~~/utils/simpleNFT/nftsMetadata";

export interface Collectible extends Partial<NFTMetaData> {
  id: number;
  uri: string;
  owner: string;
}

export const MyHoldings = ({
  setStatus,
}: {
  setStatus: Dispatch<SetStateAction<string>>;
}) => {
  const { address: connectedAddress } = useAccount();
  const [myAllCollectibles, setMyAllCollectibles] = useState<Collectible[]>([]);
  const [allCollectiblesLoading, setAllCollectiblesLoading] = useState(false);

  const { data: maintenanceTrackerContract } = useScaffoldContract({
    contractName: "MaintenanceTracker",
  });

  const { data: myTotalBalance } = useScaffoldReadContract({
    contractName: "MaintenanceTracker",
    functionName: "balance_of",
    args: [connectedAddress ?? ""],
  });

  useEffect(() => {
    const updateMyCollectibles = async (): Promise<void> => {
      if (
        myTotalBalance === undefined ||
        maintenanceTrackerContract === undefined ||
        connectedAddress === undefined
      )
        return;

      setAllCollectiblesLoading(true);
      const collectibleUpdate: Collectible[] = [];
      const totalBalance = parseInt(myTotalBalance.toString());
      // console.log(`totalBalance: ${totalBalance}`);
      for (let tokenIndex = 0; tokenIndex < totalBalance; tokenIndex++) {
        try {
          const tokenId = await maintenanceTrackerContract.functions[
            "token_of_owner_by_index"
          ](connectedAddress, BigInt(tokenIndex));

          const tokenURI =
            await maintenanceTrackerContract.functions["token_uri"](tokenId);

          const ipfsHash = tokenURI.replace(
            /https:\/\/ipfs\.io\/(ipfs\/)?/,
            ""
          );

          const nftMetadata: NFTMetaData = await getMetadataFromIPFS(ipfsHash);

          collectibleUpdate.push({
            id: parseInt(tokenId.toString()),
            uri: tokenURI,
            owner: connectedAddress,
            ...nftMetadata,
          });
        } catch (e) {
          notification.error("Error fetching all collectibles");
          setAllCollectiblesLoading(false);
          console.log(e);
        }
      }

      collectibleUpdate.sort((a, b) => a.id - b.id);
      // console.log("collectibleUpdate: ", collectibleUpdate);
      setMyAllCollectibles(collectibleUpdate);
      setAllCollectiblesLoading(false);
    };

    updateMyCollectibles().finally(() => setStatus("Mint NFT"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedAddress, myTotalBalance]);

  if (allCollectiblesLoading)
    return (
      <div className="flex justify-center items-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (!connectedAddress) return null;

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">My Certificates</span>
          </h1>
        </div>
      </div>
      {myAllCollectibles.length === 0 ? (
        <div className="flex justify-center items-center mt-10">
          <div className="text-2xl text-primary-content">No NFTs found</div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 my-8 px-5 justify-center">
          {myAllCollectibles.map((item) => (
            <NFTCard nft={item} key={item.id} />
          ))}
        </div>
      )}
    </>
  );
};
