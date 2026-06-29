import "./MembersCard.css";
import { toast } from "sonner";
import { NavLink, useParams } from "react-router-dom";
import {
  useGroupMembers,
  usePromoteToMod,
  usePromoteToRep,
  useRemoveAsRep,
  useRemoveMember,
  useRemoveSelfAsRep,
} from "../../../../../hooks/useGroupMembers";
import { HiUserGroup } from "react-icons/hi";
import {
  ActivityIcon,
  BadgeInfo,
  Calendar,
  CalendarDays,
  ChevronLeft,
  Crown,
  EllipsisVertical,
  Link,
  ShieldUser,
  User,
} from "lucide-react";
import { FaRegCopy, FaUserTimes } from "react-icons/fa";
import { RiShieldStarFill } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { LuCopyCheck, LuShieldOff, LuShieldX } from "react-icons/lu";
import { IoAccessibilityOutline, IoPeople } from "react-icons/io5";
import { useAuth } from "../../../../../AuthContext";
import { useGroups } from "../../../../../hooks/useGroups";
import { useIsModerator, useIsRep } from "../../../../../hooks/useIsRep";
import { GoDotFill } from "react-icons/go";
import InvitationCrad from "./InvitationCard";

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
function MembersCard() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { data: groupData } = useGroups();
  const { data: groupMembers } = useGroupMembers(groupId);
  const group = groupData?.find((curr) => curr.id === groupId);
  const reps = groupMembers?.filter((member) => member.role === "rep");
  const countRep = groupMembers?.reduce((acc, member) => {
    if (member.role === "rep") {
      return acc + 1;
    }
    return acc;
  }, 0);

  console.log(group);
  return (
    <div className="group-members-overlay">
      <div className="gp-mmb-header">
        <GroupMembersHeader groupData={group} countRep={countRep} />
      </div>
      <div className="gp-mmb-body">
        <div className="body-left">
          <MembersList
            groupData={group}
            groupMembers={groupMembers}
            user={user}
          />
        </div>
        <div className="body-right">
          <RepsList
            groupData={group}
            countRep={countRep}
            user={user}
            reps={reps}
          />
          <GroupActivity groupMembers={groupMembers} />
        </div>
      </div>
    </div>
  );
}
function GroupMembersHeader({ groupData, countRep }) {
  const [isHovered, setIsHovered] = useState(false);
  const [openInvitation, setOpenInvitation] = useState(false);
  const [copied, setCopied] = useState(false);
  // const { data: amIRep } = useIsRep(groupData?.id);
  function handleCopy() {
    navigator.clipboard.writeText(groupData?.group_code).then(() => {
      setCopied(true);
      toast.success("Copied to Clipboard !");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const countData = [
    {
      label: "Members",
      icon: <HiUserGroup />,
      count: groupData?.group_members[0]?.count,
    },
    {
      label: "Representatives",
      icon: <ShieldUser />,
      count: countRep,
    },
    {
      label: "Created",
      icon: <CalendarDays />,
      count: new Date(groupData?.created_at).toLocaleDateString(),
    },
  ];
  return (
    <div className="gp-members-header">
      <div className="header-left-col">
        <img
          src={groupData?.avatar}
          style={{ border: `3px solid ${groupData?.color}` }}
        />
      </div>

      <div className="header-mid-col">
        <div className="group-title">
          <p>
            {groupData?.name} {groupData?.icon}
          </p>
          <p>By : {groupData?.rep_name}</p>
        </div>
        <div className="group-count-members">
          {countData?.map((data) => {
            return (
              <div className="group-data-count" key={data.label}>
                <div>
                  {React.cloneElement(data?.icon, { color: groupData?.color })}
                </div>
                <div>
                  <p>{data?.count}</p>
                  <p>{data?.label}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="group-description">{groupData?.description}</div>
      </div>
      <div className="header-right-col">
        <p>Join Code</p>
        <div
          className="code-copy"
          style={{
            border: `2px dashed ${groupData?.color}`,
          }}
        >
          <p>{groupData?.group_code}</p>
          <button onClick={handleCopy} style={{ color: groupData?.color }}>
            {copied ? <LuCopyCheck /> : <FaRegCopy />}
          </button>
        </div>
        <p> Share this code with others to invite them</p>
        <button
          onClick={() => setOpenInvitation(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: isHovered ? "transparent" : groupData?.color,
            border: `1px solid ${groupData?.color}`,
            color: isHovered ? groupData?.color : "white", // optional
            transition: "background 0.2s, color 0.2s",
          }}
        >
          <Link /> Invite Link
        </button>
      </div>

      {openInvitation && (
        <div className="invitation-overlay">
          <InvitationCrad
            setCloseInvitation={setOpenInvitation}
            groupData={groupData}
          />
        </div>
      )}
    </div>
  );
}
function MembersList({ groupData, groupMembers, user }) {
  const [memberInteract, setMemberInteract] = useState("");
  const { data: amIRep } = useIsRep(groupData?.id);
  const { data: amIMod } = useIsModerator(groupData?.id);
  const { mutate: removeMember } = useRemoveMember(groupData?.id);
  const { mutate: promoteToRep } = usePromoteToRep(groupData?.id);
  const [search, setSearch] = useState("");
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
                  {memberId === user.id && (
                    <div
                      className="user-you"
                      style={{
                        color: `${groupData?.color}`,
                        border: `1px solid ${groupData?.color}`,
                      }}
                    >
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

function RepsList({ groupData, countRep, user, reps }) {
  const groupId = groupData?.id;
  const [repInteract, setRepInteract] = useState("");
  const { data: amIRep } = useIsRep(groupId);
  const { data: amIMod } = useIsModerator(groupId);
  const { mutate: removeRep } = useRemoveAsRep(groupId);
  const { mutate: promoteToMod } = usePromoteToMod(groupId);
  const { mutate: demoteSelfAsRep } = useRemoveSelfAsRep(groupId);
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
              icon: <LuShieldX />,
              onClick: () => removeRep(repId),
              modOnly: true,
            },
            {
              label: "Promote to Mod ",
              icon: <Crown />,
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
              <div className="user-avatar-card">
                <img src={rep.profiles.avatar_url} alt="user-avatar" />
              </div>

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
function GroupActivity({ groupMembers }) {
  const isMod = groupMembers?.filter(
    (rep) => rep.role === "rep" && rep.is_moderator,
  );

  return (
    <div className="group-activity">
      <div>
        <ActivityIcon /> Activity
      </div>

      <div className="activity-card">
        <Calendar /> Group Created By {isMod?.username}
      </div>
    </div>
  );
}
export default MembersCard;
