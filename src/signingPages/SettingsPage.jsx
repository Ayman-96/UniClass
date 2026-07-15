import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useUpdatePassword, useDeleteAccount } from "../hooks/useSettings";
import { supabase } from "../supabase";
import { LogOut, Trash2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import "./Settings.css";

const SettingsPage = () => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updatePassword = useUpdatePassword();
  const deleteAccount = useDeleteAccount();

  const hasPasswordAuth = user?.app_metadata?.providers?.includes("email");

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    updatePassword.mutate(newPassword, {
      onSuccess: () => setNewPassword(""),
    });
  };

  const handleDelete = () => {
    if (confirmText !== "DELETE") return;
    deleteAccount.mutate();
  };

  return (
    <div className="uc-settings-page">
      <h1 className="uc-settings-title">Settings</h1>

      <section className="uc-settings-card">
        <h2 className="uc-settings-section-title">Account</h2>
        <div className="uc-settings-row">
          <span className="uc-settings-label">Email</span>
          <span className="uc-settings-value">{user?.email}</span>
        </div>
        <div className="uc-settings-row">
          <span className="uc-settings-label">Joined</span>
          <span className="uc-settings-value">{joinedDate}</span>
        </div>
      </section>

      {hasPasswordAuth ? (
        <section className="uc-settings-card">
          <h2 className="uc-settings-section-title">
            <KeyRound size={18} />
            Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="uc-settings-form">
            <input
              type="password"
              placeholder="New password (min 8 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="uc-settings-input"
            />
            <button
              type="submit"
              className="uc-settings-btn uc-settings-btn-primary"
              disabled={updatePassword.isPending}
            >
              {updatePassword.isPending ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>
      ) : (
        <section className="uc-settings-card">
          <h2 className="uc-settings-section-title">
            <KeyRound size={18} />
            Sign-in Method
          </h2>
          <p className="uc-settings-oauth-note">
            You're signed in with Google. Password changes aren't available for
            Google accounts.
          </p>
        </section>
      )}

      <section className="uc-settings-card">
        <button
          className="uc-settings-btn uc-settings-btn-outline"
          onClick={handleSignOut}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </section>

      <section className="uc-settings-card uc-settings-danger">
        <h2 className="uc-settings-section-title uc-settings-danger-title">
          <Trash2 size={18} />
          Danger Zone
        </h2>
        {!showDeleteConfirm ? (
          <button
            className="uc-settings-btn uc-settings-btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>
        ) : (
          <div className="uc-settings-delete-confirm">
            <p>
              This permanently deletes your account and all your data. Type{" "}
              <strong>DELETE</strong> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="uc-settings-input"
            />
            <div className="uc-settings-delete-actions">
              <button
                className="uc-settings-btn uc-settings-btn-outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmText("");
                }}
              >
                Cancel
              </button>
              <button
                className="uc-settings-btn uc-settings-btn-danger"
                disabled={confirmText !== "DELETE" || deleteAccount.isPending}
                onClick={handleDelete}
              >
                {deleteAccount.isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SettingsPage;
