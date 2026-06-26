import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import "./JoinGroup.css";
import { KeyRound, Info, ShieldX } from "lucide-react";
function JoinGroup({ joinCode, setJoinCode, isPending, isError, error }) {
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
        {isPending ? (
          <LoadingSpinner />
        ) : (
          <input
            id="groupCode"
            type="text"
            value={joinCode.toUpperCase()}
            maxLength={15}
            className="groupId-input"
            placeholder="Enter the Group Code"
            onChange={(e) => setJoinCode(e.target.value)}
          />
        )}
      </div>
      {isError ? (
        <div className="group-hint-error">
          <ShieldX />
          <p className="not-found-error">{error.message}</p>
        </div>
      ) : (
        <div className="group-hint">
          <span>
            <Info />
          </span>{" "}
          You'll be added as a member. Only the group representative can manage
          members and courses.
        </div>
      )}
    </div>
  );
}
export default JoinGroup;
