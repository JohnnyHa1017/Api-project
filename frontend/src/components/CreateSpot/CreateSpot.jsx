import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const CreateSpot = () => {
  const user = useSelector((state) => state.session.user);
  return user ? (
    <NavLink to="/spots/new">Create New Spot</NavLink>
  ) : (
    <p>Please log in or sign up to create a spot.</p>
  );
}

export default CreateSpot;
