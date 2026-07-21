import React, { useEffect, useMemo, useState } from "react";
import { CodeXml, FileCog, Wrench } from "lucide-react";
import { IoIosCreate } from "react-icons/io";
import { useIsRep } from "../../../../../hooks/useIsRep";

function GroupSettingsHeader({
  groupData,
  isEditing,
  handleEditSettings,
  changeData,
  setChangeData,
  handleSave,
  onCancel,
  tempAvatar,
  tempBanner,
  setTempAvatar,
  setTempBanner,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const previewAvatarUrl = useMemo(() => {
    if (!tempAvatar) return null;
    return URL.createObjectURL(tempAvatar);
  }, [tempAvatar]);

  const previewBannerUrl = useMemo(() => {
    if (!tempBanner) return null;
    return URL.createObjectURL(tempBanner);
  }, [tempBanner]);

  useEffect(() => {
    return () => {
      if (previewAvatarUrl) URL.revokeObjectURL(previewAvatarUrl);
      if (previewBannerUrl) URL.revokeObjectURL(previewBannerUrl);
    };
  }, [previewAvatarUrl, previewBannerUrl]);

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

  const { data: amIRep } = useIsRep(groupData?.id);

  return (
    <div className="gp-info-container">
      {groupData?.banner_url && (
        <img
          className="grp-banner-img"
          src={previewBannerUrl || groupData.banner_url}
        />
      )}
      <div className="gp-avatar">
        <img
          src={previewAvatarUrl || groupData?.avatar_url}
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
                setTempAvatar(null);
                setTempBanner(null);
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
export default GroupSettingsHeader;
