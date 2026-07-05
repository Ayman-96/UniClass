import { NavLink } from "react-router-dom";
import {
  useFriendRequests,
  useRespondFriendRequest,
} from "../../../hooks/useFriends";
import { GoDotFill } from "react-icons/go";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

function ReceivedRequests() {
  const { received } = useFriendRequests();
  const pendingRequests = received?.data;

  const { mutate: respond } = useRespondFriendRequest();
  return (
    <div className="cm-list-container">
      <div className="cm-friends-container">
        <div> Received Requests ({pendingRequests?.length})</div>
        <div className="friends-list">
          {pendingRequests.map((pending) => {
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
                    <button
                      onClick={() =>
                        respond({ requestId: pending.id, status: "accepted" })
                      }
                    >
                      <FaUserCheck /> Accept
                    </button>
                    <button
                      onClick={() =>
                        respond({ requestId: pending.id, status: "declined" })
                      }
                    >
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
