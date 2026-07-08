import "./postRedirect.css";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePostRedirectInfo } from "../hooks/usePostRedirect";

function PostRedirect() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = usePostRedirectInfo(postId);

  useEffect(() => {
    if (!data) return;
    if (!data.postExists) {
      toast.error("This post no longer exists.");
      navigate("/home/dashboard");
      return;
    }
    if (!data.isMember) {
      toast.error("You must be a member of this group to view this post.");
      navigate("/home/dashboard");
      return;
    }
    navigate(`/home/group/${data.groupId}/posts?highlight=${postId}`);
  }, [data]);

  if (!isLoading) return null; // redirect happens instantly once data resolves

  return (
    <div className="post-redirect-loading">
      <div className="post-redirect-card">
        <div className="post-redirect-spinner-wrap">
          <div className="post-redirect-spinner" />
        </div>
        <p className="post-redirect-title">Opening post</p>
        <p className="post-redirect-subtitle">
          Checking you have access to this group
        </p>
      </div>
    </div>
  );
}
export default PostRedirect;
