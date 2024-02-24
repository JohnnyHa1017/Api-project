import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { userSpots } from "../../store/spots";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../ManageSpots/DeleteSpotModal";
import SpotTile from "../LandingPage/SpotTile";
import "./ManageSpots.css";

const ManageSpots = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the spots array from the Redux store
  const spots = useSelector((state) => state.spots.spots);

  // Fetch Current Users Spots
  useEffect(() => {
    dispatch(userSpots());
  }, [dispatch]);

  return (
    <div className="large-boxes">
      <div className="user-spots">
        <h1>Manage Spots</h1>
        {spots && spots.length >= 1 ? (
          <div className="user-spots-list">
            {spots.map((spot) => (
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
