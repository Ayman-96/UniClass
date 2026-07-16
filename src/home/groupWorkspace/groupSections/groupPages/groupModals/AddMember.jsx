import { useParams } from "react-router-dom";
import {
  useGroupMembers,
  useSendGroupInvites,
} from "../../../../../hooks/useGroupMembers";
import "./AddMember.css";
import { Send, UserPlus2, UserRoundSearch, X } from "lucide-react";
import { useState } from "react";
import { useFriends } from "../../../../../hooks/useFriends";
import { GoDotFill } from "react-icons/go";
import {
  BsPersonFillAdd,
  BsPersonFillCheck,
  BsPersonFillUp,
  BsPersonFillX,
} from "react-icons/bs";

function AddMember({ handleMemberModal }) {
  const { groupId } = useParams();
  const [search, setSearch] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const selectedIds = selectedFriends?.map((f) => f.profile?.id);
  const { data: groupMembers = [] } = useGroupMembers(groupId);
  const memberIds = new Set(groupMembers?.map((member) => member.user_id));
  const { data: friends } = useFriends();
  const sendInvites = useSendGroupInvites();

  const friendsList = search
    ? friends?.filter((data) =>
        data?.profile?.username?.toLowerCase().includes(search.toLowerCase()),
      )
    : friends;

  const getLastSeen = (lastSeen) => {
    if (!lastSeen) return "Long Time";

    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - new Date(lastSeen).getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 5) return "Online";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };
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
              <input
                type="text"
                placeholder="Search Classmates..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div
              className={`${selectedFriends.length ? " selected-friends" : ""}`}
            >
              {selectedFriends?.map((selected) => {
                return (
                  <div
                    className="selected-to-invite"
                    key={selected.friendshipId}
                  >
                    <BsPersonFillUp size={20} />
                    {selected.profile?.username}{" "}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="friends-list">
            <label htmlFor="classmates">Friends</label>
            {friendsList?.map((friend) => {
              return (
                <div className="friend-card" key={friend.friendshipId}>
                  <div className="fr-left-grid">
                    <img src={friend.profile?.avatar_url} />
                    <div>
                      <p>{friend.profile?.full_name}</p>
                      <p>
                        @
                        {friend.profile?.username
                          ?.trim()
                          .replace(/[\s\u00A0]+/g, "_")
                          .toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="fr-status-col">
                    <p
                      className={`${getLastSeen(friend.profile?.last_seen) === "Online" ? "user-onlinee" : "user-offlinee"}`}
                    >
                      <span>
                        <GoDotFill />
                      </span>
                      {getLastSeen(friend.profile?.last_seen)}
                    </p>
                  </div>
                  <div className="fr-right-grid">
                    {memberIds.has(friend.profile?.id) ? (
                      <div className="already-member">
                        Already Member
                        <span>
                          <BsPersonFillCheck size={22} />
                        </span>
                      </div>
                    ) : !selectedFriends.includes(friend) ? (
                      <button
                        className="select-invite"
                        type="button"
                        onClick={() => {
                          setSelectedFriends((prev) => [...prev, friend]);
                        }}
                      >
                        Select{" "}
                        <span>
                          <BsPersonFillAdd size={22} />
                        </span>
                      </button>
                    ) : (
                      <button
                        className="unselect-invite"
                        type="button"
                        onClick={() => {
                          setSelectedFriends((prev) =>
                            prev.filter(
                              (g) => g.friendshipId !== friend.friendshipId,
                            ),
                          );
                        }}
                      >
                        Unselect <BsPersonFillX size={22} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="member-footer">
          <div className="count-selected">
            {selectedFriends.length} Selected
          </div>
          <div className="buttons">
            <button onClick={handleMemberModal} className="cancel-invite-btn">
              Cancel
            </button>
            <button
              className="send-invite-btn"
              onClick={() => {
                sendInvites.mutate({ groupId, recipientIds: selectedIds });
                handleMemberModal(false);
              }}
            >
              <Send size={18} />
              Send Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddMember;
