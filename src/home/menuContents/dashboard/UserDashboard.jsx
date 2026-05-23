import "./UserDashboard.css";
import { useState, useReducer } from "react";
import DashboardBody from "./DashboardBody";
import DashboardHeader from "./DashboardHeader";
import NewGroupForm from "../newGroup/NewGroupForm";
const groupsData = {
  groupId: "",
  groupName: "",
  groupRep: "",
  leactures: [],
  numOfMembers: 0,
  color: "#00a86b",
  description: "",
};
const leacture = {
  id: "111",
  name: "DB",
  u: "a",
  numOfLeactures: "",
  color: "orange",
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
  const [storedGroup, setStoredGroup] = useState([]);
  const [popNewGroup, setPopNewGroup] = useState(false);
  const [newGroup, dispatch] = useReducer(groupReducer, groupsData);
  // this  ↑ is state
  function handleOpenNewGroup() {
    setPopNewGroup((prev) => !prev);
  }
  function handleCreateGroup() {
    setStoredGroup([...storedGroup, newGroup]);
  }
  console.log(storedGroup);

  return (
    <div className="dashboard-page">
      <div className="dashbord-header">
        <DashboardHeader handleOpenNewGroup={handleOpenNewGroup} />
      </div>

      <div className="dashbord-body">
        <DashboardBody storedGroup={storedGroup} />
      </div>

      <div className="open-group-form">
        {popNewGroup && (
          <NewGroupForm
            dispatch={dispatch}
            handleCreateGroup={handleCreateGroup}
            handleOpenNewGroup={handleOpenNewGroup}
          />
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
