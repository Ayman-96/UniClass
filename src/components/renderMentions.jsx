import { NavLink, useParams } from "react-router-dom";
import { useSingleGroup } from "../hooks/useGroups";

const LINK_REGEX =
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)|(\b[a-zA-Z0-9-]+\.(?:com|org|net|io|dev|co|edu|gov)\b(?:\/[^\s]*)?)/g;

function renderLinksInText(text, keyPrefix) {
  const nodes = [];
  let lastIndex = 0;
  let match;
  let i = 0;

  LINK_REGEX.lastIndex = 0;
  while ((match = LINK_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const displayText = match[1] || match[3] || match[4];
    let url = match[2] || match[3] || match[4];
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    nodes.push(
      <a
        key={keyPrefix + "-link-" + i++}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="post-link"
      >
        {displayText}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export function renderMentions(content, members = []) {
  const { groupId } = useParams();
  const { data: currentGroup } = useSingleGroup(groupId);
  if (!content) return null;

  const idToCurrentUsername = new Map(
    members.map((m) => [m.profiles?.tag, m.profiles?.username]),
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
          to={`/profile/${userTag}`}
          className="mention-tag"
          style={{ color: currentGroup?.color }}
        >
          @{currentUsername}
        </NavLink>
      );
    }
    return <span key={i}>{renderLinksInText(part, i)}</span>;
  });
}
