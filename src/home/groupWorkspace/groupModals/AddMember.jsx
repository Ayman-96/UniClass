import "./AddMember.css";
import { Send, UserPlus2, UserRoundSearch, X } from "lucide-react";

function AddMember({ handleMemberModal }) {
  return (
    <div className="add-member-overlay">
      <div className="add-member-modal">
        <div className="member-modal-header">
          <div className="modal-header-title">
            <UserPlus2 size={20} /> <span>Invite Friends</span>
          </div>
          <button className="close-modal" onClick={handleMemberModal}>
            <X size={20} />
          </button>
        </div>

        <div className="member-modal-body">
          <div className="search-select-friend">
            <div className="search-friend">
              <UserRoundSearch size={20} />
              <input type="text" placeholder="Search Classmates..." />
            </div>
            <div className="selected-friends">
              laterFeature <button>X</button>
            </div>
          </div>

          <div className="friends-list">
            <label htmlFor="classmates">CLASSMATES</label>
            <div className="friend-card">
              <div className="friend-pro-pic">MN</div>
              <div className="friend-name">
                <p>His/Her Name</p>
                <p>
                  Dep Name • <span>Badge</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="member-footer">
          <div className="count-selected">0 Selected</div>
          <div className="buttons">
            <button onClick={handleMemberModal} className="cancel-invite-btn">
              Cancel
            </button>
            <button className="send-invite-btn">
              <Send />
              Send Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddMember;
