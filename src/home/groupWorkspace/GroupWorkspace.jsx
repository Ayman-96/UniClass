import "./GroupWorkspace.css";
import GroupSideBar from "./GroupSideBar";
import { Outlet, useParams } from "react-router-dom";
import { useGroups } from "../../hooks/useGroups";
import useGroupStore from "../../store/useGroupStore";
import { useEffect } from "react";

function GroupWorkspace() {
  const { groupId } = useParams();
  const { data: groups } = useGroups();
  const setCurrentGroup = useGroupStore((curr) => curr.setCurrentGroup);

  useEffect(() => {
    const group = groups?.find((i) => i.id === groupId);
    if (group) setCurrentGroup(group);
  }, [groups, groupId, setCurrentGroup]);
  return (
    <div className="group-page">
      <div className="group-space-left">
        <GroupSideBar />
      </div>
      <div className="group-space-right">
        <Outlet />
      </div>
    </div>
  );
}

export default GroupWorkspace;
