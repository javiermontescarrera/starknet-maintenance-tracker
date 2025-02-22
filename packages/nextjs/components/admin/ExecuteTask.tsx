import { useState } from "react";
import { notification } from "~~/utils/scaffold-stark";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark/useScaffoldWriteContract";
import { TaskSelect } from "~~/components/admin/TaskSelect";

export function ExecuteTask() {
  const [selectedTask, setSelectedTask] = useState(0);

  const { sendAsync: completeMaintenance } = useScaffoldWriteContract({
    contractName: "MaintenanceTracker",
    functionName: "complete_maintenance",
    args: [selectedTask],
  });

  const handleTaskChange = (event: { target: { value: string } }) => {
    setSelectedTask(parseInt(event.target.value, 10));
  };

  const handleCompleteTask = async (taskId: number) => {
    // notification.info(`Executing task ${selectedTask}...`);
    await completeMaintenance()
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
      <TaskSelect
        actionName="Execute Task"
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        handleAction={handleCompleteTask}
      />
    </div>
  );
}
