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
  const spots = useSelector((state) => {
    console.log(state, 'state')
    return state.spots
});

    // const spots = [{
    //   ownerId: 1,
    //   address: '923 S. Island Festival',
    //   city:'Nia Village',
    //   state:'Punika',
    //   country:'Arkesia',
    //   lat:-34.343432,
    //   lng:-120.343432,
    //   name: 'Island Resort Getaway',
    //   description:'Come dance with the locals and forget all your worries!',
    //   price:899.00
    // },
    // {
    //   ownerId:2,
    //   address: '1226 E. Luterra Cs.',
    //   city:'Luterra',
    //   state:'Rethmartis',
    //   country:'Arkesia',
    //   lat:42.34325346,
    //   lng:150.33342423,
    //   name: 'Castle of your Dreams',
    //   description:'Beautiful castle built in the countryside with plenty of local attractions!',
    //   price:729.00
    // }]
    // console.log('line 37', spots)

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
