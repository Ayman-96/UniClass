import { useGroupActivity } from "../../../../../hooks/useGroupActivity";
import { formatDistanceToNow } from "date-fns";
import { ActivityIcon } from "lucide-react";
import {
  formatActivityText,
  GROUP_ACTIVITY_ICON_MAP,
} from "../../../../../data/groupActivityText";

export default function GroupActivity({ groupId }) {
  const { data: activity = [], isLoading } = useGroupActivity(groupId);

  return (
    <div className="activity-card">
      <div className="activity-card-header">
        <ActivityIcon className="activity-card-header-icon" />
        <h3>Activity</h3>
      </div>

      {isLoading && <div className="activity-loading">Loading...</div>}

      {!isLoading && activity.length === 0 && (
        <div className="activity-empty">No activity yet</div>
      )}

      <div className="activity-list">
        {activity.map((item) => {
          const config = GROUP_ACTIVITY_ICON_MAP[item.type] || {
            icon: ActivityIcon,
            color: "#8a8a8a",
            bg: "#f0f0f0",
          };
          const Icon = config.icon;

          return (
            <div key={item.id} className="activity-item">
              <div
                className="activity-icon-wrap"
                style={{ backgroundColor: config.bg }}
              >
                <Icon
                  className="activity-icon"
                  style={{ color: config.color }}
                />
              </div>
              <div className="activity-text">
                <p className="activity-title">{formatActivityText(item)}</p>
              </div>
              <span className="activity-time">
                {formatDistanceToNow(new Date(item.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
