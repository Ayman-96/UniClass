import "./LectureDiscussion.css";
import { formatDistanceToNow } from "date-fns";
import { LockKeyholeIcon } from "lucide-react";

function NotesCollection({ storedNotes, myCommentBtns, commentTypes }) {
  return (
    <>
      {storedNotes?.map((note, i) => {
        const color = commentTypes.find(
          (t) => t.name.toLowerCase() === note.type,
        ).color;
        return (
          <div key={i} className="discuss-card">
            <div className="discuss-header">
              <div className="user-avatar-discussion">
                SK <span>username</span>
              </div>
              <div
                className="discussion-type"
                style={{ backgroundColor: color }}
              >
                <p>
                  <LockKeyholeIcon /> private note
                </p>
              </div>
              <div className="shared-time">
                {formatDistanceToNow(new Date(note.created_at), {
                  addSuffix: true,
                })}
              </div>
            </div>

            <p className="discuss-content">{note.content}</p>

            <div className="discuss-reaction">
              {note.user_id === "my_id" &&
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
export default NotesCollection;
