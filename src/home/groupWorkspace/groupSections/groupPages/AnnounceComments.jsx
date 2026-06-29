import "./comments.css";
import { formatDistanceToNow } from "date-fns";
import {
  useAddComment,
  useDeleteComment,
} from "../../../../hooks/useAnnounce.js";
import {
  CornerDownLeft,
  Heart,
  Image,
  SendHorizonal,
  Trash2,
  X,
} from "lucide-react";
import LoadingSpinner from "../../../../components/loadingSpinner/LoadingSpinner.jsx";
import { useReducer } from "react";
import { useAuth } from "../../../../AuthContext.jsx";
import { NavLink, useParams } from "react-router-dom";
import { useIsRep } from "../../../../hooks/useIsRep.js";
import TextCollapser from "../../../../components/TextExpnder.jsx";
import { useLikeComments } from "../../../../hooks/useLikeComments.js";

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

function AnnounceComments({ setOpenComments, storedComments, announceId }) {
  const { groupId } = useParams();
  const { data: isRep } = useIsRep(groupId);
  const { mutate: addComment, isPending, isError } = useAddComment();
  const [newComment, dispatch] = useReducer(commentReducer, initialState);

  function handleAddComment() {
    if (!newComment.content && !newComment.image) return;

    addComment({
      announceId: announceId,
      content: newComment.content,
      parentCommentId: newComment.replyTo,
      file: newComment.image,
    });
    dispatch({ type: "RESET" });
  }
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
          {storedComments?.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              announceId={announceId}
              dispatch={dispatch}
              isRep={isRep}
            />
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

          <div className="commenting">
            <img />
            <input
              type="text"
              className="ann-input"
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
            {(newComment.content || !newComment.image) && (
              <button
                className="post-comment"
                onClick={handleAddComment}
                style={{ backgroundColor: "#b7521c" }}
              >
                <SendHorizonal />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function CommentItem({ comment, announceId, dispatch, isRep }) {
  const { user } = useAuth();
  const likedByMe = comment.announcement_comment_likes?.some(
    (l) => l.user_id === user.id,
  );
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: toggleLike } = useLikeComments({
    table: "announcement_comment_likes",
    idColumn: "comment_id",
    id: comment.id,
    queryKey: ["announcement_comments", announceId],
  });
  console.log(comment);
  return (
    <div className="comment-container" key={comment.id}>
      <div className="user-comment">
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
            <TextCollapser color="#b7521c">{comment.content}</TextCollapser>
            <img src={comment.image} />
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
              {comment.announcement_comment_likes?.length ?? 0}
            </span>
          </button>
          <button
            className="reply-button"
            onClick={() =>
              dispatch({
                type: "SET_REPLY_TO",
                payload: "prent id ?",
              })
            }
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
export default AnnounceComments;
