import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpotTile from './SpotTile';
import "./LandingPage.css";

// Actions
const fetchSpotsSuccess = (spots) => ({
  type: 'FETCH_SPOTS_SUCCESS',
  payload: spots,
});

const fetchSpotsFailure = (error) => ({
  type: 'FETCH_SPOTS_FAILURE',
  payload: error,
});

// Thunk
const fetchSpots = () => {
  return async (dispatch) => {
    try {
      const response = await fetch("/api/spots");
      const data = await response.json();
      if (data && data.Spots) {
        dispatch(fetchSpotsSuccess(data.Spots));
      }
    } catch (error) {
      console.error("Failed to fetch spots:", error);
      dispatch(fetchSpotsFailure(error));
    }
  };
};

const LandingPage = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div className="landing-page">
      <h1 className="spots-title">All Spots</h1>
      <div className="spots-list">
        {spots.map((spot) => (
          <SpotTile key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
