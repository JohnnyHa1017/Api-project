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
      // Figure out why this isnt calling properly
      const response = await fetch("/api/spots");
        console.log(response, 'line 23')
      const data = await response.json();
        console.log(data, 'line 25')
      if (data && data.Spots) {
        console.log(data.Spots, 'data.spots')
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
    console.log('line 39', spots)

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
