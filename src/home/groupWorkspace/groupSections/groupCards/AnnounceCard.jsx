import "./AnnounceCard.css";
import { useState } from "react";
import {
  Clock,
  HeartHandshake,
  MessageCircleQuestionMark,
  ThumbsDown,
} from "lucide-react";
import { useDeleteAnnounce } from "../../../../hooks/useAnnounce";
const announcementButtons = [
  { name: "comment", icon: <MessageCircleQuestionMark />, ammount: 0 },
  {
    name: "like",
    icon: <HeartHandshake />,
    ammount: 0,
  },
  {
    name: "unlike",
    icon: <ThumbsDown />,
    ammount: 0,
  },
];
function AnnounceCard({ announce }) {
  const { mutate: deleteAnnounce, isPending } = useDeleteAnnounce();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const postedTime = new Date(announce.created_at).toLocaleDateString();

  return (
    <div className="announce-overylay">
      <div className="announce-card">
        <div className="announcement-head">
          <div className="rep-info">
            <div className="rep-pro-pic">MN</div>
            <div className="rep-name">
              <p>Rep Name</p>
              <p>
                <span>{postedTime}</span> • Group Name
              </p>
            </div>
          </div>
        </div>
        {confirmDelete && (
          <div className="delete-confirm-row">
            <button
              className="confirm-yes"
              onClick={() => deleteAnnounce({ announceId: announce.id })}
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
        <div className="announce-icon"></div>
      </div>

      <div className="announcement-body">
        <div className="announce-title">{announce.title}</div>
        <div className="announce-content">{announce.content}</div>
      </div>

      <div className="announcement-footer">
        <div className="time-announced">
          <Clock /> {postedTime}
        </div>
        <div className="announced-buttons">
          {announcementButtons.map((button) => {
            return (
              <button key={button.name} className={button.name}>
                {button.ammount}
                {button.icon}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AnnounceCard;
