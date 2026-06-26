import { Contact, SearchAlert, User } from "lucide-react";
import { socialBaseUrls } from "../../data/ProfileData";

function ProfileFooter({ userContacts, isEditing, changeData, setChangeData }) {
  return (
    <>
      <div className="profile-footer">
        <div className="about-user">
          <div>
            <div className="about-align">
              <User /> About Me{" "}
            </div>
            <p className="bio-counter">
              {isEditing && changeData["bio"]?.length + " / 500"}
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
    </>
  );
}

export default ProfileFooter;
