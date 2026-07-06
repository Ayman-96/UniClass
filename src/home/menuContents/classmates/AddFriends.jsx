import "./classmates.css";
import { X } from "lucide-react";
import { useState } from "react";
import {
  useFriendshipStatuses,
  useRespondFriendRequest,
  useSendFriendRequest,
} from "../../../hooks/useFriends";
import { HiUserPlus } from "react-icons/hi2";
import { FaPeopleRobbery } from "react-icons/fa6";
import { LiaHourglassHalfSolid } from "react-icons/lia";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { useSearchProfiles } from "../../../hooks/useSaveProfile";

function AddFriend({ setOpenAddCard }) {
  const [search, setSearch] = useState("");

  const { data: searchResult } = useSearchProfiles(search);
  const { data: friendStatus } = useFriendshipStatuses(resultIDs);
  const { mutate: respond } = useRespondFriendRequest();
  const { mutate: sendRequest } = useSendFriendRequest();

  const resultIDs = searchResult?.map((g) => g.id) ?? [];

  return (
    <div className="add-friend-container">
      <div className="add-header">
        <div>
          <p>Add Friends</p>
          <p>Find your friends and grow your communication with UniClass</p>
        </div>
        <button onClick={() => setOpenAddCard(false)}>
          <X />
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by fullname, username, or ID"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="serach-result">
        <p>Search Results</p>
        {searchResult?.map((res) => {
          const status = friendStatus?.[res?.id] || "";
          console.log(status);
          return (
            <div className="perople-card" key={res?.id}>
              <div className="people-left-grid">
                <img src={res?.avatar_url || ""} />
                <div>
                  <p>{res.full_name}</p>
                  <p>
                    @
                    {res.username
                      ?.trim()
                      .replace(/[\s\u00A0]+/g, "_")
                      .toLowerCase()}
                  </p>
                </div>
                <p>
                  {res.department || "Not Set"} • {res.stage || "Not Student"}
                </p>
              </div>
              <div className="people-right-grid">
                {status.isRequester ? (
                  <div className="friend-status request">
                    <LiaHourglassHalfSolid /> <span>Pending</span>{" "}
                  </div>
                ) : status.status === "accepted" ? (
                  <p className="friend-status friend">
                    <FaPeopleRobbery />
                    <span> Friend</span>
                  </p>
                ) : status.status === "pending" ? (
                  <p className="friend-status pending">
                    <button
                      onClick={() =>
                        respond({
                          requestId: status.friendshipId,
                          status: "accepted",
                        })
                      }
                    >
                      <FaUserCheck /> Accept
                    </button>
                    <button
                      onClick={() =>
                        respond({
                          requestId: status.friendshipId,
                          status: "declined",
                        })
                      }
                    >
                      <FaUserTimes /> Refuse
                    </button>
                  </p>
                ) : (
                  <button
                    className="friend-status add"
                    onClick={() => sendRequest(res.id)}
                  >
                    <HiUserPlus />
                    <span>Add Friend</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default AddFriend;
