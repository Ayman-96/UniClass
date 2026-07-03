import { NavLink } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { FaUserTimes } from "react-icons/fa";
import {
  usePromoteToRep,
  useRemoveMember,
} from "../../../../../hooks/useGroupMembers";
import { RiShieldStarFill } from "react-icons/ri";
import { IoAccessibilityOutline, IoPeople } from "react-icons/io5";
import { ChevronLeft, Crown, EllipsisVertical, User } from "lucide-react";
import { useIsModerator, useIsRep } from "../../../../../hooks/useIsRep";

function MembersList({ groupData, groupMembers, user }) {
  const [search, setSearch] = useState("");
  const [memberInteract, setMemberInteract] = useState("");

  const { data: amIRep } = useIsRep(groupData?.id);
  const { data: amIMod } = useIsModerator(groupData?.id);
  const { mutate: removeMember } = useRemoveMember(groupData?.id);
  const { mutate: promoteToRep } = usePromoteToRep(groupData?.id);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".interaction-list") &&
        !e.target.closest(".user-interaction-card")
      ) {
        setMemberInteract("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const membersList = search
    ? groupMembers.filter((data) => data?.profiles.username.includes(search))
    : groupMembers;
  return (
    <div className="members-container">
      <div className="members-list-header">
        <div>Members ({groupData?.group_members[0].count})</div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members..."
        />
      </div>

      <div className="members-list">
        {membersList?.map((member) => {
          const memberId = member?.user_id;
          const interactions = [
            {
              label: "Remove From Group ",
              icon: <FaUserTimes />,
              onClick: () => removeMember(memberId),
              repOnly: true,
            },
            {
              label: "Add as Friend ",
              icon: <IoPeople />,
              onClick: "",
            },
            {
              label: "Promote to Rep ",
              icon: <RiShieldStarFill />,
              onClick: () => promoteToRep(memberId),
              modOnly: true,
            },
          ];
          return (
            <div className="member-card" key={memberId}>
              <NavLink to={`/profile/${memberId}`} className="user-avatar-card">
                <img src={member.profiles.avatar_url} alt="user-avatar" />
              </NavLink>

              <div className="member-name">
                <div className="name-you-row">
                  <p>{member.profiles.username}</p>
                  {memberId === user?.id && (
                    <div className="user-you">
                      You <IoAccessibilityOutline />
                    </div>
                  )}
                </div>
                <p
                  className={`${getLastSeen(member.profiles.last_seen) === "Online" ? "user-online" : "user-offline"}`}
                >
                  <span>
                    <GoDotFill />
                  </span>{" "}
                  {getLastSeen(member.profiles.last_seen)}
                </p>
              </div>

              <div className="rep-list-interactions">
                <div
                  className={`user-role-card ${member.is_moderator ? "moderator" : "representative"}`}
                >
                  {member.is_moderator ? (
                    <Crown />
                  ) : member.role === "rep" ? (
                    <RiShieldStarFill />
                  ) : (
                    <User />
                  )}
                  {member.is_moderator ? "Moderator" : member.role}
                </div>

                {memberId !== user.id && (
                  <div
                    className="user-interaction-card"
                    onClick={() => setMemberInteract(memberId)}
                  >
                    <EllipsisVertical />
                  </div>
                )}
              </div>

              {member.user_id === memberInteract && (
                <div className="interaction-list">
                  {interactions.map((btn) => {
                    if (btn.repOnly && !amIRep) return null;
                    if (btn.modOnly && !amIMod) return null;
                    if (btn.modOnly && member.role === "rep") return null;
                    return (
                      <button
                        key={btn.label}
                        onClick={() => {
                          btn.onClick();
                          setMemberInteract("");
                        }}
                      >
                        {btn.label}
                        {btn.icon}
                      </button>
                    );
                  })}
                  <div
                    className="interaction-close"
                    onClick={() => setMemberInteract("")}
                  >
                    <ChevronLeft />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MembersList;
