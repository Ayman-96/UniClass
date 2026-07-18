import "./LectureDiscussion.css";
import { useMemo } from "react";
import DiscussionCard from "./DiscussionCard";

function groupComments(comments) {
  const parents = [];
  const repliesByParent = {};

  for (const comment of comments) {
    if (comment.parent_comment_id) {
      if (!repliesByParent[comment.parent_comment_id]) {
        repliesByParent[comment.parent_comment_id] = [];
      }
      repliesByParent[comment.parent_comment_id].push(comment);
    } else {
      parents.push(comment);
    }
  }

  return parents.map((parent) => ({
    ...parent,
    replies: repliesByParent[parent.id] || [],
  }));
}

function DiscussionCollection({
  storedComments,
  commentTypes,
  toggleLike,
  setIsEditing,
  handleEditComment,
  deleteComment,
  handleReply,
}) {
  const grouped = useMemo(
    () => groupComments(storedComments ?? []),
    [storedComments],
  );

  return (
    <>
      {grouped?.map((comment) => (
        <div key={comment.id}>
          <DiscussionCard
            comment={comment}
            commentTypes={commentTypes}
            toggleLike={toggleLike}
            setIsEditing={setIsEditing}
            handleEditComment={handleEditComment}
            deleteComment={deleteComment}
            handleReply={handleReply}
          />
          {comment.replies?.map((reply) => (
            <DiscussionCard
              key={reply.id}
              comment={reply}
              isReply
              commentTypes={commentTypes}
              toggleLike={toggleLike}
              setIsEditing={setIsEditing}
              handleEditComment={handleEditComment}
              deleteComment={deleteComment}
              handleReply={handleReply}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default DiscussionCollection;
