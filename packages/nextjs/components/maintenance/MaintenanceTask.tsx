import { useEffect, useState } from "react";
import Image from "next/image";

const URL = "http://localhost:8080";
const PATH = "/tasks-list";

export function MaintenanceTask() {
  interface taskObject {
    tokenId: string;
    clientName: string;
    systemName: string;
    maintenanceName: string;
    systemCycles: string;
    estimatedTime: string;
    startTime: any;
    taskCost: string;
    genStatus: string;
    execStatus: string;
    repairman: string;
    qualityInspector: string;
  }

  const [data, setData] = useState<{ result: taskObject[] }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(URL + PATH)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading Task List...</p>;
  if (!data) return <p>No tasks yet</p>;

  const taskList: taskObject[] = data.result;

  if (typeof taskList != "undefined" && taskList?.length < 1)
    return <p>No tasks yet</p>;

  return (
    <>
      {taskList?.map((task: taskObject) => {
        return (
          <div className="row mt-3" key={task?.tokenId}>
            <h5 className="h5 borderTop">
              <div className="titleTask">Task Id #0 | {task?.genStatus}</div>
            </h5>
            {/* <small>
              <div style={{ width: "300px" }}>
                <code>{JSON.stringify(task).split(",").join("\n")}</code>
              </div>
            </small> */}
            <b>ID: {task.tokenId}</b>
            <div className="col-md-2">
              <div className="img-nft">
                <Image
                  alt="img2"
                  style={{ width: "100%" }}
                  width={0}
                  height={0}
                  src="https://ipfs.io/ipfs/bafybeifj3wz462zils26mztyepwfzhxlxe557k3sptm3yfcplorw7xlpoi"
                />
              </div>
            </div>
            <div className="col-md-10">
              <ul className="p-2 tasklist">
                <li>
                  <strong>Task Id:</strong> {task?.tokenId}
                </li>
                <li>
                  <strong>Client Name:</strong> {task?.clientName}
                </li>
                <li>
                  <strong>System Name:</strong> {task?.systemName}
                </li>
                <li>
                  <strong>System Cycles:</strong> {task?.systemCycles}
                </li>
                <li>
                  <strong>Estimated Time:</strong> {task?.estimatedTime} days
                </li>
                <li>
                  <strong>Starting Time:</strong>{" "}
                  {new Date(task?.startTime * 1000).toUTCString()}
                </li>
                <li>
                  <strong>Cost (tokens):</strong> {task?.taskCost}
                </li>
                <li>
                  <strong>Repairman (engineer):</strong> {task?.repairman}
                </li>
                <li>
                  <strong>Quality Inspector (engineer):</strong>{" "}
                  {task?.qualityInspector}
                </li>
              </ul>
            </div>
          </div>
        );
      })}
    </>
  );
}
