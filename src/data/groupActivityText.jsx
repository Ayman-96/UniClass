import {
  Video,
  BookOpen,
  MessageSquare,
  Megaphone,
  UserPlus,
  ShieldCheck,
  Lock,
  ImageUp,
  Calendar,
  Crown,
  UserMinus,
} from "lucide-react";

export function formatActivityText(item) {
  const actor = (
    <span className="activity-actor">{item.actor?.username || "Someone"}</span>
  );
  switch (item.type) {
    case "group_created":
      return <>Group created by {actor}</>;
    case "lecture_added":
      return (
        <>
          New lecture "{item.metadata.lecture_title}" added to{" "}
          <span className="activity-entity">{item.metadata.course_name}</span>
        </>
      );
    case "course_added":
      return (
        <>
          New course{" "}
          <span className="activity-entity">"{item.metadata.course_name}"</span>{" "}
          added
        </>
      );
    case "post_added":
      return <>{actor} added a post</>;
    case "announcement_added":
      return <>Rep {actor} added an announcement</>;
    case "member_joined":
      return <>{actor} joined the group</>;
    case "member_promoted":
      return <>{actor} was promoted to Moderator</>;
    case "visibility_changed": {
      const label = item.metadata.visibility.replace("_", " ");
      const formatted = label.charAt(0).toUpperCase() + label.slice(1);
      return (
        <>
          Group accessibility changed to{" "}
          <span className="activity-entity">{formatted}</span>
        </>
      );
    }
    case "member_left":
      return <>{actor} left the group</>;
    case "member_promoted_rep":
      return <>{actor} was promoted to Rep</>;
    case "group_media_updated":
      return (
        <>
          Group {item.metadata.avatar_changed ? "avatar" : "banner"} has been
          updated
        </>
      );
    default:
      return "Group activity";
  }
}
export const GROUP_ACTIVITY_ICON_MAP = {
  group_created: { icon: Calendar, color: "#8a6dff", bg: "#f1edff" },
  lecture_added: { icon: Video, color: "#6d8dff", bg: "#edf1ff" },
  course_added: { icon: BookOpen, color: "#1a9e78", bg: "#e8f7f1" },
  post_added: { icon: MessageSquare, color: "#3ba0e0", bg: "#eaf6fd" },
  announcement_added: { icon: Megaphone, color: "#e0973b", bg: "#fdf3ea" },
  member_joined: { icon: UserPlus, color: "#1a9e78", bg: "#e8f7f1" },
  visibility_changed: { icon: Lock, color: "#8a8a8a", bg: "#f0f0f0" },
  group_media_updated: { icon: ImageUp, color: "#e05b8c", bg: "#fdeaf1" },
  member_promoted: { icon: Crown, color: "#e0973b", bg: "#fdf3ea" },
  member_promoted_rep: { icon: ShieldCheck, color: "#8a6dff", bg: "#f2ecff" },
  member_left: { icon: UserMinus, color: "#e05b5b", bg: "#fdeaea" },
};
