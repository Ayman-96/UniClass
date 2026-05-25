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
function AddPost({ handlePostModal }) {
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
              name="postText"
              id="postText"
              rows={4}
              placeholder="Share Something with Your Groupmates! :)"
            ></textarea>
          </div>
        </div>

        <div className="post-attachments-area">
          <div className="post-img">
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

        <div className="post-footer">
          <div className="count-char">0/500 characters</div>
          <div className="buttons">
            <button onClick={handlePostModal} className="cancel-post-btn">
              Cancel
            </button>
            <button className="publish-post-btn">
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
