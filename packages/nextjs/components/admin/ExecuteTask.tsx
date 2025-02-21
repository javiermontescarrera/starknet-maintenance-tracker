import { useState } from "react";
import { notification } from "~~/utils/scaffold-stark";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

export function ExecuteTask() {
  const [selectedTask, setSelectedTask] = useState(1);

  const { sendAsync: completeMaintenance } = useScaffoldWriteContract({
    contractName: "MaintenanceTracker",
    functionName: "complete_maintenance",
    args: [selectedTask],
  });

  const handleTaskChange = (event: { target: { value: string } }) => {
    setSelectedTask(parseInt(event.target.value, 10));
  };

  const handleCompleteTask = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // notification.info(`Executing task ${selectedTask}...`);
    completeMaintenance()
      .then(() => {
        notification.success("Maintenance task completed successfully!");
      })
      .catch((error) => {
        console.error("Error executing task:", error);
        notification.error("Error executing task");
      });
  };

  return (
    <div className="bg-primary rounded-lg p-2">
      <div className="row">
        <h5 className="h5">
          <div className="titleTask borderTop mt-4 text-xl text-bold">
            Execute and sign task ( by the repairman)
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

      <button className="btn btn-primary mt-2" onClick={handleCompleteTask}>
        Execute Task
      </button>
    </div>
  );
}
