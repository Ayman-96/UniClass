import "./PostCard.css";
import { useState } from "react";
import { useDeletePost, usePostComments } from "../../../../hooks/usePosts";
import { HeartHandshake, MessageSquareText, Redo2 } from "lucide-react";
import PostComments from "../groupPages/PostComments";
import LoadingSpinner from "../../../../components/loadingSpinner/LoadingSpinner.jsx";
function PostCard({ post, isLiked, likeCount, toggleLike }) {
  const [openComments, setOpenComments] = useState(false);
  const { mutate: deletePost, isPending, isError } = useDeletePost();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const postedTime = new Date(post.created_at).toLocaleDateString();
  const { data: storedComments } = usePostComments(post.id);

  if (isPending) return <LoadingSpinner />;
  if (isError) return <div>Error Occured...</div>;
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
          <button
            className={`like-post ${isLiked ? "liked" : ""}`}
            onClick={() =>
              toggleLike({ postId: post.id, isCurrentlyLiked: isLiked })
            }
          >
            <HeartHandshake /> {likeCount}
          </button>
          <button
            className="comment-post"
            onClick={() => setOpenComments(true)}
          >
            <MessageSquareText /> {storedComments?.length}
          </button>
          <button className="share-post">
            <Redo2 />
          </button>
        </div>
      </div>

      <div className="post-comments">
        {openComments && (
          <PostComments
            setOpenComments={setOpenComments}
            storedComments={storedComments}
            postId={post.id}
          />
        )}
      </div>
    </div>
  );
}
export default PostCard;
