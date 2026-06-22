import "./LectureDiscussion.css";
import { formatDistanceToNow } from "date-fns";
import { SquarePen, ThumbsUp, Trash2, Undo2 } from "lucide-react";
import { useAuth } from "../../../../../AuthContext";
import { useParams } from "react-router-dom";
import { useIsRep } from "../../../../../hooks/useIsRep";

function DiscussionCollection({
  storedComments,
  commentTypes,
  toggleLike,
  setIsEditing,
  handleEditComment,
  deleteComment,
}) {
  const { user } = useAuth();
  const { groupId } = useParams();
  const { data: isRep } = useIsRep(groupId);

  return (
    <>
      {storedComments?.map((comment) => {
        const likedByMe = comment.discussion_like?.some(
          (l) => l.user_id === user.id,
        );
        const type = commentTypes.find(
          (t) => t.name.toLowerCase() === comment.type,
        );
        return (
          <div key={comment.id} className="discuss-card">
            <div className="discuss-header">
              <div className="user-avatar-discussion">
                SK <span>{comment.profiles?.username}</span>
              </div>
              <div
                className="discussion-type"
                style={{ backgroundColor: type.color, color: "white" }}
              >
                {type.icon} {comment.type}
              </div>
              <div className="shared-time">
                {" "}
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </div>
            </div>

            <p className="discuss-content">{comment.content}</p>

            <div className="discuss-reaction">
              <button>
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
      })}
    </>
  );
}
export default DiscussionCollection;
