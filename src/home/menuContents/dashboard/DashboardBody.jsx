import { Link } from "react-router-dom";
import "./DashboardBody.css";
import { DoorClosedLocked, DoorOpen, Users } from "lucide-react";
import { MdOutgoingMail } from "react-icons/md";
function DashboardBody({ storedGroups }) {
  console.log(storedGroups);
  return (
    <div className="groups">
      {storedGroups.length ? (
        storedGroups.map((group) => {
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
                  <span className="pill-badge alert">X new</span>
                </div>
              </div>

              <div className="group-subtitle">
                <p className="num-of-lecs">\</p>
                <div className="group-news">ex: new Leacture</div>
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
        </div>
      )}
    </div>
  );
}

export default DashboardBody;
