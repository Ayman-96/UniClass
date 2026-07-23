import "./classmates.css";
import { useState } from "react";
import AddFriend from "./AddFriends";
import SentRequests from "./SentRequests";
import ClassmatesList from "./Classmateslist";
import ReceivedRequests from "./ReceivedRequests";
import ClassmatesHeader from "./ClassmatesHeader";
import ClassmatesShortcuts from "./ClassmatesShortcuts";
import { useFriendRequests } from "../../../hooks/useFriends";
import AnimatedBackground from "../../../animated/AnimatedBackground";

function Classmates() {
  const [activeTab, setActiveTab] = useState(0);
  const [openAddCard, setOpenAddCard] = useState(false);

  const { received } = useFriendRequests();
  const { sent } = useFriendRequests();
  const pendingRequests = received?.data;
  const sentRequests = sent?.data;

  return (
    <AnimatedBackground>
      <div className="classmates-section">
        <div className="classmaates-main-page">
          <ClassmatesHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setOpenAddCard={setOpenAddCard}
            pendingRequests={pendingRequests}
            sentRequests={sentRequests}
          />
          {activeTab === 0 ? (
            <ClassmatesList />
          ) : activeTab === 1 ? (
            <ReceivedRequests pendingRequests={pendingRequests} />
          ) : (
            <SentRequests sentRequests={sentRequests} />
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
    </AnimatedBackground>
  );
}

export default Classmates;
