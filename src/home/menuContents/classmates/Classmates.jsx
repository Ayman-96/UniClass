import "./classmates.css";
import { useState } from "react";
import AddFriend from "./AddFriends";
import SentRequests from "./SentRequests";
import ClassmatesList from "./Classmateslist";
import ReceivedRequests from "./ReceivedRequests";
import ClassmatesHeader from "./ClassmatesHeader";
import ClassmatesShortcuts from "./ClassmatesShortcuts";

function Classmates() {
  const [activeTab, setActiveTab] = useState(0);
  const [openAddCard, setOpenAddCard] = useState(false);
  return (
    <div className="classmates-section">
      <div className="classmaates-main-page">
        <ClassmatesHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setOpenAddCard={setOpenAddCard}
        />
        {activeTab === 0 ? (
          <ClassmatesList />
        ) : activeTab === 1 ? (
          <ReceivedRequests />
        ) : (
          <SentRequests />
        )}
      </div>
      <div className="classmates-side-card">
        <ClassmatesShortcuts setActiveTab={setActiveTab} />
      </div>

      {openAddCard ? (
        <div className="add-friend-mockup">
          <AddFriend setOpenAddCard={setOpenAddCard} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Classmates;
