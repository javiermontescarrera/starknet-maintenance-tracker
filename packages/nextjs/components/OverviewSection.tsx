import Image from "next/image";

export function OverviewSection() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-4xl font-bold text-blue-200 mb-0">
          Maintenance Tracker Platform
        </h2>
        <h3 className="text-xl text-rose-300">
          Maintenance operations On-Chain with{" "}
          <span className="text-2xl text-weight-bold">Starknet!</span>
        </h3>
      </div>
      <div className="hidden md:block mb-8">
        <div className="grid-cols-3 grid gap-4 mr-20">
          <div className="col-span-1 col-md-4">
            <div className="img-logo">
              <Image
                alt="img"
                className="object-contain m-5"
                style={{ width: "91%", height: "91%" }}
                width={100}
                height={100}
                src="https://ipfs.io/ipfs/bafybeifj3wz462zils26mztyepwfzhxlxe557k3sptm3yfcplorw7xlpoi"
              />
            </div>
          </div>
          <div className="col-span-2">
            <p className="">
              Welcome to MaintenanceTracker, your gateway to a cutting-edge
              decentralized solution for managing and certifying maintenance
              tasks. Leveraging blockchain technology, MaintenanceTracker
              ensures transparency, security, and efficiency throughout the
              entire maintenance lifecycle.
            </p>
            <div className="row mt-4 mb-4">
              <div className="col-md-4 text-left">Contract info:</div>
              <div className="col-md-8">
                <div>
                  <strong>Maintenance Factory CT address:</strong> 0X123...7A6
                </div>
              </div>
            </div>
            <div className="border-2 rounded-lg border-rose-300 p-2">
              <h5 className="h5">Key features</h5>
              <ul className="p-2">
                <li>
                  <strong>Intelligent Task Management:</strong>
                  <ul>
                    <li>
                      Effortlessly initiate, monitor, and manage maintenance
                      tasks in real-time.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Certification Beyond Doubt:</strong>
                  <ul>
                    <li>
                      Certify completed tasks with absolute certainty using
                      blockchain technology.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Tokenized Efficiency:</strong>
                  <ul>
                    <li>
                      Experience the efficiency of tokenized transactions with
                      ETH or USDT.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Exclusive NFT Certificates:</strong>
                  <ul>
                    <li>
                      Receive exclusive NFT certificates for each completed
                      task.
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
