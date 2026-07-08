import { GoDotFill } from "react-icons/go";
import { useEffect, useState } from "react";
import {
  usePromoteToMod,
  useRemoveAsRep,
  useRemoveSelfAsRep,
} from "../../../../../hooks/useGroupMembers";
import { RiShieldStarFill } from "react-icons/ri";
import { LuShieldOff, LuShieldX } from "react-icons/lu";
import { useIsModerator, useIsRep } from "../../../../../hooks/useIsRep";
import { BadgeInfo, ChevronLeft, Crown, EllipsisVertical } from "lucide-react";
import { NavLink } from "react-router-dom";

function RepsList({ groupData, countRep, user, reps }) {
  const groupId = groupData?.id;
  const [repInteract, setRepInteract] = useState("");

  const { data: amIRep } = useIsRep(groupId);
  const { data: amIMod } = useIsModerator(groupId);
  const { mutate: removeRep } = useRemoveAsRep(groupId);
  const { mutate: promoteToMod } = usePromoteToMod(groupId);
  const { mutate: demoteSelfAsRep } = useRemoveSelfAsRep(groupId);

  const getLastSeen = (lastSeen) => {
    if (!lastSeen) return "Long Time";

    // eslint-disable-next-line react-hooks/purity
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
        setRepInteract("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="reps-list-card">
      <div className="reps-list-header">
        Reps ({countRep})
        <div className="rep-alert-wrapper">
          <BadgeInfo style={{ color: groupData?.color }} />
          <span className="rep-tooltip">
            {" "}
            Representatives help manage the group and assist the moderator.{" "}
          </span>
        </div>
      </div>
      <div className="rep-list">
        {reps?.map((rep) => {
          const repId = rep?.user_id;
          const actionsToRep = [
            {
              label: "Remove as Rep ",
              icon: <LuShieldX size={18} />,
              onClick: () => removeRep(repId),
              modOnly: true,
            },
            {
              label: "Promote to Mod ",
              icon: <Crown size={18} />,
              onClick: () =>
                promoteToMod({ currentModId: user?.id, newModId: repId }),
              modOnly: true,
            },
            {
              label: "remove self as Rep ",
              icon: <LuShieldOff />,
              onClsick: () => demoteSelfAsRep(),
              repOnly: true,
            },
          ];
          return (
            <div className="member-card" key={repId}>
              <NavLink
                className="user-avatar-card"
                to={`/profile/${rep?.user_id}`}
              >
                <img src={rep.profiles.avatar_url} alt="user-avatar" />
              </NavLink>

              <div className="member-name">
                <p className={`${rep.is_moderator ? "mod-name" : ""}`}>
                  {rep.profiles.username}
                </p>
                <p
                  className={`${getLastSeen(rep.profiles.last_seen) === "Online" ? "user-online" : "user-offline"}`}
                >
                  <span>
                    <GoDotFill />
                  </span>{" "}
                  {getLastSeen(rep.profiles.last_seen)}
                </p>
              </div>

              <div className="rep-list-interactions">
                <div
                  className={`rep-role-card ${rep.is_moderator ? "moderator" : "representative"}`}
                >
                  {rep.is_moderator ? (
                    <Crown size={20} />
                  ) : (
                    <RiShieldStarFill size={20} />
                  )}
                </div>
                {amIRep && (
                  <div
                    className="user-interaction-card"
                    onClick={() => {
                      if (amIMod && user.id === repId) return;
                      setRepInteract(rep.user_id);
                    }}
                  >
                    <EllipsisVertical />
                  </div>
                )}
              </div>

              {repId === repInteract && (
                <div className="interaction-list">
                  {actionsToRep.map((btn) => {
                    if (btn.modOnly && !amIMod) return null;
                    if (btn.repOnly) return null;
                    return (
                      <button
                        key={btn.label}
                        onClick={() => {
                          btn.onClick();
                          setRepInteract("");
                        }}
                      >
                        {btn.label} {btn.icon}
                      </button>
                    );
                  })}
                  <div
                    className="interaction-close"
                    onClick={() => setRepInteract("")}
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

export default RepsList;
