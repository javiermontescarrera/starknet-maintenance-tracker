import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import {
  // TaskData,
  // nftMetadata,
  eTaskStatus,
  getTaskStatus,
} from "~~/utils/simpleNFT/nftsMetadata";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";

export function TaskSelect({
  actionName,
  selectedTask,
  enabledStates,
  setSelectedTask,
  handleAction,
}: {
  actionName: string;
  selectedTask: number;
  enabledStates: eTaskStatus[];
  setSelectedTask: Dispatch<SetStateAction<number>>;
  handleAction: (taskId: number) => void;
}) {
  const { address: connectedAddress } = useAccount();

  const [taskStatus, setTaskStatus] = useState(eTaskStatus.PENDING);

  const { data: taskData, refetch: refreshTaskData } = useScaffoldReadContract({
    contractName: "MaintenanceTracker",
    functionName: "get_maintenance_task",
    args: [selectedTask],
    watch: true,
  });

  const { data: numberOfTasks, refetch: refreshNumberOfTasks } =
    useScaffoldReadContract({
      contractName: "MaintenanceTracker",
      functionName: "current",
      watch: true,
    });

  const handleTaskChange = (event: { target: { value: string } }) => {
    setSelectedTask(parseInt(event.target.value, 10));
  };

  const refreshInfo = async () => {
    refreshTaskData().then(() => {
      setTaskStatus(getTaskStatus(taskData as any));
    });
    // refreshTaskData().then(() => console.log("taskData: ", taskData));
  };

  useEffect(() => {
    refreshInfo();
  }, [selectedTask]);

  const handleClick = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    await handleAction(selectedTask);
    await refreshInfo();
  };

  return (
    <>
      <div className="row">
        <div className="p-2">
          <label htmlFor="taskDropdown">
            <strong>Select Task:</strong>
          </label>
        </div>
        <div className="flex row-auto gap-2">
          <select
            id="taskDropdown"
            className="form-control mt-0 m-2 p-1 rounded-md w-32"
            value={selectedTask}
            defaultValue={0}
            onChange={handleTaskChange}
          >
            <option value={0} disabled hidden>
              Select a task
            </option>
            {Array.from({ length: Number(numberOfTasks) }, (_, index) => (
              <option key={index} value={index + 1}>
                Task {index + 1}
              </option>
            ))}
          </select>
          {selectedTask > 0 && (
            <div>
              <strong>Task Status: </strong>
              <span>{taskStatus.toString()}</span>
            </div>
          )}
        </div>
      </div>
      <button
        className="btn btn-primary mt-2 border-2 border-secondary"
        onClick={handleClick}
        disabled={!enabledStates.includes(taskStatus)}
      >
        {actionName}
      </button>
    </>
  );
}
