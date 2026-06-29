import "./PostCard.css";
import { useState } from "react";
import { useDeletePost, usePostComments } from "../../../../hooks/usePosts";
import { HeartHandshake, MessageSquareText, Redo2 } from "lucide-react";
import PostComments from "../groupPages/PostComments";
import LoadingSpinner from "../../../../components/loadingSpinner/LoadingSpinner.jsx";
import { NavLink, useParams } from "react-router-dom";
import { useIsRep } from "../../../../hooks/useIsRep.js";
import { useSingleGroup } from "../../../../hooks/useGroups.js";
import { formatDistanceToNow } from "date-fns";

function PostCard({ post, isLiked, likeCount, toggleLike }) {
  const { groupId } = useParams();
  const { data: isRep } = useIsRep(groupId);
  const { data: currentGroup } = useSingleGroup(groupId);
  const [openComments, setOpenComments] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data: storedComments } = usePostComments(post.id);
  const { mutate: deletePost, isPending, isError } = useDeletePost();
  const postedTime = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
  });
  if (isPending) return <LoadingSpinner />;
  if (isError) return <div>Error Occured...</div>;
  return (
    <div className="post-overylay">
      <div className="post-card">
        <div className="post-head">
          <div className="author-info">
            <NavLink to={`/profile/${post.author_id}`}>
              <img src={post.profiles.avatar_url} className="author-pro-pic" />
            </NavLink>
            <div className="author-name">
              <p>{post.profiles.username}</p>
              <p>
                {postedTime} •{" "}
                <span style={{ color: currentGroup?.color }}>
                  {currentGroup?.name}{" "}
                </span>
              </p>
            </div>
          </div>
          {isRep && (
            <button
              className="post-setting"
              onClick={() => setConfirmDelete(true)}
            >
              •••
            </button>
          )}
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
