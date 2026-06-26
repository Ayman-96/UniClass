import { Link } from "react-router-dom";
import "./DashboardBody.css";
import { Users } from "lucide-react";
function DashboardBody({ storedGroups }) {
  return (
    <div className="groups">
      {storedGroups.map((group) => {
        return (
          <Link
            to={`/home/group/${group.id}/courses`}
            key={group.group_code}
            className="group-card"
            style={{ boxShadow: `inset 0 4px 0 0 ${group.color}` }}
          >
            {/*add icons in future */}
            <div
              className="group-avatar-badge"
              style={{
                backgroundColor: group.color,
                color: "#ffff",
              }}
            >
              <Users size={20} />
            </div>

            <div className="group-title">
              <p className="group-name">{group.name}</p>
              <div className="rep-name-title">
                Representative : <span>{group.rep_name}</span>
              </div>
            </div>

            <div className="group-roster-summary">
              <div className="member-count-row">
                <Users size={16} />{" "}
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
      })}
    </div>
  );
}

export default DashboardBody;
