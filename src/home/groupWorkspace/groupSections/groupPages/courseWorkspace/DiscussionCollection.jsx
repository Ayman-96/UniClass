import "./LectureDiscussion.css";
import { formatDistanceToNow } from "date-fns";
import { SquarePen, ThumbsUp, Trash2, Undo2 } from "lucide-react";
import { useAuth } from "../../../../../AuthContext";
import { useParams } from "react-router-dom";
import { useIsRep } from "../../../../../hooks/useIsRep";
import { useMemo } from "react";

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

function DiscussionCollection({
  storedComments,
  commentTypes,
  toggleLike,
  setIsEditing,
  handleEditComment,
  deleteComment,
  handleReply,
}) {
  const grouped = useMemo(
    () => groupComments(storedComments ?? []),
    [storedComments],
  );

  return (
    <>
      {grouped?.map((comment) => (
        <div key={comment.id}>
          <DiscussionCard
            comment={comment}
            commentTypes={commentTypes}
            toggleLike={toggleLike}
            setIsEditing={setIsEditing}
            handleEditComment={handleEditComment}
            deleteComment={deleteComment}
            handleReply={handleReply}
          />
          {comment.replies?.map((reply) => (
            <DiscussionCard
              key={reply.id}
              comment={reply}
              isReply
              commentTypes={commentTypes}
              toggleLike={toggleLike}
              setIsEditing={setIsEditing}
              handleEditComment={handleEditComment}
              deleteComment={deleteComment}
              handleReply={handleReply}
            />
          ))}
        </div>
      ))}
    </>
  );
}

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
  const { groupId } = useParams();
  const { data: isRep } = useIsRep(groupId);

  const likedByMe = comment.discussion_like?.some(
    (l) => l.user_id === user.id,
  );
  const type = commentTypes.find(
    (t) => t.name.toLowerCase() === comment.type,
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
    <div
      className={`discuss-card ${isReply ? "discuss-smaller-reply" : ""}`}
    >
      <div className="discuss-header">
        <div className="user-avatar-discussion">
          SK <span>{comment.profiles?.username}</span>
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
        <button onClick={() => handleReply(comment)}>
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
          {/*if anything above is undefined or null, default to 0 */}
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
        </div>
      </div>
    </div>
  );
}
export default DiscussionCollection;
