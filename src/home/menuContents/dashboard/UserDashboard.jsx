import "./UserDashboard.css";
import DashboardBody from "./DashboardBody";
import { useState, useReducer } from "react";
import DashboardHeader from "./DashboardHeader";
import { useAuth } from "../../../AuthContext.jsx";
import NewGroupForm from "../newGroup/NewGroupForm";
import { useGroups, useAddGroup } from "../../../hooks/useGroups";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import AnimatedBackground from "../../../animated/AnimatedBackground.jsx";
import { IoIosHeart } from "react-icons/io";
const groupsData = {
  groupId: "",
  groupName: "",
  groupRep: "",
  leactures: [],
  numOfMembers: 0,
  color: "#00a86b",
  description: "",
};

function groupReducer(state, action) {
  // state = newGroup
  switch (action.type) {
    case "SET_NAME":
      return { ...state, groupName: action.payload };
    // returns { groupId: "", groupName: "Math Group", color: "#00a86b", ... }
    // 4. newGroup is now updated
    case "SET_ID":
      return { ...state, groupId: action.payload };
    case "SET_REP":
      return { ...state, groupRep: action.payload };
    case "SET_COLOR":
      return { ...state, color: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "RESET":
      return groupsData;

    default:
      return state;
  }
}
function UserDashboard() {
  const { user } = useAuth();
  const [popNewGroup, setPopNewGroup] = useState(false);
  const [fillWarning, setFillWarning] = useState(false);
  // const [storedGroups, setStoredGroups] = StoreGroups([], "storeGroup");
  const { data: storedGroups, isLoading, isError } = useGroups();
  const { mutate: addGroup } = useAddGroup();
  const [newGroup, dispatch] = useReducer(groupReducer, groupsData);
  // this  ↑ is state
  function handleOpenNewGroup() {
    setFillWarning(false);
    setPopNewGroup((prev) => !prev);
  }
  function handleCreateGroup() {
    if (!newGroup.groupName || !newGroup.groupId || !newGroup.groupRep) {
      setFillWarning(true);
      return;
    }

    addGroup({
      name: newGroup.groupName,
      group_code: newGroup.groupId,
      description: newGroup.description,
      color: newGroup.color,
      rep_id: user.id,
      rep_name: newGroup.groupRep,
    });
    // setStoredGroups([...storedGroups, newGroup]); replaced by addGroup(...) which saves to Supabase
    // localStorage.setItem("storeGroup", newGroup);  Supabase is the storage now,
    setFillWarning(false);
    dispatch({ type: "RESET" });
    handleOpenNewGroup();
  }
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Something went wrong</div>;
  return (
    <AnimatedBackground>
      <div className="dashboard-page">
        <div className="dashbord-header">
          <DashboardHeader
            handleOpenNewGroup={handleOpenNewGroup}
            storedGroups={storedGroups}
          />
        </div>

        <div className="dashbord-body">
          <DashboardBody
            handleOpenNewGroup={handleOpenNewGroup}
            storedGroups={storedGroups}
          />
        </div>

        <div className="open-group-form">
          {popNewGroup && (
            <NewGroupForm
              dispatch={dispatch}
              fillWarning={fillWarning}
              handleCreateGroup={handleCreateGroup}
              handleOpenNewGroup={handleOpenNewGroup}
            />
          )}
        </div>
        <p className="dev-tag">
          Made with <IoIosHeart /> by Ayman
        </p>
      </div>
    </AnimatedBackground>
  );
}

export default UserDashboard;
