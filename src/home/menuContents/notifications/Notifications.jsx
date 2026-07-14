import "./notifications.css";
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MessageSquare,
  Users,
  UserPlus,
  UserMinus,
  FileText,
  MessageCircle,
  Megaphone,
  MessageSquareText,
  Heart,
  Flame,
  MessageSquareReply,
  BookOpen,
  Video,
  CheckCircle,
  AtSign,
  Bell,
  Layers,
  MailQuestionMark,
  Settings,
  Check,
  ShieldCheck,
  ShieldX,
  Crown,
} from "lucide-react";
import { BsFilePost } from "react-icons/bs";
import { FaRegSadTear, FaReply } from "react-icons/fa";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";
import {
  formatDistanceToNow,
  isToday,
  isYesterday,
  isThisWeek,
} from "date-fns";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "../../../hooks/useNotifications";
import { GrGroup } from "react-icons/gr";
import { RiSettings3Fill } from "react-icons/ri";

const NOTIF_ICON_MAP = {
  group_invite: {
    Icon: UserPlus,
    color: "#e9c80e",
    sideBorderColor: "#e9c80e",
  },
  chat_message: {
    Icon: MessageSquare,
    color: "#0d9488",
    sideBorderColor: "#0d9488",
  },
  group_joined: {
    Icon: GrGroup,
    color: "#50c8ff",
    sideBorderColor: "#50c8ff",
  },
  group_removed: {
    Icon: UserMinus,
    color: "#e81b1b",
    sideBorderColor: "#e81b1b",
  },
  new_post: { Icon: FileText, color: "#475569", sideBorderColor: "#475569" },
  post_comment: {
    Icon: MessageCircle,
    color: "#0ea5e9",
    sideBorderColor: "#0ea5e9",
  },
  new_announcement: {
    Icon: Megaphone,
    color: "#d97706",
    sideBorderColor: "#d97706",
  },
  announcement_comment: {
    Icon: MessageSquareText,
    color: "#f59e0b",
    sideBorderColor: "#f59e0b",
  },
  like_activity: { Icon: Heart, color: "#f43f5e", sideBorderColor: "#f43f5e" },
  like_discussion: {
    Icon: Flame,
    color: "#ff4500",
    sideBorderColor: "#ff4500",
  },
  comment_reply: {
    Icon: MessageSquareReply,
    color: "#4f46e5",
    sideBorderColor: "#4f46e5",
  },
  course_added: {
    Icon: BookOpen,
    color: "#7c3aed",
    sideBorderColor: "#7c3aed",
  },
  lecture_added: { Icon: Video, color: "#6366f1", sideBorderColor: "#6366f1" },
  friend_request_received: {
    Icon: UserPlus,
    color: "#059669",
    sideBorderColor: "#059669",
  },
  friend_request_accepted: {
    Icon: CheckCircle,
    color: "#10b981",
    sideBorderColor: "#10b981",
  },
  mention: { Icon: AtSign, color: "#ec4899", sideBorderColor: "#ec4899" },
  system: { Icon: Bell, color: "#374151", sideBorderColor: "#374151" },
  promoted_to_rep: {
    Icon: ShieldCheck,
    color: "#7c3aed",
    sideBorderColor: "#7c3aed",
  },
  demoted_from_rep: {
    Icon: ShieldX,
    color: "#ef4444",
    sideBorderColor: "#ef4444",
  },
  promoted_to_mod: {
    Icon: Crown,
    color: "#F0A500",
    sideBorderColor: "#F0A500",
  },
  demoted_from_mod: {
    Icon: FaRegSadTear,
    color: "#090909",
    sideBorderColor: "#090909",
  },
};

const FILTER_TYPE_MAP = {
  chats: ["chat_message"],
  groups: [
    "group_invite",
    "group_joined",
    "group_removed",
    "promoted_to_rep",
    "demoted_from_rep",
    "promoted_to_mod",
    "demoted_from_mod",
  ],
  posts: ["new_post", "post_comment"],
  announcements: ["new_announcement", "announcement_comment"],
  likes: ["like_activity", "like_discussion"],
  replies: ["comment_reply"],
  courses: ["course_added", "lecture_added"],
  friend_requests: ["friend_request_received", "friend_request_accepted"],
  mentions: ["mention"],
  system: ["system"],
};

function entityLink(n) {
  if (n.type === "chat_message") return `/home/classmates`;
  if (n.type.startsWith("friend_")) return `/profile/${n.actor?.id ?? ""}`;
  if (n.entity_type === "post")
    return `/home/group/${n.group_id}/posts?highlight=${n.entity_id}`;
  if (
    n.entity_type === "post_comment" ||
    n.entity_type === "announcement_comment"
  )
    return `/groups/${n.group_id}`;
  if (n.entity_type === "discussion")
    return `/lectures/${n.metadata?.lecture_id ?? ""}`;
  if (n.entity_type === "group" || n.entity_type === "course")
    return `/groups/${n.group_id}`;
  return "/notifications";
}

function Notifications() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all_notifications");
  const [search, setSearch] = useState("");

  const { data: notifications = [], isLoading } = useNotifications();
  const markAllRead = useMarkAllAsRead();
  const filtered = useMemo(() => {
    let list = notifications;
    if (unreadOnly) list = list.filter((n) => !n.is_read);
    if (activeFilter !== "all_notifications" && activeFilter !== "unread") {
      const types = FILTER_TYPE_MAP[activeFilter] ?? [];
      list = list.filter((n) => types.includes(n.type));
    }
    if (activeFilter === "unread") list = list.filter((n) => !n.is_read);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.body?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [notifications, unreadOnly, activeFilter, search]);

  return (
    <div className="notif-container">
      <div className="notif-sidebar">
        <NotificationFilter
          notifications={notifications}
          active={activeFilter}
          onSelect={setActiveFilter}
        />
      </div>

      <div className="notif-main-content">
        <div className="notif-header-wrapper">
          <div>
            <h1 className="notif-title">Notifications</h1>
            <p className="notif-subtitle">
              Stay updated with everything in your groups and courses.
            </p>
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="notif-search-input"
            />
          </div>
          <div className="notif-actions-group">
            <div className="read-notifications">
              <button
                onClick={() => markAllRead.mutate()}
                className="btn-mark-all"
              >
                <Check size={16} /> Mark all as read
              </button>
              <button
                onClick={() => setUnreadOnly((prev) => !prev)}
                className={`btn-toggle-unread ${unreadOnly ? "active" : "inactive"}`}
              >
                Unread Only
                {unreadOnly ? (
                  <PiToggleRightFill size={20} className="toggle-icon-active" />
                ) : (
                  <PiToggleLeftFill size={20} />
                )}
              </button>
            </div>
            <button className="manage-notify">
              <RiSettings3Fill />
              Manage Notifications
            </button>
          </div>
        </div>

        <NotificationsList notifications={filtered} isLoading={isLoading} />
      </div>
    </div>
  );
}

function NotificationsList({ notifications, isLoading }) {
  const groups = useMemo(() => {
    const today = [];
    const yesterday = [];
    const week = [];
    const allTime = [];
    for (const n of notifications) {
      const d = new Date(n.created_at);
      if (isToday(d)) today.push(n);
      else if (isYesterday(d)) yesterday.push(n);
      else if (isThisWeek(d)) week.push(n);
      else allTime.push(n);
    }
    return { today, yesterday, week, allTime };
  }, [notifications]);

  if (isLoading) return <div className="notif-list-loading">Loading...</div>;
  if (notifications.length === 0)
    return <div className="notif-list-empty">No notifications yet.</div>;

  const renderSection = (title, items) => {
    if (items.length === 0) return null;
    return (
      <div className="notif-section">
        <p className="notif-section-title">{title}</p>
        <div className="notif-section-rows">
          {items.map((n) => (
            <NotificationRow key={n.id} n={n} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderSection("Today", groups.today)}
      {renderSection("Yesterday", groups.yesterday)}
      {renderSection("Earlier This Week", groups.week)}
      {renderSection("Earlier", groups.allTime)}
    </div>
  );
}

function NotificationRow({ n }) {
  const markRead = useMarkAsRead();

  const { Icon, color, sideBorderColor } = NOTIF_ICON_MAP[n.type] ?? {
    Icon: Bell,
    color: "#94a3b8",
    sideBorderColor: "transparent",
  };

  const isRemoval = n.type === "group_removed";

  return (
    <NavLink
      to={entityLink(n)}
      className="notif-row-link"
      style={{
        borderLeft: `4px solid ${!n.is_read ? sideBorderColor : "transparent"}`,
      }}
      onClick={() => !n.is_read && markRead.mutate(n.id)}
    >
      <div
        className={`notif-icon-circle ${isRemoval ? "removed-bg" : ""}`}
        style={!isRemoval ? { backgroundColor: `${color}15` } : undefined}
      >
        <Icon size={20} style={{ color: color }} />
      </div>

      <div className="notif-text-block">
        <div className="notif-row-header">
          <span className="notif-row-title">{n.title}</span>
          <div className="notif-meta-group">
            <span className="notif-time">
              {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
            </span>
            {!n.is_read && <span className="notif-unread-dot" />}
          </div>
        </div>
        {n.body && <span className="notif-body-text">{n.body}</span>}
      </div>
    </NavLink>
  );
}

function NotificationFilter({ notifications, active, onSelect }) {
  const counts = useMemo(() => {
    const c = { all_notifications: notifications.length, unread: 0 };
    for (const key of Object.keys(FILTER_TYPE_MAP)) c[key] = 0;
    for (const n of notifications) {
      if (!n.is_read) c.unread++;
      for (const [filterKey, types] of Object.entries(FILTER_TYPE_MAP)) {
        if (types.includes(n.type)) c[filterKey]++;
      }
    }
    return c;
  }, [notifications]);

  const categories = [
    {
      value: "all_notifications",
      label: "All Notifications",
      icon: <Layers size={18} />,
    },
    { value: "unread", label: "Unread", icon: <MailQuestionMark size={18} /> },
    { value: "chats", label: "Chats", icon: <MessageSquare size={18} /> },
    { value: "groups", label: "Groups", icon: <Users size={18} /> },
    { value: "posts", label: "Posts", icon: <BsFilePost size={18} /> },
    {
      value: "announcements",
      label: "Announcements",
      icon: <Megaphone size={18} />,
    },
    { value: "likes", label: "Likes", icon: <Heart size={18} /> },
    { value: "replies", label: "Replies", icon: <FaReply size={18} /> },
    { value: "courses", label: "Courses", icon: <BookOpen size={18} /> },
    {
      value: "friend_requests",
      label: "Friend Requests",
      icon: <UserPlus size={18} />,
    },
    { value: "mentions", label: "Mentions", icon: <AtSign size={18} /> },
    { value: "system", label: "System", icon: <Settings size={18} /> },
  ];

  return (
    <div className="filter-sidebar-card">
      {categories.map((cat) => {
        const isActive = active === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`filter-btn ${isActive ? "active" : "inactive"}`}
          >
            <span
              className={`filter-icon-span ${isActive ? "active" : "inactive"}`}
            >
              {cat.icon}
            </span>
            <span className="filter-label-span">{cat.label}</span>
            <span
              className={`filter-count-badge ${isActive ? "active" : "inactive"}`}
            >
              {counts[cat.value] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default Notifications;
