import "./GroupSideBar.css";
import { useGroups } from "../../hooks/useGroups";
import { NavLink, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import {
  BookOpen,
  MessageSquareText,
  Users,
  Megaphone,
  Settings,
} from "lucide-react";
import { useGroupMembers } from "../../hooks/useGroupMembers";

const groupSections = [
  {
    id: 1,
    title: "courses",
    icon: <BookOpen className="groupNav-icon" />,
  },
  {
    id: 2,
    title: "announcements",
    icon: <Megaphone className="groupNav-icon" />,
  },
  {
    id: 3,
    title: "posts",
    icon: <MessageSquareText className="groupNav-icon" />,
  },

  {
    id: 4,
    title: "members",
    icon: <Users className="groupNav-icon" />,
  },

  {
    id: 5,
    title: "settings",
    icon: <Settings className="groupNav-icon" />,
  },
];
function GroupSideBar() {
  const { groupId } = useParams();
  const { data: storedGroups, isLoading, isError } = useGroups();
  const specifiedGroup = storedGroups?.find((group) => group.id === groupId);
  const { data: members } = useGroupMembers(groupId);
  const moderator = members?.filter((g) => g.is_moderator === true);
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Something went wrong</div>;
  return (
    <nav className="group-nav">
      <div className="group-nav-header">
        <img src={specifiedGroup?.avatar_url} className="group-logo" />
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

      <NavLink
        className="link-to-rep-acc"
        to={`/profile/${moderator?.[0]?.user_id}`}
      >
        <img
          className="rep-acc-img"
          src={moderator?.[0]?.profiles?.avatar_url}
        />
        <div className="refer-to-rep" style={{ color: specifiedGroup?.color }}>
          Rep <span>{moderator?.[0]?.profiles?.username}</span>
        </div>
      </NavLink>
    </nav>
  );
}

export default GroupSideBar;
