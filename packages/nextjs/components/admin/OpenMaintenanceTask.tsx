import { useState } from "react";
import { notification } from "~~/utils/scaffold-stark";
import { useScaffoldReadContract } from "~~/hooks/scaffold-stark/useScaffoldReadContract";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";
import { useScaffoldMultiWriteContract } from "~~/hooks/scaffold-stark/useScaffoldMultiWriteContract";
import { useBlockNumber } from "@starknet-react/core";
import { BlockTag } from "starknet";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";

export function OpenMaintenanceTask() {
  const [clientName, setClientName] = useState("");
  const [systemName, setSystemName] = useState("");
  const [systemCycles, setSystemCycles] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [startingTime, setStartingTime] = useState("");
  const [cost, setCost] = useState("");
  const [repairman, setRepairman] = useState("");
  const [qualityInspector, setQualityInspector] = useState("");

  const { sendAsync: createTask } = useScaffoldWriteContract({
    contractName: "MaintenanceTracker",
    functionName: "create_maintenance_task",
    args: [
      clientName,
      systemName,
      "maintenance_name",
      Number(systemCycles),
      estimatedTime,
      startingTime,
      Number(cost),
      repairman,
      qualityInspector,
    ],
  });

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    createTask()
      .then(() => {
        notification.success(
          "Maintenance task created successfully, you can view it in the Maintenance Explorer"
        );
      })
      .catch((error: any) => {
        console.error("Error creating maintenance task:", error);
        notification.error("Error creating maintenance task");
      });
  };
  return (
    <>
      <div className="row bg-primary rounded-lg p-2">
        <h5 className="h5">
          <div className="titleTask borderTop text-xl text-bold">
            Open a new maintenance task
          </div>
        </h5>
        <div className="col-md-10">
          <form onSubmit={handleSubmit}>
            <ul className="p-2 tasklist">
              <li>
                <strong>Client Name:</strong>
                <input
                  type="text"
                  className="form-control w-96"
                  placeholder="Enter client name..."
                  aria-label="Search"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </li>
              <li>
                <strong>System Name:</strong>
                <input
                  type="text"
                  className="form-control w-96"
                  placeholder="Enter System name..."
                  aria-label="Search"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                />
              </li>
              <li>
                <strong>System Cycles:</strong>
                <input
                  type="text"
                  className="form-control w-96"
                  placeholder="System cycles..."
                  aria-label="Search"
                  value={systemCycles}
                  onChange={(e) => setSystemCycles(e.target.value)}
                />
              </li>
              <li>
                <strong>Estimated Time (days):</strong>
                <input
                  type="text"
                  className="form-control w-96"
                  placeholder="Enter estimated time..."
                  aria-label="Search"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                />
              </li>
              <li>
                <strong>Starting Date:</strong>
                <input
                  type="text"
                  className="form-control w-96"
                  placeholder="Enter starting time..."
                  aria-label="Search"
                  value={startingTime}
                  onChange={(e) => setStartingTime(e.target.value)}
                />
              </li>
              <li>
                <strong>Cost:</strong>
                <br />
                <input
                  type="text"
                  className="form-contro w-96"
                  placeholder="Enter cost..."
                  aria-label="Search"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </li>
              <li>
                <strong>Repairman (engineer):</strong>
                <input
                  type="text"
                  className="form-control w-96"
                  placeholder="Enter repairman's address..."
                  aria-label="Search"
                  value={repairman}
                  onChange={(e) => setRepairman(e.target.value)}
                />
              </li>
              <li>
                <strong>Quality Inspector (engineer):</strong>
                <input
                  type="text"
                  className="form-control w-96"
                  placeholder="Enter quality inspector's address..."
                  aria-label="Search"
                  value={qualityInspector}
                  onChange={(e) => setQualityInspector(e.target.value)}
                />
              </li>
            </ul>

            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
