import { csrfFetch } from "./csrf";
import { FETCH_SPOTS_SUCCESS, /*FETCH_SPOTS_FAILURE*/ } from '../components/LandingPage/LandingPage'

// Action Types
const SET_SPOT = "spots/setSpot";
const GET_USER_SPOTS = "spots/userSpots";
const SPOT_CREATED = "spots/spotCreated";
const UPDATE_SPOT = "spots/updateSpot";
// const DELETE_SPOTS = "spots/deleteSpot";

// Action Creators
export const getSpot = (spot) => ({ type: SET_SPOT, payload: spot });
export const getUserSpots = (spots) => ({ type: GET_USER_SPOTS, payload: spots });
export const spotCreated = (spot) => ({ type: SPOT_CREATED, payload: spot });
export const updateSpot = (spot) => ({ type: UPDATE_SPOT, payload: spot });
// export const deleteSpot = (spotId) => ({ type: DELETE_SPOTS, spotId });

// Thunks
export const fetchSpot = (spotId) => async (dispatch) => {
  try {
		const response = await fetch(`/api/spots/${spotId}`, {
			method: "GET",
		});
    const data = await response.json();
		if (data) {
			dispatch(getSpot(data));
		}
  } catch (error) {
    console.error("Failed to fetch spot");
    throw error;
  }
};

export const fetchUserSpots = () => async (dispatch) => {
	try {
		const response = await fetch(`/api/spots/current`);
		const data = await response.json();
		if (data) {
			dispatch(getUserSpots(data.Spots));
		}
	} catch (error) {
		console.error("Failed to fetch spots");
	}
};

export const fetchCreateSpot = (spot) => async () => {
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify(spot),
    });
    const createdSpot = await response.json();

    await createdSpot.save();
    return createdSpot;
  } catch (error) {
    console.error("Failed to create spot");
    throw error;
  }
};

const deleteSpotImages = async (images) => {
  const deleteRequests = images.map((image) =>
    csrfFetch(`/api/spot-images/${image.id}`, {
      method: "DELETE",
    })
  );
  await Promise.all(deleteRequests);
};

const uploadSpotImage = async (spotId, url, preview) => {
  await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify({
      url,
      preview,
    }),
  });
};

export const fetchUpdateSpot = (spot, spotPrior) => async (dispatch) => {
  const {
    country,
    address,
    city,
    state,
    lat,
    lng,
    description,
    name,
    price,
    previewImage,
    image2,
    image3,
    image4,
    image5,
  } = spot;

  try {
    const response = await csrfFetch(`/api/spots/${spot.id}/`, {
      method: "PUT",
      body: JSON.stringify({
        country,
        address,
        city,
        state,
        lat,
        lng,
        description,
        name,
        price,
        previewImage,
        image2,
        image3,
        image4,
        image5,
      }),
    });

    const data = await response.json();
    if (data) {
      dispatch(updateSpot(data));
    }

    if (previewImage) {
      await deleteSpotImages(spotPrior.SpotImages);
      await uploadSpotImage(data.id, previewImage, true);
    }

    const images = [image2, image3, image4, image5].filter((image) => image);
    await Promise.all(images.map((image) => uploadSpotImage(data.id, image, false)));

    return data;
  } catch (error) {
    console.error("Failed to update spot", error);
    throw error;
  }
};

// export const fetchDeleteSpot = (spotId) = async (dispatch) => {
//   try {
//     const response = await csrfFetch(`/api/spots/${spotId}`, {
//       method: "DELETE",
//     });
//     const data = await response.json();
//     if (data) {
//       dispatch(deleteSpot(spotId));
//     }
//   } catch (error) {
//     console.error("Failed to delete spot");
//     throw error;
//   }
// };

const initialState = { spot: null, spots: [] };

function spotReducer(state = initialState, action) {

  switch (action.type) {
    case FETCH_SPOTS_SUCCESS:
      return { ...state, spots: action.payload };
    case SET_SPOT:
      return { ...state, spot: action.payload };
    case GET_USER_SPOTS:
      return { ...state, spots: action.payload };
    case SPOT_CREATED:
      return {
        ...state,
        spots: [...state.spots, action.payload]};
    case UPDATE_SPOT:
      return { ...state, spot: action.payload };
    // case DELETE_SPOTS:
    //   return {
    //     ...state,
    //     spots: state.spots.filter((spot) => (spot.id === action.spotId ? false : true)),
    //   };
    default:
      return state;
  }
}

export default spotReducer;
