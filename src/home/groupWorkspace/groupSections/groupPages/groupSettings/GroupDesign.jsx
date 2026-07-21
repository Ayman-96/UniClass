import { useState } from "react";
import { HiMiniUserGroup } from "react-icons/hi2";
import { Camera, ImageIcon, InspectionPanel } from "lucide-react";
import { toast } from "sonner";

function GroupDesign({
  groupData,
  isEditing,
  changeData,
  setChangeData,
  setTempAvatar,
  setTempBanner,
}) {
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
              onChange={(e) => {
                setChangeData({ ...changeData, avatarFile: e.target.files[0] });
                setTempAvatar(e.target.files[0]);
                toast.message("Updating...");
              }}
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
              onChange={(e) => {
                setChangeData({ ...changeData, bannerFile: e.target.files[0] });
                setTempBanner(e.target.files[0]);
                toast.message("Updating...");
              }}
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
export default GroupDesign;
