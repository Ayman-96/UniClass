import { UsersRound } from "lucide-react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdOutlineEmojiPeople } from "react-icons/md";
import { BsPersonWalking } from "react-icons/bs";
function ClassmatesHeader({ activeTab, setActiveTab }) {
  const cmTabs = [
    {
      id: 0,
      label: "My Classmates",
      icon: <UsersRound />,
    },
    {
      id: 1,
      label: "Received Requests",
      icon: <MdOutlineEmojiPeople />,
    },
    {
      id: 2,
      label: "Sent Requests",
      icon: <BsPersonWalking />,
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
            <button>
              <AiOutlineUsergroupAdd /> Add Friends
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
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ClassmatesHeader;
