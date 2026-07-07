import { NavLink, useParams } from "react-router-dom";
import { useSingleGroup } from "../hooks/useGroups";

export function renderMentions(content, members = []) {
  const { groupId } = useParams();
  const { data: currentGroup } = useSingleGroup(groupId);
  console.log(currentGroup);
  if (!content) return null;

  // Optional: build a fresh id -> current username map, so renamed users show their NEW name
  const idToCurrentUsername = new Map(
    members.map((m) => [m.profiles.tag, m.profiles?.username]),
  );

  const parts = content.split(/(@\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, i) => {
    const match = part.match(/^@\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      const [, storedUsername, userTag] = match;
      const currentUsername =
        idToCurrentUsername.get(userTag) || storedUsername;
      return (
        <NavLink
          key={i}
          to={`/profile/$}`}
          className="mention-tag"
          style={{ color: currentGroup?.color }}
        >
          @{currentUsername}
        </NavLink>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
