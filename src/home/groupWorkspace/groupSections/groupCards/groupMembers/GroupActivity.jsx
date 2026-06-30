import { ActivityIcon, Calendar } from "lucide-react";

function GroupActivity({ groupMembers }) {
  const isMod = groupMembers?.filter(
    (rep) => rep.role === "rep" && rep.is_moderator,
  );

  return (
    <div className="group-activity">
      <div>
        <ActivityIcon /> Activity
      </div>

      <div className="activity-card">
        <Calendar /> Group Created By {isMod?.username}
      </div>
    </div>
  );
}
export default GroupActivity;
