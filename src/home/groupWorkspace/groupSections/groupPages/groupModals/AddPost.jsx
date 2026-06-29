import { useParams } from "react-router-dom";
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
import { useAddPost } from "../../../../../hooks/usePosts";
import RequiredWarning from "./RequiredWarning";
import { useAuth } from "../../../../../AuthContext.jsx";
const postAttachments = [
  {
    text: "Attach File",
    icon: <Paperclip />,
  },
  {
    text: "Mention",
    icon: <AtSign />,
  },
  {
    text: "Add Link",
    icon: <Link />,
  },
];
const postData = {
  author_name: "",
  author_badge: "",
  content: "",
  imageFile: null,
};

function postReducer(state, action) {
  switch (action.type) {
    case "ADD_CONTENT":
      return { ...state, content: action.payload };
    case "ADD_IMAGE":
      return { ...state, imageFile: action.payload };

    case "RESET":
      return postData;

    default:
      return state;
  }
}
function AddPost({ handlePostModal }) {
  const { user } = useAuth();
  const { groupId } = useParams();

  const [newPost, dispatch] = useReducer(postReducer, postData);
  const { mutate: addPost } = useAddPost();
  const [fillWarning, setFillWarning] = useState(false);

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
    });
    dispatch({ type: "RESET" });
    handlePostModal();
  }
  console.log(user);
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
            <div className="author-pro-pic">MN</div>
            <div className="author-name">
              <p>My Name</p>
              <p>
                Group Name • <span>Badge</span>
              </p>
            </div>
          </div>

          <div className="post-text-area">
            <textarea
              rows={4}
              id="postText"
              name="postText"
              value={newPost.content}
              placeholder="Share Something with Your Groupmates! :)"
              onChange={(e) => {
                dispatch({ type: "ADD_CONTENT", payload: e.target.value });
              }}
            ></textarea>
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
                console.log(e.target.files);
                dispatch({ type: "ADD_IMAGE", payload: e.target.files[0] });
              }}
            />
            <ImagePlus />
            <p>Click to upload images</p>
            <p>PNG,JPG up to 5MB each</p>
          </div>

          <div className="post-hr">⸻⸻⸻⸻⸻⸻⸻⸻ or add more ⸻⸻⸻⸻⸻⸻⸻⸻⸻</div>

          <div className="post-attachments">
            {postAttachments.map((attach, i) => {
              return (
                <button key={i}>
                  {attach.icon}
                  {attach.text}
                </button>
              );
            })}
          </div>
        </div>

        {fillWarning && <RequiredWarning />}

        <div className="post-footer">
          <div className="count-char">0/500 characters</div>
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
