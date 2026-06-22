import "./GroupPostsPage.css";
import { useState } from "react";
import PostCard from "../groupCards/PostCard";
import { useParams } from "react-router-dom";
import AddPost from "../../groupModals/AddPost";
import {
  usePostLikes,
  usePosts,
  useToggleLike,
} from "../../../../hooks/usePosts";
import GroupPageHeader from "../../GroupWorkspaceHeader";
import { MessageSquareText, MessageSquarePlus } from "lucide-react";
import LoadingSpinner from "../../../../components/loadingSpinner/LoadingSpinner";
import { useAuth } from "../../../../AuthContext";

function GroupPostsPage() {
  const { groupId } = useParams();
  const [postModal, setPostModal] = useState(false);
  const { data: storedPosts, isLoading, isError } = usePosts(groupId);

  const { user } = useAuth();
  const postIds = storedPosts?.map((post) => post.id);
  const { data: likes } = usePostLikes(postIds);
  const { mutate: toggleLike } = useToggleLike();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Something went Wrong...! *(</div>;

  function handlePostModal() {
    setPostModal((prev) => !prev);
  }
  return (
    <div className="posts-page">
      <div className="posts-header">
        <GroupPageHeader
          titleIcon={<MessageSquareText />}
          title="posts"
          btnIcon={<MessageSquarePlus />}
          btnTitle="Add Post"
          onButtonClick={handlePostModal}
          requiredRep={false}
        />
      </div>

      <div className="posts-body">
        {postModal && <AddPost handlePostModal={handlePostModal} />}
      </div>

      <div className="storedPosts-cards">
        {storedPosts.map((post) => {
          const postLikes =
            likes?.filter((like) => like.post_id === post.id) ?? [];
          const isLiked = postLikes.some((like) => like.user_id === user.id);

          return (
            <PostCard
              key={post.id}
              post={post}
              isLiked={isLiked}
              likeCount={postLikes.length}
              toggleLike={toggleLike}
            />
          );
        })}
      </div>
    </div>
  );
}
export default GroupPostsPage;
