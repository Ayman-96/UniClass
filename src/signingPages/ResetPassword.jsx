import "./ResetPassword.css";
import { useState } from "react";
import { supabase } from "../supabase";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

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

  if (sent)
    return (
      <div className="forgot-modal">
        <div className="forgot-header">
          <Logo />
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
        <Logo />
        <h1>Forgot password?</h1>
        <p>Enter your university email and we'll send you a reset link</p>
      </div>

      <div className="forgot-body">
        <div className="email-input">
          <label htmlFor="reset-email">University email</label>
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
