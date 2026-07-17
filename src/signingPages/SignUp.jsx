import "./SignUp.css";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";
import AnimatedBackground from "../animated/AnimatedBackground";
import { Logo } from "../components/Logo";
function SignUp() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  // const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/home`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
  };

  const signUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    // if (!agreed) {
    //   setError("You have to agree to the terms");
    //   return;
    // }
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/home`,
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else if (data?.user?.identities?.length === 0) {
      await supabase.auth.signOut();
      setError("An account with this email already exists");
    } else setSuccess(true);
  };
  return (
    <AnimatedBackground>
      <div className="auth-page-center">
        <div className="sign-up-modal">
          <div className="signup-header">
            <Logo />
            <div className="sin-hed-title">
              <h1>Create an Account for Free!</h1>
              <p>Join Your Group & Start Discussions</p>
            </div>
          </div>
          {success ? (
            <div className="signup-success">
              <h2>Check your email</h2>
              <p>
                We sent a confirmation link to <strong>{email}</strong>. Click
                it to activate your account.
              </p>
            </div>
          ) : (
            <div className="signin-body">
              <div className="user-input">
                <label htmlFor="email">Email</label>
                <Mail className="user-icon" />
                <input
                  type="email"
                  placeholder="you@university.edu"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="user-input">
                <label htmlFor="password">Password</label>
                <LockKeyhole className="icon pass-icon" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Type a strong password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="eye-btn"
                  onClick={() => setShowPass((p) => !p)}
                >
                  {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>

              <div className="user-input">
                <label htmlFor="password">Confirm Password</label>
                <LockKeyhole className="icon pass-icon" />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Repeat the password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="eye-btn"
                  onClick={() => setShowConfirmPass((p) => !p)}
                >
                  {showConfirmPass ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          )}

          <div className="signup-action">
            {/* <div className="terms-row">
          <input
            type="checkbox"
            id="agreement"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label htmlFor="agreement">
            I agree to the <span>Terms of Service</span> and{" "}
            <span>Privacy Policy</span>
          </label>
        </div> */}

            <div className="absolute-loading">
              {loading && <LoadingSpinner />}
            </div>
            {error && <p className="signup-error">{error}</p>}

            <div className="create-btns">
              <button
                className="create-acc-btn"
                onClick={signUp}
                disabled={loading}
              >
                {loading ? "Checking..." : "Create Account"}
              </button>
              <p>or continue with</p>

              <button className="sign-with-google" onClick={signInWithGoogle}>
                <FcGoogle /> Sign Up with Google
              </button>
            </div>

            <div className="no-acc-signup">
              Already have an account? <Link to="/signIn">Sign in!</Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
}
export default SignUp;
