import "./Profile.css";
import {
  ChevronLeft,
  CircleX,
  Contact,
  GraduationCap,
  Pencil,
  SearchAlert,
  Trash2,
  User,
  UserRoundPen,
} from "lucide-react";
import { fetchProfile, socialBaseUrls } from "../data/ProfileData";
import { useProfile, useUpdateProfile } from "../hooks/useSaveProfile";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner.jsx";
import { uploadCommentImage } from "../hooks/useUploadImage";

function Profile({ userId }) {
  // HOOKS
  const { data: userInfo } = useProfile(userId);
  const { mutate: updateProfile, isError, isPending } = useUpdateProfile();

  // STATES
  const [changeData, setChangeData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [openRemoveList, setOpenRemoveList] = useState(false);

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
    {
      name: "Avatar",
      url: "avatar_url",
    },
    {
      name: "Background",
      url: "background_url",
    },
    {
      name: "Banner",
      url: "banner_url",
    },
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
          onChange={(e) => {
            handleBanner(e.target.files[0]);
          }}
        />
        <div className="pro-pic">
          <input
            id="avatar"
            type="file"
            hidden
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              handleAvatar(e.target.files[0]);
            }}
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
          <p>{userInfo?.full_name}</p>
          <p>{userInfo?.username}</p>
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
              onChange={(e) => {
                handleBackground(e.target.files[0]);
              }}
            />
          </div>
        )}
      </div>

      {isPending && <LoadingSpinner />}
      <div className="profile-body">
        <div className="body-header">
          <div className="left-col">
            <UserRoundPen /> Personal Information
          </div>
          <div className="right-col">
            <GraduationCap /> Academic Information
          </div>
        </div>
        <div className="profile-body-content">
          {personalInfoTable.map((info) => {
            return (
              <div className="user-information-table" key={info.label}>
                <div className="info-icon">{info.icon}</div>
                <div className="info-detail">
                  <p>{info.label}</p>
                  {isEditing ? (
                    info.type === "select" ? (
                      <select
                        name={info.label}
                        id={info.key}
                        value={changeData[info.key] || ""}
                        onChange={(e) =>
                          setChangeData((prev) => ({
                            ...prev,
                            [info.key]: e.target.value,
                          }))
                        }
                        className="editing-mode"
                      >
                        {info.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={info.type || "text"}
                        value={changeData[info.key] || ""}
                        onChange={(e) =>
                          setChangeData((prev) => ({
                            ...prev,
                            [info.key]: e.target.value,
                          }))
                        }
                        disabled={!isEditing || info.disabled}
                        className={`user-detail ${isEditing && "editing-mode"} `}
                      />
                    )
                  ) : (
                    <div className={`user-detail ${!info.value && "not-set"}`}>
                      {info.value || "Not Set"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="profile-footer">
          <div className="about-user">
            <div>
              <div className="about-align">
                <User /> About Me{" "}
              </div>
              <p className="bio-counter">
                {isEditing && changeData["bio"].length + " / 500"}
              </p>
            </div>
            <textarea
              type="text"
              value={changeData["bio"] || ""}
              onChange={(e) => {
                const text = e.target.value;
                const lines = text.split("\n");
                if (lines.length <= 6) {
                  setChangeData((prev) => ({
                    ...prev,
                    ["bio"]: text,
                  }));
                }
              }}
              maxLength={500}
              disabled={!isEditing}
              className={`user-detail user-bio ${isEditing ? "editing-mode" : ""}`}
            />
          </div>
        </div>
        <div className="user-contacts">
          <div>
            <Contact /> Contact & Socials
          </div>
          <div className="contacts-grid">
            {userContacts.map((info) => {
              return (
                <div className="user-contact-table" key={info.label}>
                  <div className="info-icon">{info.icon}</div>
                  <div className="info-detail">
                    <div className="label-warning">
                      <p>{info.label}</p>
                      <div className="alert-wrapper">
                        <SearchAlert />
                        <span className="tooltip">{info.warning || ""}</span>
                      </div>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={changeData[info.key] || ""}
                        onChange={(e) =>
                          setChangeData((prev) => ({
                            ...prev,
                            [info.key]: e.target.value,
                          }))
                        }
                        hidden={!isEditing}
                        disabled={!isEditing || info.disabled}
                        className="editing-mode"
                      />
                    ) : info.value ? (
                      <a
                        href={
                          info.key === "email"
                            ? `mailto:${info.value}`
                            : `${socialBaseUrls[info.key]}${info.value}`
                        }
                        target="_blank"
                        className="user-detail-link"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p>Not Set</p>
                    )}
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
export default Profile;
