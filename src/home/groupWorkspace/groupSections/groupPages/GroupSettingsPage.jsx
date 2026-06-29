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
import { useState } from "react";
import { useSingleGroup } from "../../../../hooks/useGroups";
import { useParams } from "react-router-dom";
import { useIsRep } from "../../../../hooks/useIsRep";
import { IoIosCreate } from "react-icons/io";
import { RiGroup2Fill } from "react-icons/ri";
import { MdOutgoingMail } from "react-icons/md";
import { BsPostcardHeart } from "react-icons/bs";
import { FaRegCircleDot } from "react-icons/fa6";
// import { PiToggleLeftLight, PiToggleRightFill } from "react-icons/pi";

function GroupSettingsPage() {
  const { groupId } = useParams();
  const { data: groupData } = useSingleGroup(groupId);
  const [isEditing, setIsEdinig] = useState(false);

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
        />
        <GroupDesign groupData={groupData} isEditing={isEditing} />

        <GroupManageAccess groupData={groupData} />

        <GroupGeneralSettings isEditing={isEditing} />
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
          <button>Delete Group</button>
        </div>
      </div>
    </div>
  );
}

function GroupSettingsHeader({ groupData, isEditing, handleEditSettings }) {
  const { data: amIRep } = useIsRep(groupData?.id);
  console.log(groupData);
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
      <div className="gp-avatar">
        <img src={groupData?.avatar} />
      </div>

      <div className="gp-info">
        <div className="gp-info-top-row">
          <p>
            {groupData?.name} <span>Access</span>
          </p>
          {amIRep && (
            <button className="edit-settings-btn" onClick={handleEditSettings}>
              {isEditing ? (
                <>
                  <FileCog /> Save Changes{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Wrench /> Edit Group Settings
                </>
              )}
            </button>
          )}
        </div>
        <div className="gp-description">
          <input
            type="text"
            id="description"
            disabled={!isEditing}
            className={isEditing ? "editing-desc" : ""}
          />
          <div className="gp-unchangable-data">
            {unchangableData.map((data) => {
              return (
                <div className="unchange-datas" key={data.label}>
                  <div>{data.icon}</div>
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
function GroupDesign({ groupData, isEditing }) {
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
              //   onChange={(e) => handleAvatar(e.target.files[0])}
            />
            <button
              className={`${isEditing ? "editing-grp-avatar" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing) document.getElementById("group-avatar").click();
              }}
            >
              {groupData?.avatar ? (
                <img src={groupData?.avatar} />
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
              //   onChange={(e) => handleAvatar(e.target.files[0])}
            />
            <button
              className={`${isEditing ? "editing-grp-avatar" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing) document.getElementById("group-cover").click();
              }}
            >
              {groupData?.cover ? (
                <img src={groupData.cover} />
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
          <div className="grp-color">
            {colorOptions.map((color) => {
              return (
                <div
                  key={color}
                  className={`gp-color-placeHolder ${selectedColor === color && "selected-color"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    isEditing ? setSelectedColor(color) : "";
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
function GroupManageAccess({ groupData }) {
  const [selectedAccess, setSelectedAccess] = useState(groupData?.access_type);
  const accessOptions = [
    {
      label: "Open",
      icon: <DoorOpen />,
      desc: "Anyone can find and join the group.",
    },
    {
      label: "Invite Only",
      icon: <MdOutgoingMail />,
      desc: "Only people with an invite can join.",
    },
    {
      label: "Closed",
      icon: <DoorClosedLocked />,
      desc: "Only representatives allowed to invite.",
    },
  ];
  return (
    <div className="gp-manage-access">
      <p>Manage Access</p>
      <p>Control who can join your group</p>
      <div className="access-options">
        {accessOptions.map((opt) => {
          return (
            <div
              className={`acc-opt ${selectedAccess === opt.label ? "selected" : ""}`}
              onClick={() => {
                setSelectedAccess(opt.label);
              }}
            >
              <div className="acc-opt-title">
                <div>
                  {opt.icon} {opt.label}
                </div>
                <div>
                  {selectedAccess === opt.label ? (
                    <FaRegCircleDot />
                  ) : (
                    <Circle />
                  )}
                </div>
              </div>
              <div className="acc-opt-desc">{opt.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function GroupGeneralSettings({ isEditing }) {
  const [toggleSetting, setToggleSetting] = useState("");
  console.log(toggleSetting);
  const settings = [
    {
      label: "Allow members to post",
      icon: <BsPostcardHeart />,
      desc: "Members can create posts and discussions.",
      activated: false,
      onClick: () => "",
    },
    {
      label: "Require admin approval for new members",
      icon: <ShieldAlert />,
      desc: "New members need to be approved before joining.",
      activated: false,
      onClick: () => "",
    },
  ];
  return (
    <div className="gp-general-st">
      <p>General Settings</p>
      <p>Configure permissions ans groyp behavior.</p>
      <div className="general-settings-opt">
        {settings.map((set) => {
          return (
            <div className="set-opt">
              <div className="setting-left-col">
                <div className="setting-icon-wrap">{set.icon}</div>
                <div>
                  <p>{set.label}</p>
                  <p>{set.desc}</p>
                </div>
              </div>
              {isEditing && (
                <button
                  className={`toggle-btn ${set.activated ? "activated-toggle" : ""}`}
                  onClick={() => setToggleSetting(set.label)}
                ></button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default GroupSettingsPage;
