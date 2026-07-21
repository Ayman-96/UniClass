import { Link } from "react-router-dom";
import { useMemo } from "react";
import "./DashboardBody.css";
import { DoorClosedLocked, DoorOpen, PlusIcon, Users } from "lucide-react";
import { MdOutgoingMail } from "react-icons/md";
import { useGroupActivitySummary } from "../../../hooks/useGroupActivity";
import { formatActivityText } from "../../../data/groupActivityText";
import { FiActivity } from "react-icons/fi";
import { BiSolidNotification } from "react-icons/bi";

function DashboardBody({ handleOpenNewGroup, storedGroups }) {
  const groupIds = useMemo(() => storedGroups.map((g) => g.id), [storedGroups]);
  const { data: activitySummary = [] } = useGroupActivitySummary(groupIds);

  const summaryByGroup = useMemo(
    () => Object.fromEntries(activitySummary.map((s) => [s.group_id, s])),
    [activitySummary],
  );

  return (
    <div className="groups">
      {storedGroups.length ? (
        storedGroups.map((group) => {
          const summary = summaryByGroup[group.id];
          const unread = summary?.unread_count ?? 0;
          const latestText = summary?.latest_type
            ? formatActivityText({
                type: summary.latest_type,
                metadata: summary.latest_metadata,
                actor: { username: summary.latest_actor_username },
              })
            : null;

          return (
            <Link
              to={`/home/group/${group.id}/courses`}
              key={group.group_code}
              className="group-card"
              style={{ boxShadow: `inset 0 6px 0 0 ${group.color}` }}
            >
              <div className="gp-hd">
                <img src={group?.avatar_url} className="group-bg-cover" />
                <div className="hd-icon-wrapper">
                  {group.visibility === "open" ? (
                    <DoorOpen id="opened" />
                  ) : group.visibility === "closed" ? (
                    <DoorClosedLocked id="closed" />
                  ) : (
                    <MdOutgoingMail id="inv-only" />
                  )}
                </div>
              </div>
              <div
                className="group-avatar-badge"
                style={{
                  backgroundColor: group.color,
                  color: "#ffff",
                }}
              >
                {group.avatar_url ? (
                  <img src={group.avatar_url} />
                ) : (
                  <Users size={40} />
                )}
              </div>

              <div className="group-title">
                <p className="group-name">{group.name}</p>
                <div className="rep-name-title">
                  Representative :{" "}
                  <span style={{ color: group.color }}>{group.rep_name}</span>
                </div>
              </div>

              <div className="group-roster-summary">
                <div className="member-count-row">
                  <Users size={16} style={{ color: group.color }} />{" "}
                  <span>{group.group_members[0].count} members</span>
                </div>
                <div className="courses-count-row">
                  <span>{group.courses[0]?.count ?? 0} Courses</span>
                  {unread > 0 && (
                    <span className="pill-badge alert">{unread} new</span>
                  )}
                </div>
              </div>

              <div className="group-subtitle">
                <div className="new-act-icon">
                  <BiSolidNotification
                    size={18}
                    style={{ color: group.color }}
                  />
                </div>
                <div className="group-news">
                  {latestText || "No recent activity"}
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="no-group-container">
          <p className="no-group-yet">You haven't joined any groups yet.</p>
          <span className="no-group-sub">
            Create or explore groups to get started!
          </span>
          <button className="new-hub-button2" onClick={handleOpenNewGroup}>
            New Group <PlusIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export default DashboardBody;
