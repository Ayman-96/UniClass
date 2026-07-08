import { useParams } from "react-router-dom";
import { useIsRep } from "../../hooks/useIsRep";
import "./GroupWorkspaceHeader.css";
import { useSingleGroup } from "../../hooks/useGroups";
import React from "react";
function GroupWorkspaceHeader({
  titleIcon,
  title,
  btnIcon,
  btnTitle,
  onButtonClick,
  requiredRep,
}) {
  const { groupId } = useParams();
  const { data: isRep } = useIsRep(groupId);
  const { data: groupData } = useSingleGroup(groupId);
  return (
    <div className="gsr-header">
      <p>
        {React.cloneElement(titleIcon, { color: groupData?.color })}
        <span>{title}</span>
      </p>
      <button
        style={{ background: groupData?.color }}
        disabled={requiredRep}
        className="group-header-btn"
        onClick={() => {
          requiredRep ? isRep && onButtonClick() : onButtonClick();
        }}
      >
        {requiredRep ? (
          isRep ? (
            <div>
              {btnIcon} {btnTitle}
            </div>
          ) : (
            <div>
              {" "}
              Only Rep Can {btnTitle} {btnIcon}
            </div>
          )
        ) : (
          <div>
            {btnIcon} {btnTitle}
          </div>
        )}
      </button>
    </div>
  );
}
export default GroupWorkspaceHeader;
