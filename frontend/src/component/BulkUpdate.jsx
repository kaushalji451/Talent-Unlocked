import React from "react";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useState } from "react";
const BulkUpdate = ({ ids, setIds, refreshCallback }) => {
  const [status, setStatus] = useState("");

  const handleBulkUpdate = (e, close) => {
    e.preventDefault();
    if (ids.length === 0) {
      alert("Please select candidates to update");
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/candidates/bulk-update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids, status }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Bulk update response:", data);
        alert("Bulk update successful");
        close();
        refreshCallback();
        setIds([]);
      })
      .catch((error) => {
        console.error("Error in bulk update:", error);
        alert("Bulk update failed");
      });
  };
  return (
    <div>
      <Popup
        trigger={
          <button className=" border border-slate-300 rounded-md px-4 py-1">
            Bulk Update
          </button>
        }
        modal
        nested
      >
        {(close) => (
          <div>
            <p className="text-2xl text-center">Bulk Update status</p>
            <form
              className="flex flex-col items-center gap-4"
              onSubmit={(e) => handleBulkUpdate(e, close)}
            >
              <div className="flex flex-col w-2/3 gap-1">
                <label htmlFor="status">status</label>
                <select
                  name="status"
                  id="status"
                  className="border w-full border-slate-300 rounded-md ps-4 py-1"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select Candidate status</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                  <option value="In Review">In Review</option>
                  <option value="New">New</option>
                </select>
              </div>

              <button className="border border-slate-200 text-white bg-blue-400 px-2 py-1 rounded-md">
                submit
              </button>
            </form>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default BulkUpdate;
