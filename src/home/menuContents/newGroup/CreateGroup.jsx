import "./CreateGroup.css";
import { RefreshCw } from "lucide-react";
function CreateGroup() {
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
            type="text"
            className="groupId-input"
            placeholder="Unique ID"
          />
          <button className="generate-code-btn">
            <RefreshCw /> Generate
          </button>
        </div>
      </div>

      {/* Group Name*/}
      <div className="set-group-rep">
        <label htmlFor="groupRep" className="groupRep-label">
          Group Representative
        </label>
        <input
          id="groupRep"
          type="text"
          className="groupName-input"
          placeholder="Representative Name"
        />
      </div>

      {/*Group Color */}
      <div className="set-group-color">
        {colorOptions.map((color) => {
          return (
            <div
              className="color-placeHolder"
              style={{ backgroundColor: color }}
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
