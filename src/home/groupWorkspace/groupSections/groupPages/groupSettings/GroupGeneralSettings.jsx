import { ShieldAlert } from "lucide-react";
import { BsPostcardHeart } from "react-icons/bs";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";

function GroupGeneralSettings({
  groupData,
  isEditing,
  changeData,
  setChangeData,
}) {
  const settings = [
    {
      label: "Allow members to post",
      icon: <BsPostcardHeart />,
      desc: "Members can create posts and discussions.",
      activated: changeData?.allow_members_to_post,
      onClick: () =>
        setChangeData({
          ...changeData,
          allow_members_to_post: !changeData?.allow_members_to_post,
        }),
    },
    {
      label: "Require admin approval for new members",
      icon: <ShieldAlert />,
      desc: "New members need to be approved before joining.",
      activated: changeData?.require_approval,
      onClick: () =>
        setChangeData({
          ...changeData,
          require_approval: !changeData?.require_approval,
        }),
    },
  ];
  return (
    <div className="gp-general-st">
      <p>General Settings</p>
      <p>Configure permissions ans groyp behavior.</p>
      <div className="general-settings-opt">
        {settings.map((set) => {
          return (
            <div className="set-opt" key={set.label}>
              <div className="setting-left-col">
                <div
                  className="setting-icon-wrap"
                  style={{ color: groupData?.color }}
                >
                  {set.icon}
                </div>
                <div>
                  <p>{set.label}</p>
                  <p>{set.desc}</p>
                </div>
              </div>
              <button
                disabled={!isEditing}
                className={`toggle-btn ${set.activated ? "activated-toggle" : ""}`}
                style={
                  set.activated ? { background: groupData?.color } : undefined
                }
                onClick={() => set.onClick()}
              >
                {set.activated ? (
                  <PiToggleRightFill style={{ color: groupData?.color }} />
                ) : (
                  <PiToggleLeftFill />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default GroupGeneralSettings;
