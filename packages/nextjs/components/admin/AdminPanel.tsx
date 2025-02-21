import { CertifyTask } from "./CertifyTask";
import { ExecuteTask } from "./ExecuteTask";
import { OpenMaintenanceTask } from "./OpenMaintenanceTask";
import { PayTask } from "./PayTask";

export function AdminPanel() {
  return (
    <>
      <div className="wrapper border-2 border-secondary rounded-lg p-4">
        <h4 className="text-2xl">Admin panel</h4>
        <br />
        <OpenMaintenanceTask></OpenMaintenanceTask>
        <br />
        <ExecuteTask></ExecuteTask>
        <br />
        <CertifyTask></CertifyTask>
        <br />
        <PayTask></PayTask>
      </div>
    </>
  );
}
