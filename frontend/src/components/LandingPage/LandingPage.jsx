import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpotTile from './SpotTile';
import { fetchSpots } from '../../store/spots'
import "./LandingPage.css";

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
