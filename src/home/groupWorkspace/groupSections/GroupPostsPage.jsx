import { useState } from "react";
import AddPost from "../groupModals/AddPost";
import GroupPageHeader from "../GroupWorkspaceHeader";
import { MessageSquareText, MessageSquarePlus } from "lucide-react";
import { useParams } from "react-router-dom";
import { usePosts } from "../../../hooks/usePosts";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import PostCard from "./groupCards/PostCard";

function GroupPostsPage() {
  const { groupId } = useParams();
  const [postModal, setPostModal] = useState(false);
  const { data: storedPosts, isLoading, isError } = usePosts(groupId);

  console.log(storedPosts);
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
        />
      </div>

      <div className="posts-body">
        {postModal && <AddPost handlePostModal={handlePostModal} />}
      </div>

      <div className="storedPosts-cards">
        {storedPosts.map((post) => {
          return <PostCard key={post.id} post={post} />;
        })}
      </div>
    </div>
  );
}
export default GroupPostsPage;
