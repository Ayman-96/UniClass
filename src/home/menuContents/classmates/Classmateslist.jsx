import { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { NavLink } from "react-router-dom";
import { SlMagnifier } from "react-icons/sl";
import { FaUserSlash } from "react-icons/fa";
import { BiMessageSquareDots } from "react-icons/bi";
import { CircleCheckBig, CircleX } from "lucide-react";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";
import { useFriends, useRemoveFriend } from "../../../hooks/useFriends";

function ClassmatesList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const { data: friends } = useFriends();
  const { mutate: removeFriend } = useRemoveFriend();
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

  const friendsList = search
    ? friends?.filter(
        (data) =>
          data?.profile?.username
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          data?.profile?.full_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          data?.friendshipId?.includes(search.toLowerCase()),
      )
    : friends;

  return (
    <div className="cm-list-wrapper">
      <div className="cm-list-filtering">
        <div className="input-search-friends">
          <SlMagnifier />
          <input
            placeholder="Search for friends by full name, username, or ID"
            className="cm-search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className={`toggle-online-status ${status ? "stat-set" : ""}`}
          onClick={() => setStatus((prev) => !prev)}
        >
          <p> Online Only </p>{" "}
          <span> {status ? <PiToggleRightFill /> : <PiToggleLeftFill />}</span>
        </button>
      </div>

      <div className="cm-list-container">
        <div className="cm-friends-container">
          <div> All Classmates ({friends?.length})</div>
          <div className="friends-list">
            {friendsList
              ?.filter((data) =>
                status
                  ? getLastSeen(data.profile?.last_seen) === "Online"
                  : true,
              )
              .map((friend) => {
                return (
                  <div className="friend-card" key={friend.friendshipId}>
                    <div className="fr-left-grid">
                      <NavLink to={`/profile/${friend.profile?.id}`}>
                        <img src={friend.profile?.avatar_url} />
                      </NavLink>
                      <div>
                        <p>{friend.profile?.full_name}</p>
                        <p>
                          @
                          {friend.profile?.username
                            ?.trim()
                            .replace(/[\s\u00A0]+/g, "_")
                            .toLowerCase()}
                        </p>
                        <p>
                          {friend.profile?.department || "Not Set"} •{" "}
                          {friend.profile?.stage || "Not Student"}
                        </p>
                      </div>
                    </div>

                    <div className="fr-status-col">
                      <p
                        className={`${getLastSeen(friend.profile?.last_seen) === "Online" ? "user-online" : "user-offline"}`}
                      >
                        <span>
                          <GoDotFill />
                        </span>
                        {getLastSeen(friend.profile?.last_seen)}
                      </p>
                    </div>
                    <div className="fr-right-grid">
                      <div className="fr-card-interaction">
                        <button className="chat-friend">
                          {" "}
                          <BiMessageSquareDots />
                        </button>
                        {!isRemoving ? (
                          <button
                            className="remove-friend"
                            onClick={() => setIsRemoving(true)}
                          >
                            <FaUserSlash />
                          </button>
                        ) : (
                          <div className="sure-remove">
                            <button
                              title="Remove"
                              onClick={() => removeFriend(friend.profile?.id)}
                            >
                              <CircleCheckBig />
                            </button>
                            <button
                              title="Cancel"
                              onClick={() => setIsRemoving(false)}
                            >
                              <CircleX />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassmatesList;
