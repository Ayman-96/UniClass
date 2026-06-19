import "./LectureDiscussion.css";
import { formatDistanceToNow } from "date-fns";
import { LockKeyholeIcon, SquarePen, Trash2 } from "lucide-react";

function NotesCollection({
  storedNotes,
  commentTypes,
  setIsEditing,
  handleEditNote,
  deleteNote,
}) {
  return (
    <>
      {storedNotes?.map((note) => {
        const color = commentTypes.find(
          (t) => t.name.toLowerCase() === note.type,
        ).color;
        return (
          <div key={note.id} className="discuss-card">
            <div className="discuss-header">
              <div className="user-avatar-discussion">
                SK <span>profilename</span>
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
              <div className="my-comnt-btns">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    handleEditNote(note.id, note.content);
                  }}
                >
                  <SquarePen />
                </button>

                <button onClick={() => deleteNote(note.id)}>
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
export default NotesCollection;
