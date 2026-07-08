import { useState } from "react";
import AddMember from "./groupModals/AddMember";
import { UsersRound, UserPlus } from "lucide-react";
import MembersCard from "./groupMembers/MembersCard";
import GroupPageHeader from "../../GroupWorkspaceHeader";
import useGroupStore from "../../../../store/useGroupStore";

function GroupMembersPage() {
  const [memberModal, setMemberModal] = useState(false);

  const currentGroup = useGroupStore((curr) => curr.currentGroup);
  function handleMemberModal() {
    setMemberModal((prev) => !prev);
  }
  return (
    <div className="members-page">
      <div className="members-header">
        <GroupPageHeader
          titleIcon={<UsersRound />}
          title="Members"
          btnIcon={<UserPlus />}
          btnTitle="Add Member"
          onButtonClick={handleMemberModal}
          requiredRep={currentGroup?.visibility === "closed" ? true : false}
        />
      </div>

      <div className="posts-body">
        {memberModal && <AddMember handleMemberModal={handleMemberModal} />}
      </div>

      <div>
        <MembersCard />
      </div>
    </div>
  );
}
export default GroupMembersPage;
