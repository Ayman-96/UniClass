import { GraduationCap, UserRoundPen } from "lucide-react";

function ProfileBody({
  personalInfoTable,
  isEditing,
  changeData,
  setChangeData,
}) {
  return (
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
                          [info.key]:
                            info.key === "username"
                              ? e.target.value.replace(/\s/g, "")
                              : e.target.value,
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
    </div>
  );
}

export default ProfileBody;
