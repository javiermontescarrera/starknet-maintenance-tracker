import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { notification } from "~~/utils/scaffold-stark";
import { TaskData, nftMetadata } from "~~/utils/simpleNFT/nftsMetadata";
import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { TaskSelect } from "~~/components/admin/TaskSelect";
import { eTaskStatus } from "~~/utils/simpleNFT/nftsMetadata";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";

export function PayTask() {
  const { address: connectedAddress } = useAccount();
  const { data: MaintenanceTracker } =
    useDeployedContractInfo("MaintenanceTracker");

  const [selectedTask, setSelectedTask] = useState(0);
  const [uploadedItemPath, setUploadedItemPath] = useState("");

  const { data: taskData, refetch: refreshTaskData } = useScaffoldReadContract({
    contractName: "MaintenanceTracker",
    functionName: "get_maintenance_task",
    args: [selectedTask],
    watch: true,
  });

  const { sendAsync: payAndMint } = useScaffoldMultiWriteContract({
    calls: [
      {
        contractName: "Eth",
        functionName: "approve",
        args: [MaintenanceTracker?.address, 1000000000n],
      },
      {
        contractName: "MaintenanceTracker",
        functionName: "pay_and_mint",
        args: [selectedTask, connectedAddress, uploadedItemPath],
      },
    ],
  });

  const handlePayAndMint = async (taskId: number) => {
    // notification.info(`Paying for task ${selectedTask}...`);
    // console.log("taskData: ", taskData);

    const currentTokenMetaData = nftMetadata(taskData as any);
    // console.log("currentTokenMetaData: ", currentTokenMetaData);

    const notificationId = notification.loading("Uploading to IPFS");
    try {
      const uploadedItem = await addToIPFS(currentTokenMetaData);
      setUploadedItemPath(uploadedItem.path);

      // First remove previous loading notification and then show success notification
      notification.remove(notificationId);

      notification.success("Metadata uploaded to IPFS");
    } catch (error: any) {
      notification.remove(notificationId);
      console.error(error);
      // setStatus("Mint NFT");
      // setIsMinting(false);
    }
  };

  useEffect(() => {
    // refreshTaskData().then(() => {
    if (uploadedItemPath) {
      if (uploadedItemPath !== "") console.log("selectedTask: ", selectedTask);
      payAndMint()
        .then(() => {
          notification.success("Maintenance task certified successfully!");
        })
        .catch((error) => {
          console.error("Error paying and minting NFT:", error);
          notification.error("Error paying and minting NFT");
        });
    }
    // });
  }, [uploadedItemPath]);

  useEffect(() => {
    refreshTaskData();
    // refreshTaskData().then(() => console.log("taskData: ", taskData));
  }, [selectedTask]);

  return (
    <div className="bg-primary rounded-lg p-2">
      <div className="row">
        <h5 className="h5">
          <div className="titleTask borderTop mt-4 text-xl text-bold">
            Pay Task (by the client)
          </div>
        </h5>
      </div>
      <TaskSelect
        actionName="Pay and Mint"
        selectedTask={selectedTask}
        enabledStates={[
          eTaskStatus.COMPLETED_UNPAID,
          eTaskStatus.COMPLETED_PAID,
        ]}
        setSelectedTask={setSelectedTask}
        handleAction={handlePayAndMint}
      />
    </div>
  );
}
