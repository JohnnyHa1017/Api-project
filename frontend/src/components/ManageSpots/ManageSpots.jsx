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

  // Get the user from the Redux store
  const user = useSelector((state) => state.session.user);
  const userId = user.id;

  // Fetch Current Users Spots and All Spots
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/spots/current");
        const data = await response.json();

        if (response.ok) {
          dispatch(userSpots(data.Spots));
        }

      } catch (error) {
        console.error("Error fetching spots:", error);
      }
    };
    fetchData();
  }, [dispatch, userId]);

// Get the spots array from the Redux store
const spots = useSelector((state) => state.spots.spots);
let spotArr = Object.values(spots)
spotArr = spotArr.filter(spot => spot.ownerId == userId)

  return (
    <div className="large-boxes">
      <div className="user-spots">
        <h1>Manage Spots</h1>
        {
        spotArr.length >= 1 ? (
          <div className="user-spots-list">
            {
            spotArr.map((spot) => (
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


