import "./AddAnnounce.css";
import { useParams } from "react-router-dom";
import { announceTypes } from "../../../../../data/addAnnounceData";
import { useReducer, useState } from "react";
import RequiredWarning from "./RequiredWarning";
import { useAuth } from "../../../../../AuthContext";
import { useAddAnnounce } from "../../../../../hooks/useAnnounce";
import { useProfile } from "../../../../../hooks/useSaveProfile.js";
import {
  AtSign,
  ImagePlus,
  Megaphone,
  Paperclip,
  ShieldCheck,
  X,
} from "lucide-react";
import { useSingleGroup } from "../../../../../hooks/useGroups.js";
import {
  formatFileSize,
  getFileStyle,
} from "../../../../../data/addCourseData.jsx";
import { toast } from "sonner";
import { useGroupMembers } from "../../../../../hooks/useGroupMembers.js";

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
    case "ADD_MENTION": {
      const needsSpace = state.content !== "" && !state.content.endsWith(" ");
      return {
        ...state,
        content: state.content + (needsSpace ? " " : "") + "@",
      };
    }

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
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");

  const { mutate: addAnnounce } = useAddAnnounce();
  const { data: myProfile } = useProfile();
  const { data: specifiedGroup } = useSingleGroup(groupId);
  const { data: members = [] } = useGroupMembers(groupId);
  const filteredMembers = members?.filter((m) =>
    m.profiles?.username?.toLowerCase().includes(mentionFilter.toLowerCase()),
  );

  const [newAnnounce, dispatch] = useReducer(announceReducer, announceData);

  function handleSubmit() {
    if (!newAnnounce.title) {
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

  function handleMentionButtonClick() {
    dispatch({ type: "ADD_MENTION" });
    setShowMentions(true);
    setMentionFilter("");
  }
  function handleSelectMention(member) {
    const updatedContent = newAnnounce.content?.replace(
      /@[\w-]*$/,
      `@[${member.profiles.username}](${member.user_id}) `,
    );
    dispatch({ type: "SET_CONTENT", payload: updatedContent });
    setShowMentions(false);
    setMentionFilter("");
  }

  const announceAttachments = [
    {
      text: "File",
      icon: <Paperclip />,
      onClick: () => document.getElementById("files").click(),
    },
    {
      text: "Mention",
      icon: <AtSign />,
      onClick: () => handleMentionButtonClick(),
    },
  ];
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
              value={newAnnounce.content}
              className="announcement-content"
              placeholder="Weite your announcement details..."
              onChange={(e) => {
                dispatch({ type: "SET_CONTENT", payload: e.target.value });
              }}
            />
            {showMentions && (
              <div className="mention-dropdown">
                <input
                  type="text"
                  className="mention-filter-input"
                  placeholder="Search member..."
                  value={mentionFilter}
                  onChange={(e) => setMentionFilter(e.target.value)}
                  autoFocus
                />
                {filteredMembers?.map((member) => {
                  return (
                    <button
                      key={member.user_id}
                      type="button"
                      onClick={() => handleSelectMention(member)}
                    >
                      {member.profiles?.username || ""}
                    </button>
                  );
                })}
              </div>
            )}
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
              {newAnnounce.files?.map((file, i) => {
                const { icon: Icon, bg, color } = getFileStyle(file.type);
                return (
                  <div key={i} className="file-attachement">
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
                  onClick={() => attach.onClick()}
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
