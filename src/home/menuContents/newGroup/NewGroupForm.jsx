import "./NewGroupForm.css";
import { useState } from "react";
import JoinGroup from "./JoinGroup";
import CreateGroup from "./CreateGroup";
import { Plus, X, KeyRound } from "lucide-react";

function NewGroupForm({ handleOpenNewGroup }) {
  const [activeTab, setActiveTab] = useState("create");
  return (
    <div className="popup-overlay">
      <div className="new-group-popup">
        <div className="group-form-label">
          <p>New Group</p>
          <button className="close-form" onClick={handleOpenNewGroup}>
            <X />
          </button>
        </div>

        <div className="switch-new-buttons">
          <button
            className={`switch-to-creat ${activeTab === "create" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("create");
            }}
          >
            <Plus /> Create Group
          </button>
          <button
            className={`switch-to-join ${activeTab === "join" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("join");
            }}
          >
            <KeyRound /> Join Group
          </button>
        </div>

        <div className="form-container">
          {activeTab === "create" ? <CreateGroup /> : <JoinGroup />}
        </div>

        <div className="form-buttons">
          <button className="cancel-btn">Cancel</button>
          <button className="perform-group-btn">
            {activeTab === "create" ? "Create" : "Join"} Group
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewGroupForm;
