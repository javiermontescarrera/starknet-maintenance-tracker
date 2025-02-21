import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { notification } from "~~/utils/scaffold-stark";
import { TaskData, nftMetadata } from "~~/utils/scaffold-stark/common";
import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";

export function PayTask() {
  const { address: connectedAddress } = useAccount();
  const { data: MaintenanceTracker } =
    useDeployedContractInfo("MaintenanceTracker");

  const [selectedTask, setSelectedTask] = useState(1);
  const [uploadedItemPath, setUploadedItemPath] = useState("");

  const { data: taskData, refetch } = useScaffoldReadContract({
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

  const handleTaskChange = (event: { target: { value: string } }) => {
    setSelectedTask(parseInt(event.target.value, 10));
  };

  const handlePayAndMint = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // notification.info(`Paying for task ${selectedTask}...`);
    // console.log("taskData: ", taskData);

    const currentTokenMetaData = nftMetadata(taskData as any);
    console.log("currentTokenMetaData: ", currentTokenMetaData);

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
    refetch().then(() => {
      if (uploadedItemPath) {
        console.log("uploadedItemPath: ", uploadedItemPath);
        if (uploadedItemPath !== "")
          payAndMint()
            .then(() => {
              notification.success("Maintenance task certified successfully!");
            })
            .catch((error) => {
              console.error("Error certifying task:", error);
              notification.error("Error certifying task");
            });
      }
    });
  }, [uploadedItemPath]);

  useEffect(() => {
    refetch();
    // refetch().then(() => console.log("taskData: ", taskData));
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
      <div className="row">
        <div className="p-2">
          <label htmlFor="taskDropdown">
            <strong>Select Task:</strong>
          </label>
        </div>
        <select
          id="taskDropdown"
          className="form-control m-2"
          value={selectedTask}
          onChange={handleTaskChange}
        >
          {Array.from({ length: 11 }, (_, index) => (
            <option key={index} value={index + 1}>
              Task {index + 1}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary mt-2" onClick={handlePayAndMint}>
        Pay and Mint
      </button>
    </div>
  );
}
