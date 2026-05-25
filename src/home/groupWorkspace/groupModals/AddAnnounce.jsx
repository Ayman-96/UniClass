import "./AddAnnounce.css";
import { Link, Megaphone, Paperclip, ShieldCheck, X } from "lucide-react";
const announceAttachments = [
  {
    text: "File",
    icon: <Paperclip />,
  },
  {
    text: "Link",
    icon: <Link />,
  },
];
function AddAnnounce({ handleAnnounceModal }) {
  return (
    <div className="add-post-overlay">
      <div className="add-post-modal">
        <div className="modal-header">
          <div>
            <Megaphone /> <span>New Announcement</span>
          </div>
          <button className="close-modal" onClick={handleAnnounceModal}>
            <X />
          </button>
        </div>

        <div className="post-modal-body">
          <div className="rep-info">
            <div className="rep-pro-pic">MN</div>
            <div className="rep-name">
              <p>Rep Name</p>
              <p>Rep • Group Name</p>
            </div>
          </div>

          <div className="add-announce-details">
            <label htmlFor="announceTitle">Title</label>
            <textarea
              rows={4}
              id="announcement"
              name="announceTitle"
              className="announcement-title"
              placeholder="e.g. Midterm exam rescheduled"
            />
          </div>

          <div className="add-announce-details">
            <label htmlFor="announceType">Type</label>
            <div className="announce-types"></div>
          </div>

          <div className="add-announcement-details">
            <label htmlFor="announcementContent">Content</label>
            <textarea
              rows={3}
              id="announceContent"
              name="announceContent"
              className="announcement-content"
              placeholder="Weite your announcement details..."
            />
          </div>

          <div className="announce-hint">
            <span>
              <ShieldCheck />
            </span>{" "}
            Only the Group Representative can Post Announcements.
          </div>
        </div>

        <div className="announcement-footer">
          <div className="attach-buttons">
            {announceAttachments.map((attach) => {
              return (
                <button className="add-attach" key={attach.text}>
                  {attach.icon}
                  {attach.text}
                </button>
              );
            })}
          </div>
          <div className="announce-buttons">
            <button onClick={handleAnnounceModal}>Cancel</button>
            <button>
              <Megaphone />
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddAnnounce;
