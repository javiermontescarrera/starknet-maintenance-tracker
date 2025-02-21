// To be used in JSON.stringify when a field might be bigint
// https://wagmi.sh/react/faq#bigint-serialization
import { Address } from "@starknet-react/chains";
import { getChecksumAddress } from "starknet";

export const replacer = (_key: string, value: unknown) => {
  if (typeof value === "bigint") return value.toString();
  return value;
};

const addressRegex = /^0x[a-fA-F0-9]{40}$/;

export function isAddress(address: string): address is Address {
  return addressRegex.test(address);
}

export function feltToHex(feltBigInt: bigint) {
  return `0x${feltBigInt.toString(16)}`;
}

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export interface TaskData {
  client_name: string;
  system_name: string;
  system_cycles: number;
  start_time: number;
  estimated_time: number;
  repairman: string;
  quality_inspector: string;
}

export const nftMetadata = (taskData: TaskData | undefined) => {
  if (taskData === undefined) return {};
  const metadata = {
    description:
      "This digital certificate serves as authentic evidence that the specified maintenance operations were performed under specific conditions",
    external_url:
      "https://ipfs.io/ipfs/QmdtibqnMFai8CwQ6qUUUkxhs4MAZNPnrx9h4Ncn5PyQpn/",
    image:
      "https://ipfs.io/ipfs/QmdtibqnMFai8CwQ6qUUUkxhs4MAZNPnrx9h4Ncn5PyQpn/",
    name: "Maintenance Certificate",
    attributes: [
      {
        trait_type: "clientName",
        value: taskData.client_name,
      },
      {
        trait_type: "systemName",
        value: taskData.system_name,
      },
      {
        display_type: "boost_number",
        trait_type: "systemCycles",
        value: taskData.system_cycles.toString(),
      },
      {
        display_type: "date",
        trait_type: "1. startTime",
        value: taskData.start_time.toString(),
      },
      {
        trait_type: "2. estimatedTime",
        value: taskData.estimated_time.toString(),
      },
      {
        trait_type: "repairman",
        value: taskData.repairman.toString(),
      },
      {
        trait_type: "qualityInspector",
        value: taskData.quality_inspector.toString(),
      },
    ],
  };

  return metadata;
};
