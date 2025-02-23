const nftsMetadata = [
  {
    description: "It's actually a bison?",
    external_url:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/", // <-- this can link to a page for the specific file too    i
    image:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/buffalo.jpg",
    name: "Buffalo",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "green",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 42,
      },
    ],
  },
  {
    description: "What is it so worried about?",
    external_url:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/", // <-- this can link to a page for the specific file too
    image:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/zebra.jpg",
    name: "Zebra",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "blue",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 38,
      },
    ],
  },
  {
    description: "What a horn!",
    external_url:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/", // <-- this can link to a page for the specific file too
    image:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/rhino.jpg",
    name: "Rhino",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "pink",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 22,
      },
    ],
  },
  {
    description: "Is that an underbyte?",
    external_url:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/", // <-- this can link to a page for the specific file too
    image:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/fish.jpg",
    name: "Fish",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "blue",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 15,
      },
    ],
  },
  {
    description: "So delicate.",
    external_url:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/", // <-- this can link to a page for the specific file too
    image:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/flamingo.jpg",
    name: "Flamingo",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "black",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 6,
      },
    ],
  },
  {
    description: "Raaaar!",
    external_url:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/", // <-- this can link to a page for the specific file too
    image:
      "https://ipfs.io/ipfs/QmR4GGDdK8dsHfspLbcz864SaSUDUAVbF7Wc99NLJqqn2P/godzilla.jpg",
    name: "Godzilla",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "orange",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 99,
      },
    ],
  },
];

export interface TaskData {
  client_name: string;
  system_name: string;
  system_cycles: number;
  start_time: number;
  estimated_time: number;
  general_status: any;
  execution_status: any;
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
        value: "0x" + taskData.repairman.toString(),
      },
      {
        trait_type: "qualityInspector",
        value: "0x" + taskData.quality_inspector.toString(),
      },
    ],
  };

  return metadata;
};

export enum eTaskStatus {
  IDLE = "Idle",
  PENDING = "Pending",
  COMPLETED_BY_REPAIRMAN = "Completed by Repairman",
  CERTIFIED_BY_QUALITY_INSPECTOR = "Certified by Quality Inspector",
  COMPLETED_UNPAID = "Completed Unpaid",
  COMPLETED_PAID = "Completed Paid",
  CERTIFICATE_MINTED = "Certificate Minted",
}

export const getTaskStatus = (taskData: TaskData) => {
  let taskStatus: eTaskStatus = eTaskStatus.IDLE;

  if (taskData) {
    if (taskData.general_status.variant.InProgress !== undefined) {
      if (taskData.execution_status.variant.None !== undefined) {
        taskStatus = eTaskStatus.PENDING;
      } else if (
        taskData.execution_status.variant.CompletedByRepairman !== undefined
      )
        taskStatus = eTaskStatus.COMPLETED_BY_REPAIRMAN;
      else if (
        taskData.execution_status.variant.CertifiedByQualityInspector !==
        undefined
      )
        taskStatus = eTaskStatus.CERTIFIED_BY_QUALITY_INSPECTOR;
    } else if (taskData.general_status.variant.CompletedUnpaid !== undefined) {
      taskStatus = eTaskStatus.COMPLETED_UNPAID;
    } else if (taskData.general_status.variant.CompletedPaid !== undefined) {
      taskStatus = eTaskStatus.COMPLETED_PAID;
    } else if (
      taskData.general_status.variant.CertificateMinted !== undefined
    ) {
      taskStatus = eTaskStatus.CERTIFICATE_MINTED;
    }
  }

  return taskStatus;
};

export type NFTMetaData = (typeof nftsMetadata)[number];

export default nftsMetadata;
