import { useState } from "react";
import { supabase } from "../supabase";
import { Eye, EyeOff, Key, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import "./SignIn.css";
import { Link, NavLink } from "react-router-dom";
import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";
function SignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPass, setShowPass] = useState(false);

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

  const signInWithEmail = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    // Set session persistence based on remember me
    setLoading(true);
    await supabase.auth.setSession({
      persistSession: rememberMe, // true = stay logged in, false = session only
    });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      if (error.message === "Invalid login credentials") {
        setError("Wrong email or password");
        return;
      } else {
        setError(error.message);
        return;
      }
    }
  };

  return (
    <div className="sign-in-modal">
      <div className="signin-header">
        <NavLink to="/Home" className="logo">
          <div className="uniclass-logo">
            <img src="/AppFavicon.png" alt="UniCLass" />
          </div>
          <div className="plat-name">
            <h2>UniClass</h2>
            <p>Student Learning Platform</p>
          </div>
        </NavLink>
        <div className="sin-hed-title">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>
      </div>

      <div className="signin-body">
        <div className="email-input email">
          <label htmlFor="email">Email</label>
          <Mail className="icon mail-icon" />
          <input
            type="email"
            placeholder="you@university.edu"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className="email-input password">
          <label htmlFor="password">Password</label>
          <Key className="icon pass-icon" />
          <input
            type={showPass ? "text" : "password"}
            placeholder="password***"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="eye-btn" onClick={() => setShowPass((p) => !p)}>
            {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      <div className="signin-action">
        <div className="signin-rememberance">
          <div>
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />{" "}
            <label htmlFor="remember">Remember me</label>
          </div>
          <Link to="/resetPassword" className="forget-pass">
            Forgot Password?
          </Link>
        </div>

        <div className="absolute-loading">{loading && <LoadingSpinner />}</div>

        {error && <p className="signup-error">{error}</p>}
        <div className="sign-btns">
          <button className="sign-with-email" onClick={signInWithEmail}>
            {loading ? "Checking..." : "Sign in"}
          </button>

          <p>or continue with</p>

          <button className="sign-with-google" onClick={signInWithGoogle}>
            <FcGoogle /> Sign In with Google
          </button>

          <div className="no-acc-signup">
            Don't have an account? <NavLink to="/signUp">Sign up here!</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
