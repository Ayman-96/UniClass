import "./PostCard.css";
import {
  ClipboardCheck,
  Download,
  HeartHandshake,
  MessageSquareText,
  Redo2,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import PostComments from "./PostComments";
import { formatDistanceToNow } from "date-fns";
import {
  formatFileSize,
  getFileStyle,
} from "../../../../data/addCourseData.jsx";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { useIsRep } from "../../../../hooks/useIsRep.js";
import { useSingleGroup } from "../../../../hooks/useGroups.js";
import handleDownload from "../../../../components/DownloadFile.js";
import { useGroupMembers } from "../../../../hooks/useGroupMembers.js";
import { renderMentions } from "../../../../components/renderMentions.jsx";
import { useDeletePost, usePostComments } from "../../../../hooks/usePosts";
import { useAuth } from "../../../../AuthContext.jsx";
import useLightboxStore from "../../../../store/useLightboxStore.js";
import defaultAvatar from "../../../../assets/default-avatar.svg";

function PostCard({ post, isLiked, likeCount, toggleLike }) {
  const { user } = useAuth();
  const { groupId } = useParams();

  const [copied, setCopied] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: isRep } = useIsRep(groupId);
  const { data: currentGroup } = useSingleGroup(groupId);
  const { data: storedComments = [] } = usePostComments(post.id);
  const { data: groupMember = [] } = useGroupMembers(groupId);
  const { mutate: deletePost, isPending } = useDeletePost();

  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const highlightedRef = useRef(null);

  useEffect(() => {
    if (highlightId && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightId]);

  const postedTime = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
  });
  function handleCopy(postId) {
    if (!navigator.clipboard) {
      toast.error("Clipboard not available in this browser");
      return;
    }

    navigator.clipboard
      .writeText(`${window.location.origin}/post/${postId}`)
      .then(() => {
        setCopied(true);
        toast.success("Link Copied to Clipboard !");
        setTimeout(() => setCopied(false), 2000);
      });
  }

  return (
    <div
      className={`post-overylay ${post.id === highlightId ? "post-highlighted" : ""}`}
      ref={post.id === highlightId ? highlightedRef : null}
    >
      <div className="post-card">
        <div className="post-head">
          <div className="author-info">
            <NavLink to={`/profile/${post.author_id}`}>
              <img
                src={post.profiles?.avatar_url || defaultAvatar}
                className="author-pro-pic"
              />
            </NavLink>
            <div className="author-name">
              <p>{post.profiles?.username}</p>
              <p>
                {postedTime} •{" "}
                <span style={{ color: currentGroup?.color }}>
                  {post.profiles?.role}{" "}
                </span>
              </p>
            </div>
          </div>
          {(isRep || post.author_id === user?.id) && (
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
                onClick={() => deletePost({ postId: post.id, groupId })}
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
              onClick={() =>
                useLightboxStore.getState().openLightbox([post.img_url])
              }
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
          <button className="share-post" onClick={() => handleCopy(post?.id)}>
            {copied ? <ClipboardCheck /> : <Redo2 />}
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
