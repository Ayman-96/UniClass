import "./LectureDiscussion.css";
import { formatDistanceToNow } from "date-fns";
import { LockKeyholeIcon, SquarePen, Trash2 } from "lucide-react";
import { useAuth } from "../../../../../AuthContext";
import { useParams } from "react-router-dom";
import { useIsRep } from "../../../../../hooks/useIsRep";

function NotesCollection({
  storedNotes,
  commentTypes,
  setIsEditing,
  handleEditNote,
  deleteNote,
}) {
  const { user } = useAuth();
  const { groupId } = useParams();
  const { data: isRep } = useIsRep(groupId);
  return (
    <>
      {storedNotes?.map((note) => {
        console.log(note);
        const color = commentTypes.find(
          (t) => t.name.toLowerCase() === note.type,
        ).color;
        return (
          <div key={note.id} className="discuss-card">
            <div className="discuss-header">
              {/* <div className="user-avatar-discussion">
                SK <span>profilename</span>
              </div> */}
              <div
                className="discussion-type"
                style={{ backgroundColor: color }}
              >
                <p>
                  <LockKeyholeIcon strokeWidth={2.8} />{" "}
                  <span> private {note.type}</span>
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
                {(user.id === note.user_id || isRep) && (
                  <button onClick={() => deleteNote(note.id)}>
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
export default NotesCollection;
