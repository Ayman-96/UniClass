import { MdOutgoingMail } from "react-icons/md";
import { FaRegCircleDot } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { Circle, DoorClosedLocked, DoorOpen } from "lucide-react";

function GroupManageAccess({
  isEditing,
  groupData,
  changeData,
  setChangeData,
}) {
  const [selectedAccess, setSelectedAccess] = useState(groupData?.visibility);
  const accessOptions = [
    {
      label: "Open",
      value: "open",
      icon: <DoorOpen />,
      desc: "Anyone can find and join the group.",
    },
    {
      label: "Invite Only",
      value: "invite_only",
      icon: <MdOutgoingMail />,
      desc: "Only people with an invite can join.",
    },
    {
      label: "Closed",
      value: "closed",
      icon: <DoorClosedLocked />,
      desc: "Only representatives allowed to invite.",
    },
  ];

  useEffect(() => {
    if (groupData) {
      setSelectedAccess(groupData.visibility);
    }
  }, [groupData]);
  return (
    <div className="gp-manage-access">
      <p>Manage Access</p>
      <p>Control who can join your group</p>
      <div className="access-options">
        {accessOptions.map((opt) => {
          return (
            <div
              key={opt.value}
              style={
                selectedAccess === opt.value
                  ? {
                      border: `1px solid ${groupData?.color}`,
                    }
                  : undefined
              }
              className={`acc-opt ${selectedAccess === opt.value ? "selected" : ""}`}
              onClick={() => {
                isEditing &&
                  (setSelectedAccess(opt.value),
                  setChangeData({ ...changeData, visibility: opt.value }));
              }}
            >
              <div className="acc-opt-title">
                <div
                  style={
                    selectedAccess === opt.value
                      ? {
                          color: groupData?.color,
                        }
                      : undefined
                  }
                >
                  {selectedAccess === opt.value &&
                    React.cloneElement(opt.icon, {
                      color: groupData?.color,
                    })}{" "}
                  {opt.label}
                </div>
                <div>
                  {selectedAccess === opt.value ||
                  groupData?.visibility === opt.value ? (
                    <FaRegCircleDot style={{ color: groupData?.color }} />
                  ) : (
                    <Circle />
                  )}
                </div>
              </div>
              <div
                className="acc-opt-desc"
                style={
                  selectedAccess === opt.value
                    ? { color: groupData?.color }
                    : undefined
                }
              >
                {opt.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default GroupManageAccess;
