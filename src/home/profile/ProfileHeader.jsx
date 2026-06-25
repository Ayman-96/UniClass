import { ChevronLeft, CircleX, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

function ProfileHeader({
  userInfo,
  isEditing,
  changeData,
  imagesList,
  hasAnyImage,
  handleAvatar,
  handleBanner,
  setChangeData,
  handleRemoveImg,
  handleBackground,
  handleEditProfile,
  handleSaveProfile,
}) {
  const [openRemoveList, setOpenRemoveList] = useState(false);
  return (
    <div
      className="profile-header"
      onClick={(e) => {
        e.stopPropagation();
        if (isEditing) document.getElementById("banner").click();
      }}
    >
      <div
        className="remove-images"
        onMouseLeave={() => setOpenRemoveList(false)}
      >
        {isEditing &&
          hasAnyImage &&
          (!openRemoveList ? (
            <Trash2 onMouseEnter={() => setOpenRemoveList(true)} />
          ) : (
            <div className="remove-list" onClick={(e) => e.stopPropagation()}>
              {imagesList.map(
                (img) =>
                  userInfo?.[img.url] && (
                    <button
                      key={img.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImg(img.url);
                      }}
                    >
                      <div>
                        Remove {img.name}
                        <span>
                          <CircleX />
                        </span>
                      </div>
                    </button>
                  ),
              )}
              <ChevronLeft onClick={() => setOpenRemoveList(false)} />
            </div>
          ))}
      </div>

      {userInfo?.banner_url && (
        <img className="banner-img" src={userInfo.banner_url} />
      )}

      <input
        id="banner"
        type="file"
        hidden
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => handleBanner(e.target.files[0])}
      />

      <div className="pro-pic">
        <input
          id="avatar"
          type="file"
          hidden
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleAvatar(e.target.files[0])}
        />
        <button
          className={`${isEditing && "editing-avatar"}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isEditing) document.getElementById("avatar").click();
          }}
        >
          {userInfo?.avatar_url && <img src={userInfo.avatar_url} />}
        </button>
      </div>

      <div className="user-initials">
        <div className="initial-fullname">
          <p style={{ color: changeData.fullname_color || "#1a2e27" }}>
            {userInfo?.full_name}
          </p>
          {isEditing && (
            <input
              type="color"
              value={changeData.fullname_color || "#1a2e27"}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                setChangeData((prev) => ({
                  ...prev,
                  fullname_color: e.target.value,
                }))
              }
            />
          )}
        </div>
        <div className="initial-username">
          <p style={{ color: changeData.username_color || "#1a9e78" }}>
            {userInfo?.username}
          </p>
          {isEditing && (
            <input
              type="color"
              value={changeData.username_color || "#1a9e78"}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                setChangeData((prev) => ({
                  ...prev,
                  username_color: e.target.value,
                }))
              }
            />
          )}
        </div>
      </div>

      {!isEditing ? (
        <button className="edit-profile-info" onClick={handleEditProfile}>
          <Pencil /> Edit Profile
        </button>
      ) : (
        <div className="edit-btns">
          <button
            className="save-profile-info"
            onClick={(e) => {
              e.stopPropagation();
              handleSaveProfile();
              handleEditProfile();
            }}
          >
            Save Changes
          </button>

          <button
            className="change-background-img"
            onClick={(e) => {
              e.stopPropagation();
              if (isEditing) document.getElementById("background").click();
            }}
          >
            Chage Background
          </button>

          <input
            id="background"
            type="file"
            hidden
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleBackground(e.target.files[0])}
          />
        </div>
      )}
    </div>
  );
}

export default ProfileHeader;
