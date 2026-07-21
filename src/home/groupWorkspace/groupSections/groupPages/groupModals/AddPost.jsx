import "./AddPost.css";
import {
  AtSign,
  ImagePlus,
  Link,
  MessageSquarePlus,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import RequiredWarning from "./RequiredWarning";
import { useAuth } from "../../../../../AuthContext.jsx";
import { useAddPost } from "../../../../../hooks/usePosts";
import { useProfile } from "../../../../../hooks/useSaveProfile.js";
import { useSingleGroup } from "../../../../../hooks/useGroups.js";
import { toast } from "sonner";
import {
  formatFileSize,
  getFileStyle,
} from "../../../../../data/addCourseData.jsx";
import { useGroupMembers } from "../../../../../hooks/useGroupMembers.js";

const postData = {
  author_name: "",
  author_badge: "",
  content: "",
  imageFile: null,
  files: [],
};

function postReducer(state, action) {
  switch (action.type) {
    case "ADD_CONTENT":
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
      return postData;

    default:
      return state;
  }
}
function AddPost({ handlePostModal }) {
  const { user } = useAuth();
  const { groupId } = useParams();

  const [fillWarning, setFillWarning] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");

  const { mutate: addPost } = useAddPost();
  const { data: myProfile } = useProfile();
  const { data: specifiedGroup } = useSingleGroup(groupId);

  const { data: members = [] } = useGroupMembers(groupId);
  const filteredMembers = members?.filter((m) =>
    m.profiles?.username?.toLowerCase().includes(mentionFilter.toLowerCase()),
  );
  const [newPost, dispatch] = useReducer(postReducer, postData);

  function handleSubmit() {
    if (!newPost.content && !newPost.imageFile) {
      setFillWarning(true);
      return;
    }
    addPost({
      group_id: groupId,
      author_id: user.id,
      content: newPost.content,
      imageFile: newPost.imageFile,
      files: newPost.files,
    });
    dispatch({ type: "RESET" });
    handlePostModal();
  }

  function handleMentionButtonClick() {
    dispatch({ type: "ADD_MENTION" });
    setShowMentions(true);
    setMentionFilter("");
  }
  function handleSelectMention(member) {
    const updatedContent = newPost.content?.replace(
      /@[\w-]*$/,
      `@[${member.profiles.username}](${member.user_id}) `,
    );
    dispatch({ type: "ADD_CONTENT", payload: updatedContent });
    setShowMentions(false);
    setMentionFilter("");
  }
  const postAttachments = [
    {
      id: "files",
      text: "Attach File",
      icon: <Paperclip />,
      onClick: () => document.getElementById("files").click(),
    },
    {
      id: "tags",
      text: "Mention",
      icon: <AtSign />,
      onClick: () => handleMentionButtonClick(),
    },
  ];
  return (
    <div className="add-post-overlay">
      <div className="add-post-modal">
        <div className="post-modal-header">
          <div>
            <MessageSquarePlus /> <span>Add New Post</span>
          </div>
          <button className="close-modal" onClick={handlePostModal}>
            <X />
          </button>
        </div>

        <div className="post-modal-body">
          <div className="author-info">
            {myProfile?.avatar_url && (
              <img src={myProfile.avatar_url} className="author-pro-pic" />
            )}
            <div className="author-name">
              <p>{myProfile?.username}</p>
              <p>
                {specifiedGroup?.name} •{" "}
                <span style={{ color: specifiedGroup?.color }}>
                  {myProfile?.role}
                </span>
              </p>
            </div>
          </div>

          <div className="post-text-area">
            <textarea
              rows={4}
              id="postText"
              name="postText"
              maxLength={999}
              value={newPost.content}
              placeholder="Share Something with Your Groupmates! :)"
              onChange={(e) =>
                dispatch({ type: "ADD_CONTENT", payload: e.target.value })
              }
            ></textarea>
            <div className="mention-dropdown-container">
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
                  {filteredMembers?.map((member) => (
                    <button
                      key={member.user_id}
                      type="button"
                      onClick={() => handleSelectMention(member)}
                    >
                      {member.profiles?.username || ""}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="post-attachments-area">
          <div
            className="upload-img-post"
            onClick={() => document.getElementById("post-images").click()}
          >
            <input
              className="post-img-btn"
              type="file"
              multiple
              accept="image/*"
              id="post-images"
              hidden
              onChange={(e) => {
                dispatch({ type: "ADD_IMAGE", payload: e.target.files[0] });
              }}
            />
            {newPost.imageFile ? (
              <div
                className="added-image-post"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={URL.createObjectURL(newPost.imageFile)} />
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
            {newPost.files?.map((file) => {
              const { icon: Icon, bg, color } = getFileStyle(file.type);
              return (
                <div key={file.lastModified} className="file-attachement">
                  <div className="file-icon" style={{ background: bg, color }}>
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

          <div className="post-hr">⸻⸻⸻⸻⸻⸻⸻⸻ or add more ⸻⸻⸻⸻⸻⸻⸻⸻⸻</div>

          <div className="post-attachments">
            {postAttachments.map((attach, i) => {
              return (
                <button key={i} onClick={() => attach.onClick()}>
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
              const total = newPost.files?.length + selected?.length;
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
        </div>

        {fillWarning && <RequiredWarning />}

        <div className="post-footer">
          <div className="count-char">
            {newPost?.content?.length}/999 characters
          </div>
          <div className="buttons">
            <button onClick={handlePostModal} className="cancel-post-btn">
              Cancel
            </button>
            <button className="publish-post-btn" onClick={handleSubmit}>
              <Send />
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddPost;
