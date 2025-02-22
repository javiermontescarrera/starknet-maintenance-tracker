import { useState } from "react";
import { notification } from "~~/utils/scaffold-stark";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { TaskSelect } from "~~/components/admin/TaskSelect";

export function CertifyTask() {
  const [selectedTask, setSelectedTask] = useState(0);

  const { sendAsync: certifyMaintenance } = useScaffoldWriteContract({
    contractName: "MaintenanceTracker",
    functionName: "certify_maintenance",
    args: [selectedTask],
  });

  const handleTaskChange = (event: { target: { value: string } }) => {
    setSelectedTask(parseInt(event.target.value, 10));
  };

  const handleCertifyTask = async (taskId: number) => {
    notification.info(`Executing task ${selectedTask}...`);
    await certifyMaintenance()
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
      <TaskSelect
        actionName="Certify Task"
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        handleAction={handleCertifyTask}
      />
    </div>
  );
}
