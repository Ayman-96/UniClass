import { NavLink } from "react-router-dom";
import { useFriendRequests } from "../../../hooks/useFriends";
import { GoDotFill } from "react-icons/go";
import { TbSendOff } from "react-icons/tb";
import { formatDistanceToNow } from "date-fns";

function SentRequests() {
  const { sent } = useFriendRequests();
  const sentRequests = sent?.data;

  const getLastSeen = (lastSeen) => {
    if (!lastSeen) return "Long Time";

    const diff = Date.now() - new Date(lastSeen).getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 5) return "Online";
    if (minutes < 60) return `Last seen ${minutes}m ago`;
    if (hours < 24) return `Last seen ${hours}h ago`;
    return `Last seen ${days}d ago`;
  };

  return (
    <div className="cm-list-container">
      <div className="cm-friends-container">
        <div> Sent Requests ({sentRequests?.length})</div>
        <div className="friends-list">
          {sentRequests?.map((pending) => {
            console.log(pending);
            return (
              <div className="friend-card" key={pending.addressee?.id}>
                <div className="fr-left-grid">
                  <NavLink to={`/profile/${pending.addressee?.id}`}>
                    <img src={pending.addressee?.avatar_url} />
                  </NavLink>
                  <div>
                    <p>{pending.addressee?.full_name}</p>
                    <p>
                      @
                      {pending.addressee?.username
                        ?.trim()
                        .replace(/[\s\u00A0]+/g, "_")
                        .toLowerCase()}
                    </p>
                    <p>
                      {pending.addressee?.department || "Not Set"} •{" "}
                      {pending.addressee?.stage || "Not Student"}
                    </p>
                  </div>
                </div>

                <div className="sent-requested-status">
                  <span>
                    <GoDotFill />
                  </span>{" "}
                  Requested{" "}
                  {formatDistanceToNow(new Date(pending.created_at), {
                    addSuffix: true,
                  })}
                </div>
                <div className="sent-fr-right-grid">
                  <div className="sent-received-right-grid">
                    <button>
                      <TbSendOff />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default SentRequests;
