import "./PostCard.css";
import { useState } from "react";
import { useDeletePost, usePostComments } from "../../../../hooks/usePosts";
import {
  Download,
  HeartHandshake,
  MessageSquareText,
  Redo2,
} from "lucide-react";
import PostComments from "./PostComments";
import {
  formatFileSize,
  getFileStyle,
} from "../../../../data/addCourseData.jsx";
import LoadingSpinner from "../../../../components/loadingSpinner/LoadingSpinner.jsx";
import { NavLink, useParams } from "react-router-dom";
import { useIsRep } from "../../../../hooks/useIsRep.js";
import { useSingleGroup } from "../../../../hooks/useGroups.js";
import { formatDistanceToNow } from "date-fns";
import handleDownload from "../../../../components/DownloadFile.js";
import { renderMentions } from "../../../../components/renderMentions.jsx";
import { useGroupMembers } from "../../../../hooks/useGroupMembers.js";

function PostCard({ post, isLiked, likeCount, toggleLike }) {
  const { groupId } = useParams();
  const { data: isRep } = useIsRep(groupId);
  const { data: currentGroup } = useSingleGroup(groupId);
  const [openComments, setOpenComments] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data: storedComments } = usePostComments(post.id);
  const { mutate: deletePost, isPending, isError } = useDeletePost();
  const { data: groupMember = [] } = useGroupMembers(groupId);
  const postedTime = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
  });

  if (isPending) return <LoadingSpinner />;
  if (isError) return <div>Error Occured...</div>;
  return (
    <div className="post-overylay">
      <div className="post-card">
        <div className="post-head">
          <div className="author-info">
            <NavLink to={`/profile/${post.author_id}`}>
              <img src={post.profiles.avatar_url} className="author-pro-pic" />
            </NavLink>
            <div className="author-name">
              <p>{post.profiles.username}</p>
              <p>
                {postedTime} •{" "}
                <span style={{ color: currentGroup?.color }}>
                  {post.profiles.role}{" "}
                </span>
              </p>
            </div>
          </div>
          {isRep && (
            <button
              className="post-setting"
              onClick={() => setConfirmDelete(true)}
            >
              •••
            </button>
          )}
          {confirmDelete && (
            <div className="delete-confirm-row">
              <button
                className="confirm-yes"
                onClick={() => deletePost({ postId: post.id })}
                disabled={isPending}
              >
                {isPending ? "Almost" : "Delete"}
              </button>
              <button
                className="confirm-no"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="post-body">
          <p className="post-content">
            {renderMentions(post.content, groupMember)}
          </p>
          {post.img_url && (
            <img
              src={post.img_url}
              alt="post attachment"
              className="post-img"
            />
          )}

          <div className="post-files">
            {post.post_files?.map((file) => {
              const { icon: Icon, bg, color } = getFileStyle(file.type);
              return (
                <a
                  href={file.url}
                  key={file.url}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="file-attachement"
                  style={{ "--group-color": currentGroup?.color }}
                >
                  <div className="file-icon" style={{ background: bg, color }}>
                    <Icon size={18} />
                  </div>
                  <div className="file-attach-details">
                    <div>{file.name}</div>
                    <p>{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    style={{ color }}
                    className="download-file"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDownload(
                        file.url,
                        file.name,
                        "Downloading File...",
                      );
                    }}
                  >
                    <Download />
                  </button>
                </a>
              );
            })}
          </div>
        </div>

        <div className="post-interactions">
          <button
            className={`like-post ${isLiked ? "liked" : ""}`}
            onClick={() =>
              toggleLike({ postId: post.id, isCurrentlyLiked: isLiked })
            }
          >
            <HeartHandshake /> {likeCount}
          </button>
          <button
            className="comment-post"
            onClick={() => setOpenComments(true)}
          >
            <MessageSquareText /> {storedComments?.length}
          </button>
          <button className="share-post">
            <Redo2 />
          </button>
        </div>
      </div>

      <div className="post-comments">
        {openComments && (
          <PostComments
            setOpenComments={setOpenComments}
            storedComments={storedComments}
            postId={post.id}
          />
        )}
      </div>
    </div>
  );
}
export default PostCard;
