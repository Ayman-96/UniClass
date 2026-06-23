import "./Profile.css";
import {
  Contact,
  GraduationCap,
  Pencil,
  SearchAlert,
  User,
  UserRoundPen,
} from "lucide-react";
import { fetchProfile, socialBaseUrls } from "../data/ProfileData";
import { useProfile, useUpdateProfile } from "../hooks/useSaveProfile";
import { useEffect, useState } from "react";

function Profile({ userId }) {
  const { data: userInfo } = useProfile(userId);

  const { personalInfoTable, userContacts } = fetchProfile(userInfo);

  const [isEditing, setIsEditing] = useState(false);
  const [changeData, setChangeData] = useState({});

  useEffect(() => {
    if (userInfo) setChangeData(userInfo);
  }, [userInfo]);

  const { mutate: updateProfile } = useUpdateProfile();
  function handleEditProfile() {
    setIsEditing((prev) => !prev);
  }
  function handleSaveProfile() {
    updateProfile({ userId: userInfo.id, updates: changeData });
  }
  return (
    <div className="user-profile">
      <img className="background-img" />

      <div className="profile-header">
        <div className="pro-pic">
          <button>
            <img />
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
          <button
            className="save-profile-info"
            onClick={() => {
              handleSaveProfile();
              handleEditProfile();
            }}
          >
            Save Changes
          </button>
        )}
      </div>

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
