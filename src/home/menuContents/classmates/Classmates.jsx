import "./classmates.css";
import ClassmatesList from "./Classmateslist";
import ClassmatesHeader from "./ClassmatesHeader";
import ClassmatesShortcuts from "./ClassmatesShortcuts";
import { useState } from "react";
import ReceivedRequests from "./ReceivedRequests";
import SentRequests from "./SentRequests";
function Classmates() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="classmates-section">
      <div className="classmaates-main-page">
        <ClassmatesHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 0 ? (
          <ClassmatesList />
        ) : activeTab === 1 ? (
          <ReceivedRequests />
        ) : (
          <SentRequests />
        )}
      </div>
      <div className="classmates-side-card">
        <ClassmatesShortcuts />
      </div>
    </div>
  );
}

export default Classmates;
