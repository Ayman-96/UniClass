// LoadingSpinner.jsx
// Usage:
//   <LoadingSpinner />                        — default, fullscreen centered
//   <LoadingSpinner size="small" />           — inline/small
//   <LoadingSpinner message="Fetching data" /> — custom message
//   <LoadingSpinner inline />                 — no min-height, fits inside a card

import "./LoadingSpinner.css";

function LoadingSpinner({
  size = "default",
  message = "Loading...",
  inline = false,
}) {
  return (
    <div
      className={`spinner-wrapper ${inline ? "spinner-inline" : "spinner-fullpage"}`}
    >
      <div className={`spinner-ring spinner-ring--${size}`}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}

/*
// fullpage (dashboards, route-level)
if (isLoading) return <LoadingSpinner />;

// inside a card or panel
if (isLoading) return <LoadingSpinner inline message="Fetching groups..." />;

// tiny inline next to a button
<LoadingSpinner size="small" message="" />
 */
export default LoadingSpinner;
