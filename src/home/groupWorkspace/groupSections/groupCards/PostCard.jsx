import "./PostCard.css";
import { useState } from "react";
import { useDeletePost } from "../../../../hooks/usePosts";
import { HeartHandshake, MessageSquareText, Redo2 } from "lucide-react";

function PostCard({ post }) {
  const { mutate: deletePost, isPending } = useDeletePost();
  const [confirmDelete, setConfirmDelete] = useState(false);
  console.log("POST ID " + post.id);
  const postedTime = new Date(post.created_at).toLocaleDateString();
  return (
    <div className="post-overylay">
      <div className="post-card">
        <div className="post-head">
          <div className="author-info">
            <div className="author-pro-pic">MN</div>
            <div className="author-name">
              <p>My Name</p>
              <p>
                <span>{postedTime}</span> • Group Name
              </p>
            </div>
          </div>
          <button
            className="post-setting"
            onClick={() => setConfirmDelete(true)}
          >
            •••
          </button>
          {confirmDelete && (
            <div className="delete-confirm-row">
              <button
                className="confirm-yes"
                onClick={() => deletePost({ postId: post.id })}
                disabled={isPending}
              >
                {isPending ? "Almost" : "Delete"}
              </button>
              <button
                className="confirm-no"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="post-body">
          <p className="post-content">{post.content}</p>
          {post.img_url && (
            <img
              src={post.img_url}
              alt="post attachment"
              className="post-img"
            />
          )}
        </div>

        <div className="post-interactions">
          <button className="like-post">
            <HeartHandshake /> 12
          </button>
          <button className="comment-post">
            <MessageSquareText /> 6
          </button>
          <button className="share-post">
            <Redo2 />
          </button>
        </div>
      </div>
    </div>
  );
}
export default PostCard;
