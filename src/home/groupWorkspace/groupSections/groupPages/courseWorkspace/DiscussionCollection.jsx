import "./LectureDiscussion.css";
import { formatDistanceToNow } from "date-fns";
import { SquarePen, ThumbsUp, Trash2, Undo2 } from "lucide-react";
import useCommentStore from "../../../../../store/useCommentStore";

function DiscussionCollection({
  storedComments,
  commentTypes,
  toggleLike,
  setIsEditing,
  setCommentContent,
}) {
  const { setCommentId } = useCommentStore();
  function handleEditComment(commentId, currentContent) {
    setCommentContent(currentContent);
    setCommentId(commentId);
  }

  return (
    <>
      {storedComments?.map((comment) => {
        const type = commentTypes.find(
          (t) => t.name.toLowerCase() === comment.type,
        );
        return (
          <div key={comment.id} className="discuss-card">
            <div className="discuss-header">
              <div className="user-avatar-discussion">
                SK <span>username</span>
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
                <ThumbsUp /> {comment.discussion_like?.[0]?.count ?? 0}
                {/*if anything above is undefined or null, default to 0 */}
              </button>

              <div className="my-comnt-btns">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    handleEditComment(comment.id, comment.content);
                  }}
                >
                  <SquarePen />
                </button>

                <button>
                  <Trash2 />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
export default DiscussionCollection;
