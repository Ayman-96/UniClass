import { InfoIcon } from "lucide-react";

function RequiredWarning() {
  return (
    <div className="group-warning">
      <span>
        <InfoIcon />
      </span>{" "}
      Please Fill All the Required Fills
    </div>
  );
}
export default RequiredWarning;
