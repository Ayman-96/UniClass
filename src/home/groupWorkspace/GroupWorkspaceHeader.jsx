import { useParams } from "react-router-dom";
import { useIsRep } from "../../hooks/useIsRep";
import "./GroupWorkspaceHeader.css";
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

  return (
    <div className="gsr-header">
      <p>
        {titleIcon} <span>{title}</span>
      </p>
      <button
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
