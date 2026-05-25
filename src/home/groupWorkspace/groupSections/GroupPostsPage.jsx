import GroupPageHeader from "./GroupPageHeader";
import { MessageSquareText, MessageSquarePlus } from "lucide-react";
function GroupPostsPage() {
  return (
    <div className="posts-page">
      <div className="posts-header">
        <GroupPageHeader
          titleIcon={<MessageSquareText />}
          title="posts"
          btnIcon={<MessageSquarePlus />}
          btnTitle="Add Post"
        />
      </div>
    </div>
  );
}
export default GroupPostsPage;
