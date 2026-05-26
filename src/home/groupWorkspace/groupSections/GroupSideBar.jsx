import "./GroupSideBar.css";
import { useGroups } from "../../../hooks/useGroups";
import { NavLink, useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import { BookOpen, MessageSquareText, Users, Megaphone } from "lucide-react";

const groupSections = [
  {
    id: 1,
    title: "courses",
    icon: <BookOpen className="groupNav-icon" />,
  },
  {
    id: 2,
    title: "posts",
    icon: <MessageSquareText className="groupNav-icon" />,
  },
  {
    id: 3,
    title: "members",
    icon: <Users className="groupNav-icon" />,
  },
  {
    id: 4,
    title: "announcements",
    icon: <Megaphone className="groupNav-icon" />,
  },
];
function GroupSideBar() {
  // const setOfGroups = JSON.parse(localStorage.getItem("storeGroup"));
  // const { groupId } = useParams();
  // const specifiedGroup = setOfGroups.find(
  //   (group) => group.group_code === groupId,
  // );
  const { data: storedGroups, isLoading, isError } = useGroups();
  const { groupId } = useParams();
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Something went wrong</div>;
  const specifiedGroup = storedGroups.find((group) => group.id === groupId);
  return (
    <nav className="group-nav">
      <div className="group-nav-header">
        <div className="group-logo">{specifiedGroup.name.slice(0, 2)}</div>
        <div className="group-nav-name">{specifiedGroup.name}</div>
        <div className="group-nav-code">{specifiedGroup.group_code}</div>
      </div>

      <div className="group-nav-body">
        {groupSections.map((sec) => {
          return (
            <NavLink to={sec.title} key={sec.id} className="groupNav-link">
              <div className="groupNav-link-left">
                {sec.icon}
                <span>{sec.title}</span>
              </div>
            </NavLink>
          );
        })}
      </div>

      <div className="link-to-rep-acc">
        <div className="rep-acc-img">AR</div>
        <div className="refer-to-rep">
          Rep <span>rep name</span>
        </div>
      </div>
    </nav>
  );
}

export default GroupSideBar;
