import "./LectureDiscussion.css";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, Undo2 } from "lucide-react";
const discussReply = [
  {
    name: "Reply",
    icon: <Undo2 />,
  },
  {
    name: "Like",
    icon: <ThumbsUp />,
  },
];
function DiscussionCollection({ storedComments, commentTypes, myCommentBtns }) {
  if (!storedComments) return null;

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
              {discussReply.map((btn) => {
                return (
                  <button key={btn.name}>
                    {btn.icon} {btn.name}
                  </button>
                );
              })}

              {comment.user_id === "my_id" &&
                myCommentBtns.map((btn) => {
                  return (
                    <div className="my-comnt-btns">
                      <button onClick={btn.onClick}>{btn.icon}</button>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </>
  );
}
export default DiscussionCollection;
