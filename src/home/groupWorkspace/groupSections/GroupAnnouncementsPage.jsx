import "./GroupAnnouncements.css";
import { useState } from "react";
import AddAnnounce from "../groupModals/AddAnnounce";
import GroupPageHeader from "../GroupWorkspaceHeader";
import { MegaphoneIcon, BellPlusIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAnnounces } from "../../../hooks/useAnnounce";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import AnnounceCard from "./groupCards/AnnounceCard";
function GroupAnnouncementsPage() {
  const { groupId } = useParams();
  const {
    data: storedAnnouncements,
    isLoading,
    isError,
  } = useAnnounces(groupId);

  const [announceModal, setAnnounceModal] = useState(false);
  function handleAnnounceModal() {
    setAnnounceModal((prev) => !prev);
  }

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Errrrorrr</div>;

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

      <div className="storedAnnouncements-cards">
        {storedAnnouncements.map((announce) => {
          return <AnnounceCard announce={announce} key={announce.id} />;
        })}
      </div>
    </div>
  );
}
export default GroupAnnouncementsPage;
