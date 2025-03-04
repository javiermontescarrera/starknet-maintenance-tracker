import { useState } from "react";
import { Collectible } from "./MyHoldings";
import { AddressInput } from "../scaffold-stark";
import { Address } from "../scaffold-stark";
import { Address as AddressType } from "@starknet-react/chains";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
export const NFTCard = ({ nft }: { nft: Collectible }) => {
  const [transferToAddress, setTransferToAddress] = useState("");

  const { sendAsync: transferNFT } = useScaffoldWriteContract({
    contractName: "MaintenanceTracker",
    functionName: "transfer_from",
    args: [nft.owner, transferToAddress, BigInt(nft.id.toString())],
  });

  const wrapInTryCatch =
    (fn: () => Promise<any>, errorMessageFnDescription: string) => async () => {
      try {
        await fn();
      } catch (error) {
        console.error(
          `Error calling ${errorMessageFnDescription} function`,
          error
        );
      }
    };

  return (
    <div className="card card-compact bg-base-100 sm:min-w-[300px] border border-secondary">
      <figure className="relative rounded-t-[15px] pt-2">
        {/* eslint-disable-next-line  */}
        <img
          src={nft.image}
          alt="NFT Image"
          className="h-60 min-w-full object-contain"
        />
        <figcaption className="glass absolute bottom-4 left-4 p-4 w-25 rounded-xl">
          <span className="text-white "># {nft.id}</span>
        </figcaption>
      </figure>
      <div className="card-body space-y-3">
        <div className="flex items-center justify-center">
          <p className="text-xl p-0 m-0 font-semibold">{nft.name}</p>
        </div>
        <div className="flex flex-col justify-center mt-1">
          <p className="my-0 text-lg text-justify w-96">{nft.description}</p>
        </div>
        <div className="flex items-center justify-left w-96">
          {/* <div className="flex flex-wrap space-x-2 mt-1 justify-between"> */}
          <div className="flex flex-wrap mt-1 justify-between">
            {nft.attributes?.map((attr: any, index: any) => (
              <span
                key={index}
                className=" badge-secondary badge py-3.5 mb-0.5 text-white border-base-100 w-96 truncate justify-start"
              >
                <span className="font-bold">{attr.trait_type}</span>:{" "}
                {attr.value}
              </span>
            ))}
          </div>
        </div>
        <div className="flex space-x-3 mt-1 items-center">
          <span className="text-lg font-semibold">Owner : </span>
          <Address address={nft.owner as AddressType} />
        </div>
        {/* <div className="flex flex-col my-2 space-y-1">
          <span className="text-lg font-semibold mb-1">Transfer To: </span>
          <AddressInput
            value={transferToAddress}
            placeholder="receiver address"
            onChange={(newValue) => setTransferToAddress(newValue)}
          />
        </div>
        <div className="card-actions justify-end">
          <button
            className="btn btn-secondary btn-md px-8 tracking-wide text-white"
            onClick={wrapInTryCatch(transferNFT, "transferNFT")}
          >
            Send
          </button>
        </div> */}
      </div>
    </div>
  );
};
