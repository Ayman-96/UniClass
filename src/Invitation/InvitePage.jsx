import "./InvitePage.css";
import { useAuth } from "../AuthContext";
import { HiMiniUserGroup } from "react-icons/hi2";
import { useIsMember } from "../hooks/useGroupMembers";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJoinGroup, useSingleGroup } from "../hooks/useGroups";
import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";
import { PiStudentFill } from "react-icons/pi";
import { Logo } from "../components/Logo";

function InvitePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { groupId } = useParams();
  const { data: group } = useSingleGroup(groupId);
  const { mutate: joinGroup } = useJoinGroup();
  const { data: amIMember } = useIsMember(groupId);
  function handleJoin() {
    if (!user) {
      navigate(`/signUp?redirect=/join/${groupId}`);
    } else if (amIMember) {
      navigate(`/home/group/${group?.id}`);
    } else {
      joinGroup(groupId);
    }
  }
  if (!group) return <LoadingSpinner />;
  return (
    <div className="invitation-page">
      <div className="inv-header">
        <Logo titleColor="#1a9e78" />
        <div>
          <p>
            You've Been Invited <HiMiniUserGroup />
          </p>
          <p>Take your studying to another level with UniClass</p>
        </div>
      </div>
      <div className="inv-body">
        <div className="group-info">
          <div className="grp-avatar">
            {group?.avatar ? (
              <img src={group?.avatar} alt="group-avatar" />
            ) : (
              <PiStudentFill />
            )}
          </div>
          <div>
            <p>{group?.name}</p>
            <p>Rep: {group?.rep_name}</p>
          </div>
        </div>

        <div className="group-counter">
          <div>
            <label htmlFor="members">MEMBERS</label>
            <div>
              {group?.group_members[0]?.count}{" "}
              <span>{Number(group?.group_members[0]?.count) + 1} with you</span>
            </div>
          </div>
          <div>
            <label htmlFor="courses">COURSES</label>
            <div>{group?.courses[0].count}</div>
          </div>
        </div>

        <div className="group-btns">
          <button onClick={handleJoin}>Join Group</button>
          <button onClick={() => navigate(-1)}>Maybe later</button>
          <p>
            You need an account to join. <Link to="/signUp">Signup here.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default InvitePage;
