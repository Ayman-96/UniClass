import { NavLink } from "react-router-dom";
import {
  useCancelFriendRequest,
  useFriendRequests,
} from "../../../hooks/useFriends";
import { GoDotFill } from "react-icons/go";
import { TbSendOff } from "react-icons/tb";
import { formatDistanceToNow } from "date-fns";

function SentRequests() {
  const { sent } = useFriendRequests();
  const sentRequests = sent?.data;

  const { mutate: cancelRequest } = useCancelFriendRequest();

  return (
    <div className="cm-list-container">
      <div className="cm-friends-container">
        <div> Sent Requests ({sentRequests?.length})</div>
        <div className="friends-list">
          {sentRequests?.map((pending) => {
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
                    <button onClick={() => cancelRequest(pending.id)}>
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
