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
  ThumbsUp,
  Trash2,
  Undo2,
  Users,
} from "lucide-react";

import { useState } from "react";
import {
  useAddComment,
  useDiscussion,
} from "../../../../../hooks/useDiscussion";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import LoadingSpinner from "../../../../../components/loadingSpinner/LoadingSpinner";
import useLectureStore from "../../../../../store/useLectureStore";
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
  const {
    data: storedComments,
    isLoading,
    isError,
  } = useDiscussion(selectedLecture.id, currentSlide);
  const [activeTab, setActiveTab] = useState("Comments");
  const [commentContent, setCommentContent] = useState("");
  const [activeType, setActiveType] = useState(commentTypes[0]);
  const { mutate: addComment } = useAddComment(
    selectedLecture.id,
    currentSlide,
  );

  function handleAddComment() {
    if (!commentContent) return;

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
        {storedComments.map((comment, i) => {
          return (
            <div key={i} className="discuss-card">
              <div className="discuss-header">
                <div className="user-avatar-discussion">
                  SK <span>username</span>
                </div>
                <div className="discussion-type">
                  {activeTab === "Comments" ? (
                    ""
                  ) : (
                    <p>
                      <LockKeyholeIcon /> private note
                    </p>
                  )}
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
                {activeTab === "Comments" ? (
                  discussReply.map((btn) => {
                    return (
                      <button key={btn.name}>
                        {btn.icon} {btn.name}
                      </button>
                    );
                  })
                ) : (
                  <button>
                    <SquarePen /> Edit
                  </button>
                )}

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
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
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
              <button>
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
