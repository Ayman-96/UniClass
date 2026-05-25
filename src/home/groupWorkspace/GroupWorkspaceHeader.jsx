import "./GroupWorkspaceHeader.css";
function GroupWorkspaceHeader({
  titleIcon,
  title,
  btnIcon,
  btnTitle,
  onButtonClick,
}) {
  return (
    <div className="gsr-header">
      <p>
        {titleIcon} <span>{title}</span>
      </p>
      <button className="group-header-btn" onClick={onButtonClick}>
        {btnIcon} {btnTitle}
      </button>
    </div>
  );
}
export default GroupWorkspaceHeader;
