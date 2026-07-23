import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import "./OnboardingTour.css";

// Drop your saved screenshots into src/assets/onboarding/ and point these at them.
import dashboardImg from "../assets/onboarding/dashboard.jpg";
import coursesImg from "../assets/onboarding/courses.jpg";
import announcementsImg from "../assets/onboarding/announcements.jpg";
import postsImg from "../assets/onboarding/posts.jpg";
import membersImg from "../assets/onboarding/members.jpg";
import notificationsImg from "../assets/onboarding/notifications.jpg";
import classmatesImg from "../assets/onboarding/classmates.jpg";
import profileImg from "../assets/onboarding/profile.jpg";
import settingsImg from "../assets/onboarding/settings.jpg";

const SLIDES = [
  {
    image: dashboardImg,
    title: "Your Dashboard",
    description:
      "This is home base. Every group you're part of shows up here — pick one to jump into its workspace, or start a new group of your own.",
  },
  {
    image: coursesImg,
    title: "Courses",
    description:
      "Inside a group, Courses is where lectures and class material live. Group reps add courses, and everyone in the group can browse them.",
  },
  {
    image: announcementsImg,
    title: "Announcements",
    description:
      "Official updates from the group rep land here — think of it as the group's notice board. Pinned, visible, and easy to find later.",
  },
  {
    image: postsImg,
    title: "Posts",
    description:
      "The group's open feed. Share updates, ask questions, or post something worth discussing — anyone in the group can join in.",
  },
  {
    image: membersImg,
    title: "Members & Activity",
    description:
      "See who's in the group, who the reps and moderators are, and a live feed of what's been happening — joins, posts, announcements, and more.",
  },
  {
    image: notificationsImg,
    title: "Notifications",
    description:
      "Everything that needs your attention in one place — new posts, friend requests, comments, and updates across every group you're in.",
  },
  {
    image: classmatesImg,
    title: "Classmates",
    description:
      "Build your network. Send and receive friend requests, and keep up with classmates across your groups and courses.",
  },
  {
    image: profileImg,
    title: "Your Profile",
    description:
      "Make it yours — add a photo, banner, and your academic info so classmates know who they're talking to.",
  },
  {
    image: settingsImg,
    title: "Settings",
    description:
      "Manage your notification preferences, account details, and platform options — all in one place, whenever you need them.",
  },
];

export default function OnboardingTour({ onFinish }) {
  const [step, setStep] = useState(0);
  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step];

  function handleNext() {
    if (isLast) {
      onFinish();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="onb-overlay">
      <div className="onb-modal">
        <button className="onb-skip" onClick={onFinish} aria-label="Skip tour">
          <X size={18} />
          <span>Skip</span>
        </button>

        <div className="onb-image-wrap">
          <img src={slide.image} alt={slide.title} className="onb-image" />
        </div>

        <div className="onb-body">
          <div className="onb-dots">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`onb-dot ${i === step ? "onb-dot-active" : ""}`}
                onClick={() => setStep(i)}
              />
            ))}
          </div>

          <h2 className="onb-title">{slide.title}</h2>
          <p className="onb-desc">{slide.description}</p>

          <div className="onb-footer">
            <button
              className="onb-back"
              onClick={handleBack}
              disabled={step === 0}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <button className="onb-next" onClick={handleNext}>
              {isLast ? (
                <>
                  Get Started <Sparkles size={18} />
                </>
              ) : (
                <>
                  Next <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
