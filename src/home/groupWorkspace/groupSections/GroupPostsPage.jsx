import { useState } from "react";
import AddPost from "../groupModals/AddPost";
import GroupPageHeader from "../GroupWorkspaceHeader";
import { MessageSquareText, MessageSquarePlus } from "lucide-react";
function GroupPostsPage() {
  const [postModal, setPostModal] = useState(false);
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
    </div>
  );
}
export default GroupPostsPage;
