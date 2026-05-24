import GroupPageHeader from "./GroupPageHeader";
import { MegaphoneIcon, BellPlusIcon } from "lucide-react";
function GroupAnnouncementsPage() {
  return (
    <div className="announcements-page">
      <div className="announcemets-header">
        <GroupPageHeader
          titleIcon={<MegaphoneIcon />}
          title="Announcements"
          btnIcon={<BellPlusIcon />}
          btnTitle="Add Announcement"
        />
      </div>
    </div>
  );
}
export default GroupAnnouncementsPage;
