import { useState } from "react";
import AddAnnounce from "../groupModals/AddAnnounce";
import GroupPageHeader from "../GroupWorkspaceHeader";
import { MegaphoneIcon, BellPlusIcon } from "lucide-react";
function GroupAnnouncementsPage() {
  const [announceModal, setAnnounceModal] = useState(false);
  function handleAnnounceModal() {
    setAnnounceModal((prev) => !prev);
  }
  return (
    <div className="announcements-page">
      <div className="announcemets-header">
        <GroupPageHeader
          titleIcon={<MegaphoneIcon />}
          title="Announcements"
          btnIcon={<BellPlusIcon />}
          btnTitle="Add Announcement"
          onButtonClick={handleAnnounceModal}
        />
      </div>
      <div className="announcement-body">
        {announceModal && (
          <AddAnnounce handleAnnounceModal={handleAnnounceModal} />
        )}
      </div>
    </div>
  );
}
export default GroupAnnouncementsPage;
