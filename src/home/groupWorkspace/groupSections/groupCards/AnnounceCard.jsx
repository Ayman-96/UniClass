import "./AnnounceCard.css";
import { useState } from "react";
import {
  BellIcon,
  Clock,
  HeartHandshake,
  MessageCircleQuestionMark,
  ThumbsDown,
  Trash2,
} from "lucide-react";
import {
  useDeleteAnnounce,
  useAnnouncementComments,
} from "../../../../hooks/useAnnounce";
import AnnounceComments from "./AnnounceComments";
import { announceTypes } from "../../../../data/addAnnounceData";
import { NavLink, useParams } from "react-router-dom";
import { useIsRep } from "../../../../hooks/useIsRep";
import { useSingleGroup } from "../../../../hooks/useGroups";
import { formatDistanceToNow } from "date-fns";
import { useGroupMembers } from "../../../../hooks/useGroupMembers";
function AnnounceCard({
  announce,
  myVote,
  likeCount,
  dislikeCount,
  toggleLike,
}) {
  const { groupId } = useParams();
  const { data: isRep } = useIsRep(groupId);
  const [openComments, setOpenComments] = useState(false);
  const { data: currentGroup } = useSingleGroup(groupId);
  const { data: storedComments } = useAnnouncementComments(announce.id);
  const { mutate: deleteAnnounce, isPending } = useDeleteAnnounce();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const postedTime = new Date(announce.created_at).toLocaleDateString();
  const announcementButtons = [
    {
      name: "like",
      icon: <HeartHandshake />,
      amount: likeCount,
      onCLick: () =>
        toggleLike({
          announcementId: announce.id,
          currentVote: myVote,
          newType: "like",
        }),
    },
    {
      name: "dislike",
      icon: <ThumbsDown />,
      amount: dislikeCount,
      onCLick: () =>
        toggleLike({
          announcementId: announce.id,
          currentVote: myVote,
          newType: "dislike",
        }),
    },
    {
      name: "comment",
      icon: <MessageCircleQuestionMark />,
      amount: storedComments?.length,
      onCLick: () => setOpenComments(true),
    },
  ];
  const { data: members } = useGroupMembers(groupId);
  const authorMembership = members?.find((m) => m.user_id === announce.rep_id);
  const isMod = authorMembership?.is_moderator;
  return (
    <div className="announce-overylay">
      <div className="announce-card">
        <div className="announcement-head">
          <div className="rep-info">
            <NavLink to={`/profile/${announce.rep_id}`}>
              <img
                src={announce.profiles.avatar_url}
                className="author-pro-pic"
              />
            </NavLink>
            <div className="rep-name">
              <p>
                {announce.profiles.username}{" "}
                <span style={{ color: currentGroup?.color }}>
                  {isMod && "(Mod)"}
                </span>
              </p>
              <p>
                {formatDistanceToNow(new Date(announce.created_at), {
                  addSuffix: true,
                })}{" "}
                •{" "}
                <span style={{ color: currentGroup?.color }}>
                  {currentGroup?.name}
                </span>
              </p>
            </div>
          </div>
        </div>
        {!confirmDelete && isRep && (
          <div
            onClick={() => setConfirmDelete(true)}
            style={{ color: "#aa1e12" }}
          >
            <Trash2 size={14} />
          </div>
        )}
        {confirmDelete && (
          <div className="delete-confirm-row">
            <button
              className="confirm-yes"
              onClick={() => deleteAnnounce(announce.id)}
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
        <div className="announce-icon">
          {announceTypes[announce.icon] || <BellIcon />}
        </div>
      </div>

      <div className="announcement-body">
        <div className="announce-title">{announce.title}</div>
        <div className="announce-content">{announce.content}</div>
        {announce.img_url && (
          <img
            src={announce.img_url}
            alt="post attachment"
            className="announce-img"
          />
        )}
      </div>

      <div className="announcement-footer">
        <div className="time-announced">
          <Clock /> {postedTime}
        </div>
        <div className="announced-buttons">
          {announcementButtons.map((button) => {
            return (
              <button
                key={button.name}
                className={`announce-btn ${myVote === button.name ? button.name : ""}`}
                onClick={button.onCLick}
              >
                {button.amount}
                {button.icon}
              </button>
            );
          })}
        </div>
      </div>
      <div className="post-comments">
        {openComments && (
          <AnnounceComments
            setOpenComments={setOpenComments}
            storedComments={storedComments}
            announceId={announce.id}
          />
        )}
      </div>
    </div>
  );
}

export default AnnounceCard;
