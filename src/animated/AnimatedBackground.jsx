import "./AnimatedBackground.css";
import bgImage from "../assets/bg-hero.png";

export default function AnimatedBackground({ children }) {
  return (
    <div className="uniclass-anim-stage">
      <div
        className="uniclass-anim-img"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="uniclass-anim-sweep" />
      <div className="uniclass-anim-lines">
        <span className="uniclass-anim-streak uniclass-anim-s1" />
        <span className="uniclass-anim-streak uniclass-anim-s2" />
        <span className="uniclass-anim-streak uniclass-anim-s3" />
        <span className="uniclass-anim-streak uniclass-anim-s4" />
        <span className="uniclass-anim-streak uniclass-anim-s5" />
        <span className="uniclass-anim-streak uniclass-anim-s6" />
        <span className="uniclass-anim-streak uniclass-anim-s7" />
      </div>
      <div className="uniclass-anim-content">{children}</div>
    </div>
  );
}
