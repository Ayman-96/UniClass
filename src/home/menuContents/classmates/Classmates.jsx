import "./classmates.css";
import { useEffect, useState } from "react";
import AddFriend from "./AddFriends";
import SentRequests from "./SentRequests";
import ClassmatesList from "./Classmateslist";
import ReceivedRequests from "./ReceivedRequests";
import ClassmatesHeader from "./ClassmatesHeader";
import ClassmatesShortcuts from "./ClassmatesShortcuts";
import { useFriendRequests } from "../../../hooks/useFriends";
import AnimatedBackground from "../../../animated/AnimatedBackground";
import defaultAvatar from "../../../assets/default-avatar.svg";

function Classmates() {
  const [activeTab, setActiveTab] = useState(0);
  const [openAddCard, setOpenAddCard] = useState(false);
  const [isOnMobile, setIsOnMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsOnMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            <ClassmatesList defaultAvatar={defaultAvatar} />
          ) : activeTab === 1 ? (
            <ReceivedRequests
              pendingRequests={pendingRequests}
              defaultAvatar={defaultAvatar}
            />
          ) : (
            <SentRequests
              sentRequests={sentRequests}
              defaultAvatar={defaultAvatar}
            />
          )}
        </div>

        {(!isOnMobile || activeTab === 0) && (
          <div className="classmates-side-card">
            <ClassmatesShortcuts
              setActiveTab={setActiveTab}
              defaultAvatar={defaultAvatar}
            />
          </div>
        )}

        {openAddCard ? (
          <div className="add-friend-mockup">
            <AddFriend
              setOpenAddCard={setOpenAddCard}
              defaultAvatar={defaultAvatar}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </AnimatedBackground>
  );
}

export default Classmates;
