import "./Profile.css";
import ProfileBody from "./ProfileBody";
import { useEffect, useState } from "react";
import ProfileFooter from "./ProfileFooter";
import ProfileHeader from "./ProfileHeader";
import { fetchProfile } from "../../data/ProfileData";
import { useProfile, useUpdateProfile } from "../../hooks/useSaveProfile";
import { uploadCommentImage } from "../../hooks/useUploadImage";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner.jsx";
import { useParams } from "react-router-dom";

function Profile() {
  const { userId } = useParams();
  // HOOKS
  const { data: userInfo } = useProfile(userId);
  const { mutate: updateProfile, isError, isPending } = useUpdateProfile();

  // STATES
  const [changeData, setChangeData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // EFFECT
  useEffect(() => {
    if (userInfo) setChangeData(userInfo);
  }, [userInfo]);

  // DERIVED / COMPUTED
  const { personalInfoTable, userContacts } = fetchProfile(userInfo);
  const hasAnyImage = Boolean(
    userInfo?.avatar_url || userInfo?.background_url || userInfo?.banner_url,
  );

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
  function handleSaveProfile() {
    updateProfile({ userId: userInfo.id, updates: changeData });
  }
  async function handleAvatar(file) {
    const avatarUrl = await uploadCommentImage(file, "avatars", userInfo.id);
    updateProfile({ userId: userInfo.id, updates: { avatar_url: avatarUrl } });
  }
  async function handleBackground(file) {
    const bgUrl = await uploadCommentImage(file, "backgrounds", userInfo.id);
    updateProfile({ userId: userInfo.id, updates: { background_url: bgUrl } });
  }
  async function handleBanner(file) {
    const bannerUrl = await uploadCommentImage(file, "banners", userInfo.id);
    updateProfile({ userId: userInfo.id, updates: { banner_url: bannerUrl } });
  }
  function handleRemoveImg(imgUrl) {
    updateProfile({ userId: userInfo.id, updates: { [imgUrl]: null } });
  }

  if (isError) return <div>Error occured. try again later</div>;

  return (
    <div className="user-profile">
      {userInfo?.background_url && (
        <img className="background-img" src={userInfo.background_url} />
      )}

      <ProfileHeader
        userId={userId}
        userInfo={userInfo}
        isEditing={isEditing}
        isPending={isPending}
        changeData={changeData}
        imagesList={imagesList}
        hasAnyImage={hasAnyImage}
        handleAvatar={handleAvatar}
        handleBanner={handleBanner}
        setChangeData={setChangeData}
        handleRemoveImg={handleRemoveImg}
        handleBackground={handleBackground}
        handleEditProfile={handleEditProfile}
        handleSaveProfile={handleSaveProfile}
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
