import "./ResetPassword.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
      }
    });

    // also catch case where session already exists on load (e.g. page refresh after recovery)
    supabase.auth.getSession().then(() => {
      if (window.location.hash.includes("type=recovery")) {
        setRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/resetPassword`,
    });
    if (error) setError(error.message);
    else setSent(true);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setUpdating(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setUpdating(false);
    if (error) setError(error.message);
    else {
      // success — redirect to login or home
      window.location.href = "/";
    }
  };

  if (recoveryMode) {
    return (
      <div className="forgot-modal">
        <div className="forgot-header">
          <Logo />
          <h1>Set new password</h1>
          <p>Enter a new password for your account</p>
        </div>

        <div className="forgot-body">
          <div className="email-input">
            <label htmlFor="new-password">New Password</label>
            <div className="input-wrap">
              <input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="forgot-error">{error}</p>}
        </div>

        <div className="forgot-actions">
          <button
            className="reset-btn"
            onClick={handleUpdatePassword}
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    );
  }

  if (sent)
    return (
      <div className="forgot-modal">
        <div className="forgot-header">
          <div className="logo">
            <div className="uniclass-logo">
              <img src="/AppFavicon.png" alt="UniCLass" />
            </div>
            <div className="plat-name">
              <h2>UniClass</h2>
              <p>Student Learning Platform</p>
            </div>
          </div>
          <h1>Check your inbox</h1>
          <p>
            We sent a reset link to <span className="sent-email">{email}</span>
          </p>
        </div>
        <div className="sent-icon">✉</div>
        <p className="sent-note">
          Didn't receive it? Check your spam folder or{" "}
          <button className="resend-btn" onClick={() => setSent(false)}>
            try again
          </button>
        </p>
      </div>
    );

  return (
    <div className="forgot-modal">
      <div className="forgot-header">
        <div className="logo">
          <div className="uniclass-logo">
            <img src="/AppFavicon.png" alt="UniCLass" />
          </div>
          <div className="plat-name">
            <h2>UniClass</h2>
            <p>Student Learning Platform</p>
          </div>
        </div>
        <h1>Forgot password?</h1>
        <p>Enter your email and we'll send you a reset link</p>
      </div>

      <div className="forgot-body">
        <div className="email-input">
          <label htmlFor="reset-email">Your Email</label>
          <div className="input-wrap">
            <Mail className="icon" />
            <input
              id="reset-email"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="forgot-error">{error}</p>}
      </div>

      <div className="forgot-actions">
        <button className="reset-btn" onClick={handleReset}>
          Send reset link
        </button>
        <Link to="/signIn" className="back-link">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default ResetPassword;
