import { useState } from "react";

function TextExpander({ children, color }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = children.length > 240;
  const text = isLong && !expanded ? children.slice(0, 240) + "..." : children;

  const btnStyle = {
    background: "none",
    border: "none",
    color: color,
    cursor: "pointer",
    fontWeight: 600,
    marginLeft: 4,
  };
  return (
    <div>
      {text}
      {isLong && (
        <button onClick={() => setExpanded((prev) => !prev)} style={btnStyle}>
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
export default TextExpander;
