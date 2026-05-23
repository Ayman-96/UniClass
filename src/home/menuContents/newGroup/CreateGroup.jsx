import "./CreateGroup.css";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

function CreateGroup({ dispatch }) {
  const [groupId, setGroupId] = useState("");

  function handleGenerateId(e) {
    e.preventDefault();
    const id = nanoid(9).toUpperCase();
    setGroupId(`GRP-${id.slice(0, 3)}-${id.slice(3, 6)}-${id.slice(6, 9)}`);
  }
  useEffect(() => {
    dispatch({ action: "SET_ID", payload: groupId });
  }, [dispatch, groupId]);
  const colorOptions = [
    "#00a86b", // Emerald Green
    "#065f46", // Deep Forest Green
    "#3b82f6", // Vibrant Blue
    "#e05626", // Burnt Orange
    "#d24d74", // Rose Pink
    "#c07014", // Ochre Gold
  ];
  return (
    <form className="create-group-view">
      {/* Group Name*/}
      <div className="set-group-name">
        <label htmlFor="groupName" className="groupName-label">
          Group Name
        </label>
        <input
          id="groupName"
          type="text"
          className="groupName-input"
          placeholder="e.g. Class Software"
          onChange={(e) => {
            dispatch({ type: "SET_NAME", payload: e.target.value });
          }}
        />
      </div>

      {/* Group ID*/}
      <div className="set-group-id">
        <label htmlFor="groupId" className="groupId-label">
          Group ID <span>(used to join the group)</span>
        </label>

        <div className="id-generater">
          <input
            id="groupId"
            value={groupId}
            className="groupId-input"
            placeholder="Unique ID"
            readOnly={true}
          />
          <button className="generate-code-btn" onClick={handleGenerateId}>
            <RefreshCw /> Generate
          </button>
        </div>
      </div>

      {/* Group Rep*/}
      <div className="set-group-rep">
        <label htmlFor="groupRep" className="groupRep-label">
          Group Representative
        </label>
        <input
          id="groupRep"
          type="text"
          className="groupName-input"
          placeholder="Representative Name"
          onChange={(e) => {
            dispatch({ type: "SET_REP", payload: e.target.value });
          }}
        />
      </div>

      {/*Group Color */}
      <div className="set-group-color">
        {colorOptions.map((color) => {
          return (
            <div
              key={color}
              className="color-placeHolder"
              style={{ backgroundColor: color }}
              onClick={() => {
                dispatch({ type: "SET_COLOR", payload: color });
              }}
            ></div>
          );
        })}
      </div>

      {/* Group Description*/}
      <div className="set-group-desc">
        <label htmlFor="groupDesc" className="groupDesc-label">
          Description <span>(optional)</span>
        </label>
        <input
          id="groupDesc"
          type="text"
          className="groupDesc-input"
          placeholder="Describe the group"
        />
      </div>
    </form>
  );
}
export default CreateGroup;
