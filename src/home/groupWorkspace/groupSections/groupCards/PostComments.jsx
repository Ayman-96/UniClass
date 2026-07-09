import "./comments.css";
import { formatDistanceToNow } from "date-fns";
import { useAddComment, useDeleteComment } from "../../../../hooks/usePosts";
import {
  CornerDownLeft,
  Heart,
  Image,
  SendHorizonal,
  Trash2,
  X,
} from "lucide-react";
import LoadingSpinner from "../../../../components/loadingSpinner/LoadingSpinner.jsx";
import { useMemo, useReducer, useState } from "react";
import { useAuth } from "../../../../AuthContext.jsx";
import { useIsRep } from "../../../../hooks/useIsRep.js";
import { NavLink, useParams } from "react-router-dom";
import TextCollapser from "../../../../components/TextExpnder.jsx";
import { useLikeComments } from "../../../../hooks/useLikeComments.js";
import { useProfile } from "../../../../hooks/useSaveProfile.js";

const initialState = {
  content: "",
  image: null,
  replyTo: null,
};
function commentReducer(state, action) {
  switch (action.type) {
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_IMAGE":
      return { ...state, image: action.payload };
    case "REMOVE_IMAGE":
      return { ...state, image: null };

    case "SET_REPLY_TO":
      return { ...state, replyTo: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

function PostComments({ setOpenComments, storedComments, postId }) {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { mutate: addComment, isPending, isError } = useAddComment();
  const [newComment, dispatch] = useReducer(commentReducer, initialState);
  const { data: me } = useProfile(user?.id);

  const [parent, setParent] = useState(null);
  const { data: isRep } = useIsRep(groupId);
  function handleAddComment() {
    if (!newComment.content && !newComment.image) return;

    const finalContent = parent
      ? `@${parent} ${newComment.content}`
      : newComment.content;

    addComment({
      postId: postId,
      content: finalContent,
      parentCommentId: newComment.replyTo,
      file: newComment.image,
    });
    dispatch({ type: "RESET" });
    setParent(null);
  }

  function groupComments(comments) {
    const parents = [];
    const repliesByParent = {};

    for (const comment of comments) {
      if (comment.parent_comment_id) {
        if (!repliesByParent[comment.parent_comment_id]) {
          repliesByParent[comment.parent_comment_id] = [];
        }
        repliesByParent[comment.parent_comment_id].push(comment);
      } else {
        parents.push(comment);
      }
    }

    return parents.map((parent) => ({
      ...parent,
      replies: repliesByParent[parent.id] || [],
    }));
  }
  const grouped = useMemo(
    () => groupComments(storedComments ?? []),
    [storedComments],
  );
  if (isError) return <div>Error Occured...</div>;
  return (
    <div className="post-comment-section">
      <div className="comment-sheet">
        <div className="comment-sec-header">
          <div>{storedComments?.length} comments</div>
          <button onClick={() => setOpenComments(false)}>
            <X />
          </button>
        </div>
        <div className="comments-list">
          {grouped?.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                isRep={isRep}
                dispatch={dispatch}
                setParent={setParent}
              />
              {comment.replies?.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply
                  postId={postId}
                  isRep={isRep}
                  dispatch={dispatch}
                  setParent={setParent}
                />
              ))}
            </div>
          ))}
        </div>

        {isPending && <LoadingSpinner />}
        <div className="write-comment-section">
          {newComment.image && (
            <div className="added-image">
              <img src={URL.createObjectURL(newComment.image)} />
              <button
                className="remove-img"
                onClick={() => dispatch({ type: "REMOVE_IMAGE" })}
              >
                <X />
              </button>
            </div>
          )}

          {parent && (
            <div className="reply-to-parent">
              <span>
                Replying to <strong>{parent}</strong>
              </span>
              <button
                className="cancel-reply"
                onClick={() => {
                  setParent(null);
                  dispatch({ type: "SET_REPLY_TO", payload: null });
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="commenting">
            <img src={me?.avatar_url || ""} />
            <input
              type="text"
              value={newComment.content}
              placeholder="Write a comment..."
              onChange={(e) => {
                dispatch({ type: "SET_CONTENT", payload: e.target.value });
              }}
            />
            <button
              className="add-img-btn"
              onClick={() => {
                document.getElementById("comment-img").click();
              }}
            >
              <Image />
            </button>
            <input
              id="comment-img"
              hidden
              type="file"
              onChange={(e) =>
                dispatch({ type: "SET_IMAGE", payload: e.target.files[0] })
              }
            />
            {(newComment.content || newComment.image) && (
              <button className="post-comment" onClick={handleAddComment}>
                <SendHorizonal />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function CommentItem({ comment, postId, isRep, dispatch, setParent, isReply }) {
  const { user } = useAuth();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: toggleLike } = useLikeComments({
    table: "post_comment_likes",
    idColumn: "comment_id",
    id: comment.id,
    queryKey: ["post-comments", postId],
  });

  const likedByMe = comment.post_comment_likes?.some(
    (l) => l.user_id === user.id,
  );

  let tag = null;
  let restContent = comment.content;

  if (isReply && comment.content.startsWith("@")) {
    const spaceIndex = comment.content.indexOf(" ");
    if (spaceIndex !== -1) {
      tag = comment.content.slice(0, spaceIndex);
      restContent = comment.content.slice(spaceIndex + 1);
    } else {
      tag = comment.content;
      restContent = "";
    }
  }
  return (
    <div className="comment-container" key={comment.id}>
      <div className={`user-comment ${isReply ? "smaller-comment-reply" : ""}`}>
        <NavLink to={`/profile/${comment.user_id}`}>
          <img
            className="user-pro"
            src={comment.profiles?.avatar_url || null}
          />
        </NavLink>
        <div className="user-comm">
          <div className="comm-head">
            {comment.profiles?.username}
            <span>
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
          <div className="comm-content">
            {tag && <span className="reply-tag">{tag} </span>}
            <TextCollapser color="#1a9e78">
              {tag ? restContent : comment.content}
            </TextCollapser>
            {comment.image && <img src={comment.image} />}
          </div>
        </div>
      </div>

      <div className="comm-interactions">
        <div className="act-comnt">
          <button className="like-comment" onClick={() => toggleLike()}>
            <Heart
              fill={likedByMe ? "red" : "none"}
              stroke={likedByMe ? "red" : "currentColor"}
            />{" "}
            <span style={{ color: likedByMe ? "red" : undefined }}>
              {comment.post_comment_likes?.length ?? 0}
            </span>
          </button>
          <button
            className="reply-button"
            onClick={() => {
              const topLevelParentId = comment.parent_comment_id ?? comment.id;
              setParent(comment.profiles?.username);
              dispatch({ type: "SET_REPLY_TO", payload: topLevelParentId });
            }}
          >
            <CornerDownLeft /> Reply
          </button>
        </div>
        <button
          className="delete-comnt"
          onClick={() => deleteComment({ commentId: comment.id })}
        >
          {(user.id === comment.user_id || isRep) && <Trash2 />}
        </button>
      </div>
    </div>
  );
}
export default PostComments;
