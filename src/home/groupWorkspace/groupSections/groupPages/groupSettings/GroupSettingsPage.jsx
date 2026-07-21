import "./Groupsettingspage.css";
import { useEffect, useState } from "react";
import {
  useDeleteGroup,
  useLeaveGroup,
  useSingleGroup,
  useUpdateGroupSettings,
} from "../../../../../hooks/useGroups";
import GroupDesign from "./GroupDesign";
import GroupManageAccess from "./GroupManageAccess";
import { Pen, Settings2, Trash2 } from "lucide-react";
import GroupSettingsHeader from "./GroupSettingsHeader";
import GroupGeneralSettings from "./GroupGeneralSettings";
import { useNavigate, useParams } from "react-router-dom";
import GroupPageHeader from "../../../GroupWorkspaceHeader";
import { useIsModerator } from "../../../../../hooks/useIsRep";
import { TbLogout2 } from "react-icons/tb";

function GroupSettingsPage() {
  const [tempAvatar, setTempAvatar] = useState(null);
  const [tempBanner, setTempBanner] = useState(null);

  const { groupId } = useParams();
  const navigate = useNavigate();
  const { data: groupData } = useSingleGroup(groupId);
  const [isEditing, setIsEdinig] = useState(false);
  const { mutate: updateGroup } = useUpdateGroupSettings(groupId);
  const [changeData, setChangeData] = useState(null);
  const { mutate: deleteGroup } = useDeleteGroup();
  const { data: amIMod } = useIsModerator(groupId);
  const { mutate: leaveGroup } = useLeaveGroup();

  useEffect(() => {
    if (groupData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
          tempAvatar={tempAvatar}
          tempBanner={tempBanner}
          setTempAvatar={setTempAvatar}
          setTempBanner={setTempBanner}
        />
        <GroupDesign
          groupData={groupData}
          isEditing={isEditing}
          changeData={changeData}
          setChangeData={setChangeData}
          setTempAvatar={setTempAvatar}
          setTempBanner={setTempBanner}
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
          {amIMod && (
            <button
              onClick={() => {
                (deleteGroup(groupId), navigate("/home"));
              }}
            >
              Delete Group
            </button>
          )}
        </div>
        <div className="leave-group">
          <div>
            <TbLogout2 /> Leave Group
          </div>
          <div>
            If you are no more interested with the group, you can leave it
            peacefully. This action cannot be undone!
          </div>

          {amIMod ? (
            <p>Moderator Can't Leave Group</p>
          ) : (
            <button
              onClick={() => {
                (leaveGroup(groupId), navigate("/home"));
              }}
            >
              Leave Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupSettingsPage;
