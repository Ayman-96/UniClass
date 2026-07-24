import "./GroupAnnouncements.css";
import { useState } from "react";
import AddAnnounce from "./groupModals/AddAnnounce";
import GroupPageHeader from "../../GroupWorkspaceHeader";
import { MegaphoneIcon, BellPlusIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  useAnnouncementLikes,
  useAnnounces,
  useToggleAnnouncementLike,
} from "../../../../hooks/useAnnounce";
import LoadingSpinner from "../../../../components/loadingSpinner/LoadingSpinner";
import AnnounceCard from "../groupCards/AnnounceCard";
import { useAuth } from "../../../../AuthContext";
function GroupAnnouncementsPage() {
  const { user } = useAuth();
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
  const announcementIds = storedAnnouncements?.map(
    (announcement) => announcement.id,
  );
  const { data: likes } = useAnnouncementLikes(announcementIds);
  const { mutate: toggleLike } = useToggleAnnouncementLike();

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
          requiredRep={true}
        />
      </div>

      <div className="announcement-body">
        {announceModal && (
          <AddAnnounce handleAnnounceModal={handleAnnounceModal} />
        )}
      </div>

      <div className="storedAnnouncements-cards">
        {storedAnnouncements.map((announce) => {
          const announceLikes =
            likes?.filter((l) => l.announcement_id === announce.id) ?? [];
          const myVote =
            announceLikes.find((l) => l.user_id === user.id)?.type ?? null;
          const likeCount = announceLikes.filter(
            (l) => l.type === "like",
          ).length;
          const dislikeCount = announceLikes.filter(
            (l) => l.type === "dislike",
          ).length;

          return (
            <AnnounceCard
              key={announce.id}
              announce={announce}
              myVote={myVote}
              likeCount={likeCount}
              dislikeCount={dislikeCount}
              toggleLike={toggleLike}
            />
          );
        })}
      </div>
    </div>
  );
}
export default GroupAnnouncementsPage;
