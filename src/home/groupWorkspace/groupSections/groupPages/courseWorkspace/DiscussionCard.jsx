import { formatDistanceToNow } from "date-fns";
import { SquarePen, ThumbsUp, Trash2, Undo2 } from "lucide-react";
import { useAuth } from "../../../../../AuthContext";
import { useParams } from "react-router-dom";
import { useIsRep } from "../../../../../hooks/useIsRep";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { useTogglePinDiscussion } from "../../../../../hooks/useDiscussion";

function DiscussionCard({
  comment,
  isReply,
  commentTypes,
  toggleLike,
  setIsEditing,
  handleEditComment,
  deleteComment,
  handleReply,
}) {
  const { user } = useAuth();
  const { groupId, lectureId } = useParams();
  const { data: isRep } = useIsRep(groupId);
  const { mutate: pinComment } = useTogglePinDiscussion(lectureId);
  const likedByMe = comment.discussion_like?.some((l) => l.user_id === user.id);
  const type = commentTypes.find((t) => t.name.toLowerCase() === comment.type);

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
    <div
      className={`discuss-card ${isReply ? "discuss-smaller-reply" : ""}`}
      style={comment.is_pinned ? { border: "2px inset #42aa8d" } : {}}
    >
      {comment.is_pinned && (
        <div className="is-pinned-discussion">
          <BsPinAngleFill />
        </div>
      )}
      <div className="discuss-header">
        <div className="user-avatar-discussion">
          <img src={comment.profiles?.avatar_url} />{" "}
          <span>{comment.profiles?.username}</span>
        </div>
        {!isReply && (
          <div
            className="discussion-type"
            style={{ backgroundColor: type.color, color: "white" }}
          >
            {type.icon} {comment.type}
          </div>
        )}
        <div className="shared-time">
          {" "}
          {formatDistanceToNow(new Date(comment.created_at), {
            addSuffix: true,
          })}
        </div>
      </div>

      <p className="discuss-content">
        {tag && <span className="discuss-reply-tag">{tag} </span>}
        {tag ? restContent : comment.content}
      </p>

      <div className="discuss-reaction">
        <button
          onClick={() => {
            handleReply(comment);
            document.getElementById("discussion").focus();
          }}
        >
          <Undo2 /> Reply
        </button>
        <button onClick={() => toggleLike({ discussionId: comment.id })}>
          <ThumbsUp
            fill={likedByMe ? "#42aa8d" : "none"}
            stroke={likedByMe ? "#42aa8d" : "currentColor"}
          />
          <span style={{ color: likedByMe ? "#1a9e78" : undefined }}>
            {comment.discussion_like?.length ?? 0}
          </span>
        </button>

        <div className="my-comnt-btns">
          {user.id === comment.user_id && (
            <button
              onClick={() => {
                setIsEditing(true);
                handleEditComment(comment.id, comment.content);
              }}
            >
              <SquarePen />
            </button>
          )}

          {(user.id === comment.user_id || isRep) && (
            <button onClick={() => deleteComment(comment.id)}>
              <Trash2 />
            </button>
          )}

          {isRep && (
            <button onClick={() => pinComment(comment.id)}>
              {comment.is_pinned ? (
                <BsPinAngleFill style={{ color: "#129872" }} />
              ) : (
                <BsPinAngle />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiscussionCard;
