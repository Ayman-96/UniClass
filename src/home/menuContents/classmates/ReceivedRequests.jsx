import { NavLink } from "react-router-dom";
import { useFriendRequests } from "../../../hooks/useFriends";
import { GoDotFill } from "react-icons/go";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

function ReceivedRequests() {
  const { received } = useFriendRequests();
  const pendingRequests = received?.data;

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
        <div> Received Requests ({pendingRequests?.length})</div>
        <div className="friends-list">
          {pendingRequests.map((pending) => {
            console.log(pending);
            return (
              <div className="friend-card" key={pending.requester?.id}>
                <div className="fr-left-grid">
                  <NavLink to={`/profile/${pending.requester?.id}`}>
                    <img src={pending.requester?.avatar_url} />
                  </NavLink>
                  <div>
                    <p>{pending.requester?.full_name}</p>
                    <p>
                      @
                      {pending.requester?.username
                        ?.trim()
                        .replace(/[\s\u00A0]+/g, "_")
                        .toLowerCase()}
                    </p>
                    <p>
                      {pending.requester?.department || "Not Set"} •{" "}
                      {pending.requester?.stage || "Not Student"}
                    </p>
                  </div>
                </div>

                <div className="received-requested-status">
                  <span>
                    <GoDotFill />
                  </span>{" "}
                  Requested{" "}
                  {formatDistanceToNow(new Date(pending.created_at), {
                    addSuffix: true,
                  })}
                </div>
                <div className="received-fr-right-grid">
                  <div className="received-received-right-grid">
                    <button>
                      <FaUserCheck /> Accept
                    </button>
                    <button>
                      <FaUserTimes /> Refuse
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
export default ReceivedRequests;
