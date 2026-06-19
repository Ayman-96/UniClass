import { useParams } from "react-router-dom";
import "./AddAnnounce.css";
import {
  CalendarFold,
  CalendarSync,
  FileUp,
  ImagePlus,
  Info,
  Link,
  Megaphone,
  Paperclip,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";
import { useReducer, useState } from "react";
import { useAddAnnounce } from "../../../hooks/useAnnounce";
import RequiredWarning from "./RequiredWarning";
import { useAuth } from "../../../AuthContext";
const announceAttachments = [
  {
    text: "File",
    icon: <Paperclip />,
  },
  {
    text: "Link",
    icon: <Link />,
  },
];
const announceTypes = [
  { name: "Schedule", component: <CalendarFold /> },
  { name: "Reschedule", component: <CalendarSync /> },
  { name: "Assignment", component: <FileUp /> },
  { name: "Urgnt", component: <TriangleAlert /> },
  { name: "General", component: <Info /> },
];

const announceData = {
  title: "",
  icon: "",
  content: "",
  imageFile: null,
};
function announceReducer(state, action) {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_ICON":
      return { ...state, icon: action.payload };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "ADD_IMAGE":
      return { ...state, imageFile: action.payload };
    case "RESET":
      return announceData;

    default:
      return state;
  }
}
function AddAnnounce({ handleAnnounceModal }) {
  const { user } = useAuth();
  const { groupId } = useParams();
  const [newAnnounce, dispatch] = useReducer(announceReducer, announceData);
  const { mutate: addAnnounce } = useAddAnnounce();
  const [fillWarning, setFillWarning] = useState(false);

  function handleSubmit() {
    if (!newAnnounce.title || !newAnnounce.content) {
      setFillWarning(true);
      return;
    }
    addAnnounce({
      group_id: groupId,
      rep_id: user.id,
      rep_name: user.user_metadata.username,
      title: newAnnounce.title,
      content: newAnnounce.content,
      icon: newAnnounce.icon,
      imageFile: newAnnounce.imageFile,
    });
    dispatch({ type: "RESET" });
    handleAnnounceModal();
  }
  return (
    <div className="add-post-overlay">
      <div className="add-post-modal">
        <div className="modal-header">
          <div>
            <Megaphone /> <span>New Announcement</span>
          </div>
          <button className="close-modal" onClick={handleAnnounceModal}>
            <X />
          </button>
        </div>

        <div className="post-modal-body">
          <div className="rep-info">
            <div className="rep-pro-pic">MN</div>
            <div className="rep-name">
              <p>Rep Name</p>
              <p>Rep • Group Name</p>
            </div>
          </div>

          <div className="add-announce-details">
            <label htmlFor="announceTitle">Title</label>
            <textarea
              rows={4}
              id="announcement"
              name="announceTitle"
              className="announcement-title"
              placeholder="e.g. Midterm exam rescheduled"
              onChange={(e) => {
                dispatch({ type: "SET_TITLE", payload: e.target.value });
              }}
            />
          </div>

          <div className="add-announce-details">
            <label htmlFor="announceType">Type</label>
            <div className="announce-types">
              {announceTypes.map((icon, i) => {
                return (
                  <div
                    key={i}
                    className="icon-opt"
                    title={icon.name}
                    onClick={() =>
                      dispatch({ type: "SET_ICON", payload: icon.component })
                    }
                  >
                    {icon.component}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="add-announcement-details">
            <label htmlFor="announcementContent">Content</label>
            <textarea
              rows={3}
              id="announceContent"
              name="announceContent"
              className="announcement-content"
              placeholder="Weite your announcement details..."
              onChange={(e) => {
                dispatch({ type: "SET_CONTENT", payload: e.target.value });
              }}
            />

            <div
              className="upload-img-announce"
              onClick={() => document.getElementById("announce-images").click()}
            >
              <input
                className="announce-img-btn"
                type="file"
                multiple
                accept="image/*"
                id="announce-images"
                hidden
                onChange={(e) => {
                  console.log(e.target.files);
                  dispatch({ type: "ADD_IMAGE", payload: e.target.files[0] });
                }}
              />
              <ImagePlus />
              <p>Click to Add Images</p>
              <p>PNG,JPG up to xMB each</p>
            </div>
          </div>

          <div className="announce-hint">
            <span>
              <ShieldCheck />
            </span>{" "}
            Only the Group Representative can Post Announcements.
          </div>
        </div>

        {fillWarning && <RequiredWarning />}

        <div className="announcement-footer">
          <div className="attach-buttons">
            {announceAttachments.map((attach) => {
              return (
                <button className="add-attach" key={attach.text}>
                  {attach.icon}
                  {attach.text}
                </button>
              );
            })}
          </div>

          <div className="announce-buttons">
            <button onClick={handleAnnounceModal}>Cancel</button>
            <button onClick={handleSubmit}>
              <Megaphone />
              Announce
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddAnnounce;
