import { FaUserFriends } from "react-icons/fa";
import { BsPersonWalking } from "react-icons/bs";
import { MdOutlineEmojiPeople, MdPersonSearch } from "react-icons/md";

function ClassmatesHeader({
  activeTab,
  setActiveTab,
  setOpenAddCard,
  pendingRequests,
  sentRequests,
}) {
  const cmTabs = [
    {
      id: 0,
      label: "My Classmates",
      icon: <FaUserFriends size={26} />,
    },
    {
      id: 1,
      label: "Received Requests",
      icon: <MdOutlineEmojiPeople size={26} />,
      warning: pendingRequests?.length > 0,
      color: "rgb(178, 17, 103)",
    },
    {
      id: 2,
      label: "Sent Requests",
      icon: <BsPersonWalking size={24} />,
      warning: sentRequests?.length > 0,
      color: "rgb(234, 176, 29)",
    },
  ];
  return (
    <div className="cm-header-container">
      <div className="cm-title">
        <div className="cm-row1">
          <div>Classmates</div>
          <div>
            <p>
              Connect with your friends, Manage requests and build your network
            </p>
            <button onClick={() => setOpenAddCard(true)}>
              <MdPersonSearch /> Add Friends
            </button>
          </div>
        </div>

        <div className="cm-row2">
          {cmTabs.map((tab) => {
            return (
              <button
                key={tab.id}
                className={`cm-tabs ${tab.id === activeTab ? "selected-tab" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}{" "}
                {tab.warning && (
                  <div className="warning-friend" style={{ color: tab.color }}>
                    •
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ClassmatesHeader;
