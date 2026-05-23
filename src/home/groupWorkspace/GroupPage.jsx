import { useParams } from "react-router-dom";
function GroupPage() {
  const setOfGroups = JSON.parse(localStorage.getItem("storeGroup"));
  const { groupId } = useParams();
  const specifiedGroup = setOfGroups.find((group) => group.groupId === groupId);
  return <div className="group-page">{specifiedGroup.groupName}</div>;
}
export default GroupPage;
