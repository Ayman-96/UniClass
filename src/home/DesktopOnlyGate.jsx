import { useState, useEffect } from "react";

function checkIsDesktop() {
  const ua = navigator.userAgent.toLowerCase();
  const isMobileUA = /iphone|ipod|android.*mobile/.test(ua);
  return !isMobileUA;
}

function DesktopOnlyGate({ children }) {
  const [isDesktop, setIsDesktop] = useState(checkIsDesktop());

  useEffect(() => {
    const handleResize = () => setIsDesktop(checkIsDesktop());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isDesktop) {
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
          Desktop Only
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
          UniClass is currently optimized for desktop and laptop screens.
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#5a5a5a",
            maxWidth: "360px",
            lineHeight: 1.5,
          }}
        >
          On mobile, please turn on <strong>"Desktop site"</strong> mode from
          your browser menu to continue.
        </p>
      </div>
    );
  }

  return children;
}

export default DesktopOnlyGate;
