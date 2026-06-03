import "./LectureDiscussion.css";
import {
  BadgeQuestionMark,
  LockKeyholeIcon,
  MessageSquareShare,
  MessagesSquare,
  NotebookPen,
  Pencil,
  Siren,
  SquarePen,
  Trash2,
  Users,
} from "lucide-react";

import { useState } from "react";
import {
  useAddComment,
  useDiscussion,
  useEditComment,
  useToggleLike,
} from "../../../../../hooks/useDiscussion";
import { useParams } from "react-router-dom";
import NotesCollection from "./NotesCollection";
import DiscussionCollection from "./DiscussionCOllection";
import useLectureStore from "../../../../../store/useLectureStore";
import useCommentStore from "../../../../../store/useCommentStore";
import { useAddNote, useNotes } from "../../../../../hooks/useNotes";
import LoadingSpinner from "../../../../../components/loadingSpinner/LoadingSpinner";
const discussBtns = [
  {
    name: "Comments",
    icon: <MessagesSquare />,
  },

  {
    name: "My Notes",
    icon: <LockKeyholeIcon />,
  },
];
const commentTypes = [
  {
    name: "Note",
    icon: <Pencil />,
    color: "rgba(124, 233, 61, 0.53)",
  },
  {
    name: "Question",
    icon: <BadgeQuestionMark />,
    color: "rgba(139, 72, 255, 0.6)",
  },
  {
    name: "Important",
    icon: <Siren />,
    color: "rgba(255, 27, 27, 0.69)",
  },
];
const myCommentBtns = [
  {
    icon: <Trash2 />,
    onClick: "",
  },
  {
    icon: <SquarePen />,
    onClick: "",
  },
];
function LectureDiscussion({ selectedLecture }) {
  const { courseId } = useParams();
  const { currentSlide } = useLectureStore();
  const { commentId } = useCommentStore();
  const [noteContent, setNoteContent] = useState("");
  const {
    data: storedComments,
    isLoading,
    isError,
  } = useDiscussion(selectedLecture.id, currentSlide);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Comments");
  const [commentContent, setCommentContent] = useState("");
  const [activeType, setActiveType] = useState(commentTypes[0]);

  const { mutate: addComment } = useAddComment(
    selectedLecture.id,
    currentSlide,
  );
  const { mutate: toggleLike } = useToggleLike(
    selectedLecture.id,
    currentSlide,
  );
  const { mutate: editComment } = useEditComment(
    selectedLecture.id,
    currentSlide,
  );
  const { mutate: addNote } = useAddNote(selectedLecture.id, currentSlide);

  // needs userId after Auth
  const { data: storedNotes } = useNotes(selectedLecture.id, currentSlide);
  function handleAddNote() {
    if (!noteContent) return;

    addNote({
      user_id: null,
      slide_number: currentSlide,
      content: noteContent,
      type: activeType.name.toLowerCase(),
      lecture_id: selectedLecture.id,
    });
    setNoteContent("");
  }
  function handleAddComment() {
    if (!commentContent) return;

    if (isEditing) {
      editComment({ commentId: commentId, newContent: commentContent });
      setCommentContent("");
      setIsEditing(false);
      return;
    }
    addComment({
      user_id: null, // still dont have auth
      slide_number: currentSlide,
      content: commentContent,
      type: activeType.name.toLowerCase(),
      lecture_id: selectedLecture.id,
      course_id: courseId,
    });
    setCommentContent("");
  }

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error... try again</div>;

  return (
    <div className="comment-note-overlay">
      <MessagesSquare /> Discussion & Notes <span>Slide {currentSlide}</span>
      <div className="discussion-buttons">
        {discussBtns.map((btn, i) => {
          return (
            <button
              key={i}
              onClick={() => setActiveTab(btn.name)}
              className={`discuss-btn ${activeTab === btn.name && "activated-panel"}`}
            >
              {btn.icon} {btn.name}
            </button>
          );
        })}
      </div>
      <div className="discussion-body">
        {activeTab === "Comments" ? (
          <DiscussionCollection
            storedComments={storedComments}
            commentTypes={commentTypes}
            toggleLike={toggleLike}
            editComment={editComment}
            setCommentContent={setCommentContent}
            // commentContent={commentContent}
            setIsEditing={setIsEditing}
          />
        ) : (
          <NotesCollection
            storedNotes={storedNotes}
            myCommentBtns={myCommentBtns}
            commentTypes={commentTypes}
          />
        )}
      </div>
      <div className="discussion-footer">
        <div className="comment-types">
          {commentTypes.map((type) => {
            return (
              <button
                key={type.color}
                className={`comnt-type ${activeType.name === type.name && "activated-type"}`}
                style={{ backgroundColor: type.color }}
                onClick={() => {
                  setActiveType(type);
                }}
              >
                {type.icon} {type.name}
              </button>
            );
          })}
        </div>

        <textarea
          name={activeTab === "Comments" ? "slideComment" : "privateNote"}
          id="discussion"
          value={activeTab === "Comments" ? commentContent : noteContent}
          onChange={(e) => {
            activeTab === "Comments"
              ? setCommentContent(e.target.value)
              : setNoteContent(e.target.value);
          }}
          placeholder={
            activeTab === "Comments"
              ? "Add a Comment to Slide #"
              : "Write a Private Note for Slide #"
          }
        />

        <div className="comment-note">
          {activeTab === "Comments" ? (
            <div>
              <span>
                <Users /> Visible to CLassmates
              </span>
              <button
                onClick={handleAddComment}
                style={{ backgroundColor: activeType.color }}
              >
                <MessageSquareShare /> Share
              </button>
            </div>
          ) : (
            <p>
              <span>
                <LockKeyholeIcon />
                Only Visible to You
              </span>
              <button
                onClick={handleAddNote}
                style={{ backgroundColor: activeType.color }}
              >
                <NotebookPen /> Save
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LectureDiscussion;
