import GroupPageHeader from "./GroupPageHeader";
import { UsersRound, UserPlus } from "lucide-react";
function GroupMembersPage() {
  return (
    <div className="members-page">
      <div className="members-header">
        <GroupPageHeader
          titleIcon={<UsersRound />}
          title="Members"
          btnIcon={<UserPlus />}
          btnTitle="Add Member"
        />
      </div>
    </div>
  );
}
export default GroupMembersPage;
