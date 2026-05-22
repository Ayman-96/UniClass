import "./JoinGroup.css";
import { KeyRound, Info } from "lucide-react";
function JoinGroup() {
  return (
    <div className="join-group-details">
      <div className="how-to-join">
        <KeyRound className="key-icon" />
        <h2>Enter Your Group Code</h2>
        <p>Ask Your Representative or Professor for the Code</p>
      </div>

      {/* Group Code*/}
      <div className="enter-group-code">
        <label htmlFor="groupCode" className="groupCode-label">
          Group Code <span>(id)</span>
        </label>
        <input
          id="groupCode"
          type="text"
          className="groupId-input"
          placeholder="Enter the Group ID"
        />
      </div>

      <div className="group-hint">
        <span>
          <Info />
        </span>{" "}
        You'll be added as a member. Only the group representative can manage
        members and courses.
      </div>
    </div>
  );
}
export default JoinGroup;
