import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  CircleX,
  Pencil,
  Trash2,
  UserCheck2,
  UserPlus2,
} from "lucide-react";
import {
  useFriendshipStatuses,
  useSendFriendRequest,
} from "../../hooks/useFriends";
import { LiaHourglassHalfSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { LuCircleArrowOutUpLeft } from "react-icons/lu";
import { useAuth } from "../../AuthContext";
import useLightboxStore from "../../store/useLightboxStore";
import { toast } from "sonner";

function ProfileHeader({
  userId,
  userInfo,
  isEditing,
  isPending,
  changeData,
  imagesList,
  hasAnyImage,
  setChangeData,
  handleRemoveImg,
  handleEditProfile,
  handleSaveProfile,
  previewBackgroundUrl,
  setTempBackground,
  tempBackground,
  setIsEditing,
  tempAvatar,
  setTempAvatar,
  isSaving,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tempBanner, setTempBanner] = useState(null);

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
      if (previewBackgroundUrl) URL.revokeObjectURL(previewBackgroundUrl);
    };
  }, [previewAvatarUrl, previewBannerUrl, previewBackgroundUrl]);

  function handleCancelChanges() {
    setChangeData({});
    setTempAvatar(null);
    setTempBanner(null);
    setTempBackground(null);
    setIsEditing(false);
    toast.warning("Changes Discarded");
  }
  const { data: friendStatus } = useFriendshipStatuses(userId ? [userId] : []);
  const [openRemoveList, setOpenRemoveList] = useState(false);
  const { mutate: sendRequest } = useSendFriendRequest();

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
        {isEditing && (!userId || userId === user?.id) ? (
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
          ))
        ) : (
          <button onClick={() => navigate(-1)} className="leave-profile">
            <LuCircleArrowOutUpLeft />
          </button>
        )}
      </div>

      {userInfo?.banner_url && (
        <img
          className="banner-img"
          src={previewBannerUrl || userInfo?.banner_url}
          onClick={() => {
            if (!isEditing)
              useLightboxStore.getState().openLightbox(userInfo.banner_url);
          }}
        />
      )}

      <input
        id="banner"
        type="file"
        hidden
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          setTempBanner(e.target.files[0]);
        }}
      />

      <div className="pro-pic">
        <input
          id="avatar"
          type="file"
          hidden
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            setTempAvatar(e.target.files[0]);
          }}
        />
        <button
          className={`${isEditing && "editing-avatar"}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isEditing) document.getElementById("avatar").click();
            else useLightboxStore.getState().openLightbox(userInfo?.avatar_url);
          }}
        >
          {userInfo?.avatar_url && (
            <img src={previewAvatarUrl || userInfo?.avatar_url} />
          )}
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

      {!userId || userId === user?.id ? (
        !isEditing ? (
          <button className="edit-profile-info" onClick={handleEditProfile}>
            <Pencil /> Edit Profile
          </button>
        ) : (
          <div className="edit-btns">
            <button
              className="save-profile-info"
              disabled={isSaving}
              onClick={async (e) => {
                e.stopPropagation();
                await handleSaveProfile(tempAvatar, tempBanner, tempBackground);
                handleEditProfile();
              }}
            >
              {isPending ? "Hold on..." : " Save Changes"}
            </button>
            <button
              className="cancel-profile-changes"
              disabled={isSaving}
              onClick={(e) => {
                e.stopPropagation();
                handleCancelChanges();
              }}
            >
              {isPending ? "Hold on..." : "Cancel Changes"}
            </button>

            <button
              className="change-banner-img"
              disabled={isSaving}
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing) document.getElementById("banner").click();
              }}
            >
              Chage banner
            </button>

            <button
              className="change-background-img"
              disabled={isSaving}
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
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                setTempBackground(e.target.files[0]);
              }}
            />
          </div>
        )
      ) : friendStatus?.[userId]?.status === "accepted" ? (
        <p className="friendship-stat accepted">
          Friend <UserCheck2 />
        </p>
      ) : friendStatus?.[userId]?.status === "pending" ? (
        <p className="friendship-stat pending">
          Pending <LiaHourglassHalfSolid />
        </p>
      ) : (
        <button
          className="friendship-stat add"
          onClick={(e) => {
            e.stopPropagation();
            sendRequest(userId);
          }}
        >
          Send Friend Request
          <UserPlus2 />
        </button>
      )}
    </div>
  );
}

export default ProfileHeader;
