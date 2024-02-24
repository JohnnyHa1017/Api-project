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

  const user = useSelector(state => {
    return state.session.user;
  });
  const userId = user.id;

  const spots = useSelector(state => {
    return state.spots.spots;
  });

  const cachedSpots = useMemo(() => JSON.parse(localStorage.getItem("cachedSpots")) || [], []);

  useEffect(() => {
    if (cachedSpots.length === 0) {
      dispatch(fetchSpots());
    }
  }, [dispatch, cachedSpots]);

  useEffect(() => {
    localStorage.setItem("cachedSpots", JSON.stringify(spots));
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
