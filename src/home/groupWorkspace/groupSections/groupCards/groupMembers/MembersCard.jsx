import "./MembersCard.css";
import RepsList from "./RepList";
import MembersList from "./MembersList";
import GroupActivity from "./GroupActivity";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../../../AuthContext";
import GroupMembersHeader from "./GroupMembersHeader";
import { useGroupMembers } from "../../../../../hooks/useGroupMembers";

function MembersCard() {
  const { user } = useAuth();
  const { groupId } = useParams();

  const { data: groupData } = useGroupMembers();
  const { data: groupMembers } = useGroupMembers(groupId);

  const group = groupData?.find((curr) => curr.id === groupId);
  const reps = groupMembers?.filter((member) => member.role === "rep");
  const countRep = groupMembers?.reduce((acc, member) => {
    if (member.role === "rep") {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="group-members-overlay">
      <div className="gp-mmb-header">
        <GroupMembersHeader groupData={group} countRep={countRep} />
      </div>
      <div className="gp-mmb-body">
        <div className="body-left">
          <MembersList
            user={user}
            groupData={group}
            groupMembers={groupMembers}
          />
        </div>
        <div className="body-right">
          <RepsList
            user={user}
            reps={reps}
            groupData={group}
            countRep={countRep}
          />
          <GroupActivity groupMembers={groupMembers} />
        </div>
      </div>
    </div>
  );
}

export default MembersCard;
