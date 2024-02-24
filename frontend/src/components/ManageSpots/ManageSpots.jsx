import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import SpotTile from "../LandingPage/SpotTile";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../ManageSpots/DeleteSpotModal";
import { fetchSpots } from "../../store/spots";
import "./ManageSpots.css";

const ManageSpots = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user);
  const userId = user?.id || null;

  const spots = useSelector(state => state.spots.spots);

  const cachedSpots = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("cachedSpots")) || [];
    } catch (error) {
      console.error("Error parsing cachedSpots from localStorage:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    try {
      if (cachedSpots.length === 0) {
        dispatch(fetchSpots());
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [dispatch, cachedSpots]);

  useEffect(() => {
    try {
      localStorage.setItem("cachedSpots", JSON.stringify([...spots]));
    } catch (error) {
      console.error("Error storing spots in localStorage:", error);
    }
  }, [spots]);

  let spotArr = Object.values(spots);
  spotArr = spotArr.filter(spot => spot.ownerId == userId);

  return (
    <div className="large-boxes">
      <div className="user-spots">
        <h1>Manage Spots</h1>
        {spotArr && spotArr.length >= 1 ? (
          <div className="user-spots-list">
            {spotArr.map(spot => (
              <div key={spot.id}>
                <SpotTile spot={spot} />
                <div className="button-list">
                  <button
                    className="update"
                    onClick={() => {
                      navigate(`/spots/${spot.id}/edit`);
                    }}
                  >
                    Update
                  </button>
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteSpotModal spotId={spot.id} />}
                  ></OpenModalButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NavLink className="create-spot-body" to="/spots/new">
            Create a New Spot
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default ManageSpots;
