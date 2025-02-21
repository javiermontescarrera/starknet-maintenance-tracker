import { Dispatch, SetStateAction } from "react";
// import { MyHoldings } from "../SimpleNFT/MyHoldings";
import { AdminPanel } from "../admin/AdminPanel";

export const MaintenanceExplorer = ({
  setStatus,
}: {
  setStatus: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <>
      <div className="wrapper mb-14">
        <h4 className="text-3xl font-bold text-center">
          Maintenance Task Explorer
        </h4>
        {/* <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter client name..."
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button">
              Search
            </button>
          </div>
        </div> */}
        <AdminPanel />
        {/* <MyHoldings setStatus={setStatus} /> */}
      </div>
    </>
  );
};
