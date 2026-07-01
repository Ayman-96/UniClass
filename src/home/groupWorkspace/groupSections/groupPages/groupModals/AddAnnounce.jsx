import "./AddAnnounce.css";
import { useParams } from "react-router-dom";
import {
  announceAttachments,
  announceTypes,
} from "../../../../../data/addAnnounceData";
import { useReducer, useState } from "react";
import RequiredWarning from "./RequiredWarning";
import { useAuth } from "../../../../../AuthContext";
import { useAddAnnounce } from "../../../../../hooks/useAnnounce";
import { useProfile } from "../../../../../hooks/useSaveProfile.js";
import { ImagePlus, Megaphone, ShieldCheck, X } from "lucide-react";
import { useSingleGroup } from "../../../../../hooks/useGroups.js";
import {
  formatFileSize,
  getFileStyle,
} from "../../../../../data/addCourseData.jsx";
import { toast } from "sonner";

const announceData = {
  title: "",
  icon: "",
  content: "",
  imageFile: null,
  files: [],
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
    case "REMOVE_IMAGE":
      return { ...state, imageFile: null };
    case "ADD_FILES":
      return {
        ...state,
        files: [...state.files, ...Array.from(action.payload)],
      };
    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter((f) => f !== action.payload),
      };

    case "RESET":
      return announceData;

    default:
      return state;
  }
}
function AddAnnounce({ handleAnnounceModal }) {
  const { user } = useAuth();
  const { groupId } = useParams();

  const [fillWarning, setFillWarning] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const { mutate: addAnnounce } = useAddAnnounce();
  const { data: myProfile } = useProfile();
  const { data: specifiedGroup } = useSingleGroup(groupId);
  const [newAnnounce, dispatch] = useReducer(announceReducer, announceData);

  function handleSubmit() {
    if (!newAnnounce.title && !newAnnounce.content) {
      setFillWarning(true);
      return;
    }
    addAnnounce({
      group_id: groupId,
      rep_id: user.id,
      title: newAnnounce.title,
      content: newAnnounce.content,
      icon: newAnnounce.icon,
      imageFile: newAnnounce.imageFile,
      files: newAnnounce.files,
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
            {myProfile?.avatar_url && (
              <img className="author-pro-pic" src={myProfile.avatar_url} />
            )}
            <div className="rep-name">
              <p>{myProfile?.username}</p>
              <p>
                Rep •{" "}
                <span style={{ color: specifiedGroup?.color }}>
                  {specifiedGroup?.name}
                </span>
              </p>
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
                    className={`icon-opt ${selectedIcon === i ? "selected-icon" : ""}`}
                    onClick={() => {
                      (dispatch({ type: "SET_ICON", payload: i }),
                        setSelectedIcon(i));
                    }}
                  >
                    {icon}
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
                  dispatch({ type: "ADD_IMAGE", payload: e.target.files[0] });
                }}
              />
              {newAnnounce.imageFile ? (
                <div
                  className="added-image-post"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={URL.createObjectURL(newAnnounce.imageFile)} />
                  <button
                    className="remove-img"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: "REMOVE_IMAGE" });
                    }}
                  >
                    <X />
                  </button>
                </div>
              ) : (
                <div>
                  <ImagePlus />
                  <p>Click to upload images</p>
                  <p>PNG,JPG up to 5MB each</p>
                </div>
              )}
            </div>
            <div className="post-files">
              {newAnnounce.files?.map((file) => {
                const { icon: Icon, bg, color } = getFileStyle(file.type);
                return (
                  <div key={file.lastModified} className="file-attachement">
                    <div
                      className="file-icon"
                      style={{ background: bg, color }}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="file-attach-details">
                      <div>{file.name}</div>
                      <p>{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      className="remove-file"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch({ type: "REMOVE_FILE", payload: file });
                      }}
                    >
                      <X />
                    </button>
                  </div>
                );
              })}
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
                <button
                  className="add-attach"
                  key={attach.text}
                  onClick={() => {
                    attach.text === "File" &&
                      document.getElementById("files").click();
                  }}
                >
                  {attach.icon}
                  {attach.text}
                </button>
              );
            })}
          </div>
          <input
            type="file"
            hidden
            multiple
            id="files"
            onChange={(e) => {
              const selected = Array.from(e.target.files);
              const total = newAnnounce.files?.length + selected?.length;
              if (total > 10) {
                toast.error("Max 10 files per post");
                return;
              }
              const oversized = selected.find(
                (file) => file.size > 20 * 1024 * 1024,
              );
              if (oversized) {
                toast.error(`${oversized.name} exceeds 20MB`);
                return;
              }
              dispatch({ type: "ADD_FILES", payload: e.target.files });
            }}
          />
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
