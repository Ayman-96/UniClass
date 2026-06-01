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
function LectureDiscussion() {
  const [activeType, setActiveType] = useState("Note");
  const [activeTab, setActiveTab] = useState("Comments");

  return (
    <div className="comment-note-overlay">
      <MessagesSquare /> Discussion & Notes <span>Slide #</span>
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
        <div className="discuss-card">
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
            <div className="shared-time">2h ago</div>
          </div>

          <p className="discuss-content"> Hello</p>

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

            <button className="delete-note">
              <Trash2 />
            </button>
          </div>
        </div>
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
              <button style={{ backgroundColor: activeType.color }}>
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
