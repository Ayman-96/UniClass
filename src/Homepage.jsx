import { NavLink } from "react-router-dom";
import "./Homepage.css";
import {
  GraduationCap,
  BookOpen,
  Users,
  Star,
  FileText,
  MessageCircle,
  Lightbulb,
} from "lucide-react";
const previewCards = [
  {
    id: 1,
    type: "lecture",
    label: "Data Structures · Fall 2025",
    title: "Lec 3 — Trees and BSTs",
    subtitle: "12 discussions · 3 questions",
    badge: { text: "Live", color: "#4f46e5" },
    icon: FileText,
    iconColor: "#4f46e5",
    bgColor: "rgba(79, 70, 229, 0.1)",
  },
  {
    id: 2,
    type: "discussion",
    label: "Discussion · 09:48",
    title: 'Is "hierarchical" just a fancy word for parent-child?',
    subtitle: "Sara R. · 4 likes",
    badge: { text: "+4", color: "#0d9488" },
    icon: MessageCircle,
    iconColor: "#0d9488",
    bgColor: "rgba(13, 148, 136, 0.1)",
  },
  {
    id: 3,
    type: "note",
    label: "Note pinned by rep · 09:15",
    title: "Focus on section 3.2 — BST property is key for midterm",
    subtitle: "Ali Karim · Class representative",
    badge: null,
    icon: Lightbulb,
    iconColor: "#d97706",
    bgColor: "rgba(217, 119, 6, 0.1)",
  },
];
const previewFetures = [
  {
    id: 1,
    title: "Lecture viewer",
    description:
      "Read PDFs inline with numbered anchors tied directly to discussion threads — so every comment has context.",
    icon: BookOpen, // Passing the component reference directly
    theme: "purple",
  },
  {
    id: 2,
    title: "Class discussion",
    description:
      "Ask questions, leave notes, and see what your classmates think — all synced in real time during and after the lecture.",
    icon: Users,
    theme: "green",
  },
  {
    id: 3,
    title: "Rep highlights",
    description:
      "Class representatives can pin key reminders, exam tips, and corrections so nothing important gets buried.",
    icon: Star,
    theme: "yellow",
  },
];
function Homepage() {
  return (
    <div className="home">
      <HomeNav />
      <Mainpage previewCards={previewCards} previewFetures={previewFetures} />
      <HomeFooter />
    </div>
  );
}
export default Homepage;

function HomeNav() {
  return (
    <div className="home-nav">
      <nav>
        <div className="logo">
          <NavLink to="/">
            <GraduationCap />
          </NavLink>
          <h2>UniClass</h2>
        </div>

        <div className="sign">
          <NavLink to="/signIn">Sign In</NavLink>
          <NavLink to="/signUp">Get Started</NavLink>
        </div>
      </nav>
    </div>
  );
}

function Mainpage({ previewCards, previewFetures }) {
  return (
    <div className="main">
      <div className="upper-container">
        <div className="upper-left">
          <h1>• Student learning platform</h1>
          <h2 className="hero-heading">
            Where lectures <br />
            become <em>conversations</em>
          </h2>

          <p>
            UniClass brings your course materials, classmates, and discussions
            into one shared space — so every lecture is richer than the one
            before.
          </p>
          <div className="upp-lf-btns">
            <NavLink to="/sign-up">Create Account</NavLink>
            <NavLink to="">Join with Code</NavLink>
          </div>
        </div>
        <div className="upper-right">
          {previewCards.map((card) => {
            // 1. Assign the icon component to a Capitalized variable name
            const CardIcon = card.icon;
            return (
              <div key={card.id} className="preview-card">
                <div
                  className="smpl-icon"
                  style={{
                    color: card.iconColor,
                    backgroundColor: card.bgColor,
                  }}
                >
                  <CardIcon />
                </div>
                <div className="smpl-info">
                  <div>
                    <p className="smpl-label">{card.label}</p>
                    <p
                      className="smpl-badge"
                      style={{
                        color: card.badge?.color,
                        backgroundColor: card.badge ? card.bgColor : "",
                      }}
                    >
                      {card.badge?.text}
                    </p>
                  </div>
                  <p className="smple-title">{card.title}</p>
                  <p className="smple-subtitle">{card.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lower-container">
        <div className="lower-up">
          {previewFetures.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={feature.id}>
                <div className="feature-icon" style={{ color: feature.theme }}>
                  <FeatureIcon />
                </div>
                <div className="feature-title">{feature.title}</div>
                <div className="feature-description">{feature.description}</div>
              </div>
            );
          })}
        </div>

        <div className="lower-down">
          <JoinClass />
        </div>
      </div>
    </div>
  );
}
function JoinClass() {
  return (
    <div className="join-class">
      <div className="join-left">
        <p>
          "I finally understand why my notes are actually useful — they're
          anchored to the lecture slide and linked to everyone else's
          questions."
        </p>
        <p>Yara A. · Computer Science, Year 2</p>
      </div>
      <div className="join-right">
        <h2>Join your class today</h2>
        <p>
          Your professor will share a class code — enter it below to jump
          straight in.
        </p>
        <form className="join-form">
          <input placeholder="Enter class code" />
          <button type="submit" className="join-btn">
            Join &rarr;
          </button>{" "}
        </form>
      </div>
    </div>
  );
}

function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="footer-left">
        <span className="footer-logo">UniClass</span>
      </div>

      <div className="footer-center">
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#support">Support</a>
        <a href="#institutions">For institutions</a>
      </div>

      <div className="footer-right">
        <p>&copy; 2025 UniClass</p>
      </div>
    </footer>
  );
}
