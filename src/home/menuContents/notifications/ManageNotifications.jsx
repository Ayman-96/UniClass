import { useState } from "react";
import {
  X,
  MessageSquare,
  Megaphone,
  Reply,
  Heart,
  AtSign,
  MessageCircle,
  UserPlus,
  UserMinus,
  UserCheck,
  BookOpen,
  AlertTriangle,
  FileTextIcon,
  ShieldCheck,
  Crown,
} from "lucide-react";
import "./manageNotifications.css";
import { GrGroup } from "react-icons/gr";
import { PiPresentationChartBold } from "react-icons/pi";

const SECTIONS = [
  {
    title: "Posts & Comments",
    types: [
      { key: "new_post", label: "New Post", Icon: FileTextIcon },
      {
        key: "post_comment",
        label: "Comments on Your Posts",
        Icon: MessageSquare,
      },
      { key: "new_announcement", label: "New Announcement", Icon: Megaphone },
      {
        key: "announcement_comment",
        label: "Comments on Announcements",
        Icon: MessageSquare,
      },
      { key: "comment_reply", label: "Replies to Your Comments", Icon: Reply },
      { key: "like_activity", label: "Likes on Your Posts", Icon: Heart },
      { key: "like_discussion", label: "Likes on Discussions", Icon: Heart },
      { key: "mention", label: "Mentions", Icon: AtSign },
    ],
  },
  {
    title: "Messages",
    types: [
      { key: "chat_message", label: "Direct Messages", Icon: MessageCircle },
    ],
  },
  {
    title: "Groups",
    types: [
      { key: "group_invite", label: "Group Invites", Icon: UserPlus },
      { key: "group_joined", label: "Added to a Group", Icon: GrGroup },
      { key: "group_removed", label: "Removed from a Group", Icon: UserMinus },
    ],
  },
  {
    title: "Courses",
    types: [
      { key: "course_added", label: "New Course Added", Icon: BookOpen },
      {
        key: "lecture_added",
        label: "New Lecture Added",
        Icon: PiPresentationChartBold,
      },
    ],
  },
  {
    title: "Friends",
    types: [
      {
        key: "friend_request_received",
        label: "Friend Requests",
        Icon: UserPlus,
      },
      {
        key: "friend_request_accepted",
        label: "Friend Request Accepted",
        Icon: UserCheck,
      },
    ],
  },
  {
    title: "Roles",
    types: [
      { key: "promoted_to_rep", label: "Promoted to Rep", Icon: ShieldCheck },
      { key: "promoted_to_mod", label: "Promoted to Moderator", Icon: Crown },
      { key: "demoted_from_rep", label: "Removed as Rep", Icon: AlertTriangle },
      {
        key: "demoted_from_mod",
        label: "Removed as Moderator",
        Icon: AlertTriangle,
      },
    ],
  },
];

export default function ManageNotifications({
  isOpen,
  onClose,
  preferences,
  onSave,
  isSaving,
}) {
  const [prefs, setPrefs] = useState(() => ({ ...(preferences ?? {}) }));

  if (!isOpen) return null;

  const isOn = (key) => prefs[key] ?? true;

  const toggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !isOn(key) }));
  };

  const handleSave = () => {
    onSave?.(prefs);
    onClose();
  };

  return (
    <div className="mn-overlay" onClick={onClose}>
      <div className="mn-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mn-header">
          <h2 className="mn-title">Manage Notifications</h2>
          <button className="mn-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="mn-list">
          {SECTIONS.map((section) => (
            <div className="mn-section" key={section.title}>
              <div className="mn-section-title">{section.title}</div>
              {section.types.map((type) => (
                <div className="mn-row" key={type.key}>
                  <div className="mn-row-left">
                    <type.Icon size={20} className="mn-icon" />
                    <span className="mn-label">{type.label}</span>
                  </div>
                  <button
                    className={`mn-toggle ${isOn(type.key) ? "mn-toggle-on" : ""}`}
                    onClick={() => toggle(type.key)}
                    aria-pressed={isOn(type.key)}
                  >
                    <span className="mn-toggle-knob" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mn-footer">
          <button className="mn-btn mn-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="mn-btn mn-btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
