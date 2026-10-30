import { useSelector } from "react-redux";
import { isProfileComplete } from "../utils/profileHelpers";
import useRole from "./useRole";

// False for new users until they fill the required profile and school details.
// Developer-only accounts don't belong to a school, so they skip this step
// (a counselor who is also a developer still fills it in).
function useProfileComplete() {
  const { user, school } = useSelector((state) => state.auth);
  const { isCounselor } = useRole();
  if (!isCounselor) return true;
  return Boolean(user) && isProfileComplete(user, school);
}

export default useProfileComplete;
