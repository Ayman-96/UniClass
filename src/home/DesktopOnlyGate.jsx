import { useState, useEffect } from "react";

function checkIsDesktop() {
  const ua = navigator.userAgent.toLowerCase();
  const isMobileUA = /iphone|ipod|android.*mobile/.test(ua);
  const isWideEnough = window.innerWidth >= 768; // pick your breakpoint

  return !isMobileUA && isWideEnough;
}

function DesktopOnlyGate({ children }) {
  const [isDesktop, setIsDesktop] = useState(checkIsDesktop());
  const [continueOnMobile, setContinueOnMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(checkIsDesktop());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isDesktop && !continueOnMobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: "32px",
          textAlign: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: "12px",
          }}
        >
          We Strongly Recommend Using Desktop
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#5a5a5a",
            maxWidth: "360px",
            lineHeight: 1.5,
            marginBottom: "8px",
          }}
        >
          UniClass is responsive and works on mobile devices too.
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#5a5a5a",
            maxWidth: "360px",
            lineHeight: 1.5,
            marginBottom: "24px",
          }}
        >
          <strong>However</strong>, for best experience, we strongly recommend
          using a desktop or laptop. On mobile, turning on{" "}
          <strong>"Desktop site"</strong> mode from your browser menu will give
          you best experience.
        </p>
        <button
          onClick={() => setContinueOnMobile(true)}
          style={{
            padding: "10px 22px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#1a9e78",
            background: "transparent",
            border: "1.5px solid #1a9e78",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          No, Continue on Mobile
        </button>
      </div>
    );
  }

  return children;
}

export default DesktopOnlyGate;
