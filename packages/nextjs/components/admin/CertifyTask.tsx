import { useState } from "react";
import { notification } from "~~/utils/scaffold-stark";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";

export function CertifyTask() {
  const [selectedTask, setSelectedTask] = useState(1);

  const { sendAsync: certifyMaintenance } = useScaffoldWriteContract({
    contractName: "MaintenanceTracker",
    functionName: "certify_maintenance",
    args: [selectedTask],
  });

  const handleTaskChange = (event: { target: { value: string } }) => {
    setSelectedTask(parseInt(event.target.value, 10));
  };

  const handleCertifyTask = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    notification.info(`Executing task ${selectedTask}...`);
    certifyMaintenance()
      .then(() => {
        notification.success("Maintenance task certified successfully!");
      })
      .catch((error) => {
        console.error("Error certifying task:", error);
        notification.error("Error certifying task");
      });
  };

  return (
    <div className="bg-primary rounded-lg p-2">
      <div className="row">
        <h5 className="h5">
          <div className="titleTask borderTop mt-4 text-xl text-bold">
            Certify Task ( by the quality inspector)
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
          className="form-control m-2 p-1 rounded-md"
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

      <button
        className="btn btn-primary mt-2 border-2 border-secondary"
        onClick={handleCertifyTask}
      >
        Certify Task
      </button>
    </div>
  );
}
