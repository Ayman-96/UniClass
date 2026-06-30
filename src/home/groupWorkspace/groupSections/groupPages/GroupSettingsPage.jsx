import {
  Camera,
  Circle,
  CodeXml,
  DoorClosedLocked,
  DoorOpen,
  FileCog,
  ImageIcon,
  InspectionPanel,
  Pen,
  Settings2,
  ShieldAlert,
  Trash2,
  Wrench,
} from "lucide-react";
import "./Groupsettingspage.css";
import GroupPageHeader from "../../GroupWorkspaceHeader";
import { HiMiniUserGroup } from "react-icons/hi2";
import React, { useEffect, useState } from "react";
import {
  useDeleteGroup,
  useSingleGroup,
  useUpdateGroupSettings,
} from "../../../../hooks/useGroups";
import { useNavigate, useParams } from "react-router-dom";
import { useIsRep } from "../../../../hooks/useIsRep";
import { IoIosCreate } from "react-icons/io";
import { MdOutgoingMail } from "react-icons/md";
import { BsPostcardHeart } from "react-icons/bs";
import { FaRegCircleDot } from "react-icons/fa6";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";

function GroupSettingsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { data: groupData } = useSingleGroup(groupId);
  const [isEditing, setIsEdinig] = useState(false);
  const { mutate: updateGroup } = useUpdateGroupSettings(groupId);
  const [changeData, setChangeData] = useState(null);

  const { mutate: deleteGroup } = useDeleteGroup();
  useEffect(() => {
    if (groupData) {
      setChangeData({
        allow_members_to_post: groupData.allow_members_to_post,
        require_approval: groupData.require_approval,
        visibility: groupData.visibility,
        avatar_url: groupData.avatar_url,
        banner_url: groupData.banner_url,
        avatarFile: null,
        bannerFile: null,
        description: groupData.description,
        color: groupData.color,
      });
    }
  }, [groupData]);

  const handleSave = () => {
    updateGroup(changeData);
    setIsEdinig(false);
  };
  function handleEditSettings() {
    setIsEdinig((prev) => !prev);
  }

  return (
    <div className="group-settings">
      <GroupPageHeader
        titleIcon={<Settings2 />}
        title="Settings"
        btnIcon={<Pen />}
        btnTitle="Edit"
        onButtonClick={handleEditSettings}
        requiredRep={true}
      />

      <div className="gp-informations-st">
        <GroupSettingsHeader
          groupData={groupData}
          isEditing={isEditing}
          handleEditSettings={handleEditSettings}
          changeData={changeData}
          setChangeData={setChangeData}
          handleSave={handleSave}
          onCancel={() => setIsEdinig(false)}
        />
        <GroupDesign
          groupData={groupData}
          isEditing={isEditing}
          changeData={changeData}
          setChangeData={setChangeData}
        />

        <GroupManageAccess
          isEditing={isEditing}
          groupData={groupData}
          changeData={changeData}
          setChangeData={setChangeData}
        />

        <GroupGeneralSettings
          groupData={groupData}
          isEditing={isEditing}
          changeData={changeData}
          setChangeData={setChangeData}
        />
      </div>
      <div className="delete-group-wrapper">
        <div className="delete-group">
          <div>
            <Trash2 /> Group Deletion
          </div>
          <div>
            Permanently delete this group and all its data. This action cannot
            be undone!
          </div>
          <button
            onClick={() => {
              (deleteGroup(groupId), navigate("/home"));
            }}
          >
            Delete Group
          </button>
        </div>
      </div>
    </div>
  );
}

function GroupSettingsHeader({
  groupData,
  isEditing,
  handleEditSettings,
  changeData,
  setChangeData,
  handleSave,
  onCancel,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const { data: amIRep } = useIsRep(groupData?.id);
  const unchangableData = [
    {
      label: "Group Code",
      icon: <CodeXml />,
      value: groupData?.group_code,
    },
    {
      label: "Created",
      icon: <IoIosCreate />,
      value: new Date(groupData?.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    },
  ];
  return (
    <div className="gp-info-container">
      {groupData?.banner_url && (
        <img className="grp-banner-img" src={groupData.banner_url} />
      )}
      <div className="gp-avatar">
        <img
          src={groupData?.avatar_url}
          style={{ border: `3px solid ${groupData?.color}` }}
        />
      </div>

      <div className="gp-info">
        <div className="gp-info-top-row">
          <p>
            {groupData?.name}{" "}
            <span style={{ color: groupData?.color }}>
              {groupData?.visibility?.replace(/_/g, " ").toUpperCase()}
            </span>
          </p>
          {amIRep ? (
            isEditing ? (
              <button
                className="edit-settings-btn"
                onClick={() => {
                  handleEditSettings();
                  handleSave();
                }}
              >
                <FileCog /> Save Changes
              </button>
            ) : (
              <button
                className="edit-settings-btn"
                onClick={handleEditSettings}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  background: isHovered ? "transparent" : groupData?.color,
                  border: `1px solid ${groupData?.color}`,
                  color: isHovered ? groupData?.color : "white", // optional
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                <Wrench /> Edit Settings
              </button>
            )
          ) : (
            ""
          )}
          {amIRep && isEditing && (
            <button
              className="cancel-setting-changes"
              onClick={() => {
                setChangeData(groupData);
                onCancel();
              }}
            >
              Cancel
            </button>
          )}
        </div>
        <div className="gp-description">
          <textarea
            type="text"
            id="description"
            disabled={!isEditing}
            maxLength={132}
            value={changeData?.description || ""}
            className={isEditing ? "editing-desc" : ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            onChange={(e) => {
              setChangeData((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
          />
          <div className="gp-unchangable-data">
            {unchangableData.map((data) => {
              return (
                <div className="unchange-datas" key={data.label}>
                  <div>
                    {" "}
                    {React.cloneElement(data?.icon, {
                      color: groupData?.color,
                    })}
                  </div>
                  <div>
                    <p>{data.label}</p>
                    <p>{data.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
function GroupDesign({ groupData, isEditing, changeData, setChangeData }) {
  console.log(groupData);
  const [selectedColor, setSelectedColor] = useState(groupData?.color);

  const colorOptions = [
    "#00a86b", // Emerald Green
    "#065f46", // Deep Forest Green
    "#3b82f6", // Vibrant Blue
    "#e05626", // Burnt Orange
    "#d24d74", // Rose Pink
    "#c07014", // Ochre Gold
  ];

  return (
    <div className="group-design-overlay">
      <p>Group Avatar & Color</p>
      <p>Customize your group's look.</p>
      <div className="design-row">
        <div className="design-col">
          <span className="design-col-label">Group Avatar</span>

          <div className="grp-avatar-st">
            <input
              id="group-avatar"
              type="file"
              hidden
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                setChangeData({ ...changeData, avatarFile: e.target.files[0] })
              }
            />
            <button
              className={`${isEditing ? "editing-grp-avatar" : ""}`}
              style={
                isEditing ? { border: `3px dashed ${groupData?.color}` } : {}
              }
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing) document.getElementById("group-avatar").click();
              }}
            >
              {groupData?.avatar_url ? (
                <img src={groupData?.avatar_url} />
              ) : (
                <ImageIcon />
              )}
            </button>
            {isEditing && (
              <div className="edit-img-hint">
                <Camera size={12} />
              </div>
            )}
            {/*to put at bottom of img to tell u can change */}
          </div>
        </div>

        <div className="grp-cover">
          <div className="design-col">
            <span className="design-col-label">Group Cover</span>
            <input
              id="group-cover"
              type="file"
              hidden
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                setChangeData({ ...changeData, bannerFile: e.target.files[0] })
              }
            />
            <button
              className={`${isEditing ? "editing-grp-avatar" : ""}`}
              style={
                isEditing ? { border: `3px dashed ${groupData?.color}` } : {}
              }
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing) document.getElementById("group-cover").click();
              }}
            >
              {groupData?.banner_url ? (
                <img src={groupData.banner_url} />
              ) : (
                <HiMiniUserGroup />
              )}
            </button>
            {isEditing && (
              <div className="edit-img-hint">
                <InspectionPanel />{" "}
              </div>
            )}
            {/*to put at bottom of img to tell u can change */}
          </div>
        </div>
        <div className="design-col">
          <span className="design-col-label">Group Color</span>
          {isEditing ? (
            <div className="grp-color">
              {colorOptions.map((color) => {
                return (
                  <div
                    key={color}
                    className={`gp-color-placeHolder ${selectedColor === color && "selected-color"}`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setSelectedColor(color);
                      setChangeData({ ...changeData, color: color });
                    }}
                  ></div>
                );
              })}
            </div>
          ) : (
            <div
              className="gp-color-placeHolder"
              style={{ backgroundColor: groupData?.color }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}
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
function GroupGeneralSettings({
  groupData,
  isEditing,
  changeData,
  setChangeData,
}) {
  const [toggleSetting, setToggleSetting] = useState("");
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
                onClick={() => {
                  setToggleSetting(set.activated);
                  set.onClick();
                }}
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
export default GroupSettingsPage;
