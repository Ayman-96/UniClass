import "./Profile.css";
import ProfileBody from "./ProfileBody";
import { useEffect, useMemo, useState } from "react";
import ProfileFooter from "./ProfileFooter";
import ProfileHeader from "./ProfileHeader";
import { fetchProfile } from "../../data/ProfileData";
import { useProfile, useUpdateProfile } from "../../hooks/useSaveProfile";
import { uploadCommentImage } from "../../hooks/useUploadImage";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner.jsx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function Profile() {
  const { userId } = useParams();
  // HOOKS
  const { data: userInfo } = useProfile(userId);
  const { mutateAsync: updateProfile, isError, isPending } = useUpdateProfile();

  // STATES
  const [changeData, setChangeData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [tempBackground, setTempBackground] = useState(null);
  const [tempAvatar, setTempAvatar] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  // EFFECT
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (userInfo) setChangeData(userInfo);
  }, [userInfo]);

  // DERIVED / COMPUTED
  const { personalInfoTable, userContacts } = fetchProfile(userInfo);
  const hasAnyImage = Boolean(
    userInfo?.avatar_url || userInfo?.background_url || userInfo?.banner_url,
  );
  const previewBackgroundUrl = useMemo(() => {
    if (!tempBackground) return null;
    return URL.createObjectURL(tempBackground);
  }, [tempBackground]);

  // CONSTANT
  const imagesList = [
    { name: "Avatar", url: "avatar_url" },
    { name: "Background", url: "background_url" },
    { name: "Banner", url: "banner_url" },
  ];

  // FUNCTIONS
  function handleEditProfile() {
    setIsEditing((prev) => !prev);
  }

  async function handleSaveProfile(avatar, banner, bg) {
    const toastId = toast.loading("Updating Profile");
    setIsSaving(true);
    try {
      const avatarUrl = avatar
        ? await uploadCommentImage(avatar, "avatars", userInfo.id)
        : null;
      const bannerUrl = banner
        ? await uploadCommentImage(banner, "banners", userInfo.id)
        : null;
      const bgUrl = bg
        ? await uploadCommentImage(bg, "backgrounds", userInfo.id)
        : null;

      await updateProfile({
        userId: userInfo.id,
        updates: {
          ...changeData,
          avatar_url: avatar ? avatarUrl : userInfo?.avatar_url,
          banner_url: banner ? bannerUrl : userInfo?.banner_url,
          background_url: bg ? bgUrl : userInfo?.background_url,
        },
      });

      toast.success("Profile Updated Successfully", { id: toastId });
    } catch (error) {
      console.error("Save profile failed:", error);
      toast.error("Failed to update profile", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  }

  function handleRemoveImg(imgUrl) {
    updateProfile({ userId: userInfo.id, updates: { [imgUrl]: null } });
  }

  if (isError) return <div>Error occured. try again later</div>;

  return (
    <div className="user-profile">
      {userInfo?.background_url && (
        <img
          className="background-img"
          src={previewBackgroundUrl || userInfo.background_url}
        />
      )}

      <ProfileHeader
        userId={userId}
        userInfo={userInfo}
        isEditing={isEditing}
        isPending={isPending}
        changeData={changeData}
        imagesList={imagesList}
        hasAnyImage={hasAnyImage}
        setChangeData={setChangeData}
        handleRemoveImg={handleRemoveImg}
        handleEditProfile={handleEditProfile}
        handleSaveProfile={handleSaveProfile}
        previewBackgroundUrl={previewBackgroundUrl}
        setTempBackground={setTempBackground}
        tempBackground={tempBackground}
        setIsEditing={setIsEditing}
        tempAvatar={tempAvatar}
        setTempAvatar={setTempAvatar}
        isSaving={isSaving}
      />

      {isPending && <LoadingSpinner />}

      <ProfileBody
        isEditing={isEditing}
        changeData={changeData}
        setChangeData={setChangeData}
        personalInfoTable={personalInfoTable}
      />

      <ProfileFooter
        isEditing={isEditing}
        changeData={changeData}
        userContacts={userContacts}
        setChangeData={setChangeData}
      />
    </div>
  );
}

export default Profile;
