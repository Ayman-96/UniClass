import "./OnBoarding.css";
import {
  Building2,
  CalendarFold,
  CheckCircle,
  CircleArrowLeft,
  GraduationCap,
  Mars,
  PersonStanding,
  University,
  User,
  UserRound,
  UserRoundPen,
  VenusIcon,
} from "lucide-react";
import { useSaveProfile } from "../hooks/useSaveProfile";
import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";
import { toast } from "sonner";
import OnboardingTour from "../components/OnboardingTour"; // adjust path to wherever you put it

const userData = {
  fullName: "",
  username: "",
  avatar: "",
  dob: "",
  gender: "male",
  college: null,
  city: null,
  stage: null,
  role: "student",
  dep: null,
};
function profileReducer(state, action) {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_NAME":
      return { ...state, fullName: action.payload };
    case "SET_USER_NAME":
      return { ...state, username: action.payload };
    case "SET_AVATAR":
      return { ...state, avatar: action.payload };
    case "SET_DOB":
      return { ...state, dob: action.payload };
    case "SET_GENDER":
      return { ...state, gender: action.payload };
    case "SET_COLLEGE":
      return { ...state, college: action.payload };
    case "SET_CITY":
      return { ...state, city: action.payload };
    case "SET_STAGE":
      return { ...state, stage: action.payload };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_DEP":
      return { ...state, dep: action.payload };
    case "RESET":
      return userData;

    default:
      return state;
  }
}
function OnBoarding() {
  const [error, setError] = useState(null);
  const [showTour, setShowTour] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { mutate: saveProfile, isLoading, isError } = useSaveProfile();
  const [newProfile, dispatch] = useReducer(profileReducer, userData);

  function handleSetProfile() {
    if (
      !newProfile.fullName ||
      !newProfile.username ||
      !newProfile.dob ||
      !newProfile.gender ||
      !newProfile.role
    ) {
      setError("Please Fill All The Required Fields");
      return;
    }
    saveProfile(
      {
        full_name: newProfile.fullName,
        username: newProfile.username,
        avatar: newProfile.avatar,
        gender: newProfile.gender,
        dob: newProfile.dob,
        city: newProfile.city,
        college: newProfile.college,
        department: newProfile.dep,
        role: newProfile.role,
        stage: newProfile.stage,
      },
      {
        onSuccess: () => {
          toast.success("Welcome to UniClass!");
          setShowTour(true);
        },
        onError: (err) => setError(err.message),
      },
    );
  }
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error Occured...</div>;
  return (
    <>
      <div className="onboarding-overlay">
        {error && <p className="error-msg">{error}</p>}
        <div className="onboarding-header">
          <div
            className="steps-bar"
            style={{ "--progress": `${(step / 3) * 100}%` }}
          ></div>
          <div className="steps-count">Step {step} of 3</div>
          <div className="step-title">
            <h1>
              {step === 1
                ? "Tell Us About Yourself"
                : step === 2
                  ? "Where Do You Study?"
                  : "You're All Set!"}
            </h1>
            <p>
              {" "}
              {step === 1
                ? "Introduce Yourself to UniClass!"
                : step === 2
                  ? "Let Others Know Your Current Career"
                  : "Your Profile is Ready to GO!"}
            </p>
          </div>
        </div>

        <div className="onboarding-body">
          {step === 1 ? (
            <PersonalInfo dispatch={dispatch} />
          ) : step === 2 ? (
            <AcademicCareer dispatch={dispatch} />
          ) : (
            <AllSet dispatch={dispatch} newProfile={newProfile} />
          )}
        </div>

        <div className="oboarding-footer">
          <div className="onboarding-btns">
            {step > 1 && (
              <button
                onClick={() => {
                  setStep((prev) => prev - 1);
                  setError(null);
                }}
              >
                <CircleArrowLeft />
              </button>
            )}
            <button
              onClick={
                step < 3 ? () => setStep((prev) => prev + 1) : handleSetProfile
              }
            >
              {step < 3 ? "Continue" : "Go to Dashboard"}
            </button>
          </div>
        </div>
      </div>
      {showTour && <OnboardingTour onFinish={() => navigate("/home")} />}
    </>
  );
}
export default OnBoarding;

function PersonalInfo({ dispatch }) {
  const [selectedGender, setSelectedGender] = useState("");
  const genders = [
    {
      name: "male",
      icon: <Mars />,
    },
    { name: "female", icon: <VenusIcon /> },
  ];
  return (
    <div className="where-study-container">
      <div className="user-input">
        <label htmlFor="email">
          Full Name <span className="required-fil">*</span>
        </label>
        <PersonStanding className="input-icon" />
        <input
          type="text"
          placeholder="A. B. C."
          onChange={(e) =>
            dispatch({ type: "SET_NAME", payload: e.target.value })
          }
        />
      </div>

      <div className="user-input">
        <label htmlFor="email">
          Username <span className="required-fil">*</span>
        </label>
        <UserRoundPen className="input-icon" />
        <input
          type="text"
          placeholder="Someone..."
          onChange={(e) => {
            const noSpaces = e.target.value.replace(/\s/g, "");
            dispatch({ type: "SET_USER_NAME", payload: noSpaces });
          }}
        />
      </div>

      <div className="user-input">
        <label htmlFor="date">
          Date of Birth <span className="required-fil">*</span>
        </label>
        <CalendarFold className="input-icon" />
        <input
          type="date"
          placeholder="mm/dd/yyyy"
          onChange={(e) =>
            dispatch({ type: "SET_DOB", payload: e.target.value })
          }
        />
      </div>

      <div className="user-input">
        <label htmlFor="gender">
          Gender <span className="required-fil">*</span>
        </label>
        <div className="gender-r">
          {genders.map((gender) => (
            <button
              key={gender.name}
              className={`ob-gender-btn ${
                selectedGender === gender.name
                  ? gender.name === "male"
                    ? "male-selected"
                    : "female-selected"
                  : ""
              }`}
              onClick={() => {
                dispatch({ type: "SET_GENDER", payload: gender.name });
                setSelectedGender(gender.name);
              }}
            >
              {gender.icon}
              {gender.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
function AcademicCareer({ dispatch }) {
  const stages = [
    {
      value: 1,
      year: "First Year",
    },
    {
      value: 2,
      year: "Second Year",
    },
    {
      value: 3,
      year: "3rd Year",
    },
    {
      value: 4,
      year: "4th Year",
    },
    {
      value: 5,
      year: "5th Year",
    },
    {
      value: 6,
      year: "6th Year",
    },
    {
      value: 7,
      year: "Graduated",
    },
  ];
  const roles = ["student", "lecturer", "professor", "doctor", "other"];
  return (
    <div className="academic-container">
      <div className="user-input">
        <label htmlFor="city">City</label>
        <Building2 className="input-icon" />
        <input
          type="text"
          placeholder="Hawler"
          onChange={(e) =>
            dispatch({ type: "SET_CITY", payload: e.target.value })
          }
        />
      </div>
      <div className="user-input">
        <label htmlFor="university">College/University</label>
        <University className="input-icon" />
        <input
          type="text"
          placeholder="College/University of ..."
          onChange={(e) =>
            dispatch({ type: "SET_COLLEGE", payload: e.target.value })
          }
        />
      </div>
      <div className="user-input">
        <label htmlFor="role">Role</label>
        <User className="input-icon" />
        <select
          name="stage"
          id="stage"
          onChange={(e) =>
            dispatch({ type: "SET_ROLE", payload: e.target.value })
          }
        >
          {roles.map((role) => {
            return (
              <option key={role} value={role}>
                {role}
              </option>
            );
          })}
        </select>
      </div>

      <div className="user-input">
        <label htmlFor="department">Department</label>
        <University className="input-icon" />
        <input
          type="text"
          placeholder="Computer Scince"
          onChange={(e) =>
            dispatch({ type: "SET_DEP", payload: e.target.value })
          }
        />
      </div>
      <div className="user-input">
        <label htmlFor="stage">Stage / Year</label>
        <GraduationCap className="input-icon" />
        <select
          name="stage"
          id="stage"
          onChange={(e) =>
            dispatch({ type: "SET_STAGE", payload: e.target.value })
          }
        >
          {stages.map((stage) => {
            return (
              <option key={stage.value} value={stage.value}>
                {stage.year}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
function AllSet({ dispatch, newProfile }) {
  const userInfo = [
    {
      label: "Username",
      value: newProfile.username,
    },
    {
      label: "Age",
      value: newProfile.dob,
    },
    {
      label: "gender",
      value: newProfile.gender,
    },
    { label: "student", value: newProfile.role },
    {
      label: "College / Uni",
      value: newProfile.college,
    },
    {
      label: "Department",
      value: newProfile.dep,
    },
  ];
  return (
    <div className="allset-container">
      <div className="allset-header">
        <div className="check-set">
          {newProfile.avatar ? (
            <img
              src={URL.createObjectURL(newProfile.avatar)}
              className="allset-avatar"
            />
          ) : (
            <CheckCircle />
          )}
        </div>
        <h1>You're All Set!</h1>
        <p>Your profile is ready. Let's get you into your classes.</p>

        {!newProfile.avatar && (
          <label className="avatar-upload">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                dispatch({ type: "SET_AVATAR", payload: e.target.files[0] })
              }
            />
            <span className="avatar-upload-icon">
              <UserRound size={16} />
            </span>
            <span className="avatar-upload-text">Add a profile photo</span>
          </label>
        )}
      </div>
      <div className="allset-collection">
        {userInfo?.map((info, i) => {
          return (
            <div className="set-info" key={i}>
              <div>{info?.label}</div>
              <div>{info?.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
