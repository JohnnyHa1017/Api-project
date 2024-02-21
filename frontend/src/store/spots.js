import { csrfFetch } from "./csrf";

const ActionTypes = {
  DELETE_SPOT: "spots/deleteSpot",
  UPDATE_SPOT: "spots/updateSpot",
  GET_USER_SPOTS: "spots/userSpots",
  SET_SPOT: "spots/setSpot",
  SET_SPOTS: "spots/getSpot",
  FETCH_SPOTS_SUCCESS: "spots/fetchSpotsSuccess",
};

// Action Creators
const deleteSpot = (spotId) => ({
  type: ActionTypes.DELETE_SPOT,
  spotId: spotId,
});

const updateOneSpot = (spot) => ({
  type: ActionTypes.UPDATE_SPOT,
  payload: spot,
});

const userSpot = (spots) => ({
  type: ActionTypes.GET_USER_SPOTS,
  payload: spots,
});

const getSpot = (spot) => ({
  type: ActionTypes.SET_SPOT,
  payload: spot,
});

const getSpots = (spots) => ({
  type: ActionTypes.SET_SPOTS,
  payload: spots,
});

// Thunks
export const fetchOneSpot = (spotId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/spots/${spotId}`, {
      method: "GET",
    });
    const data = await response.json();
    if (data) {
      dispatch(getSpot(data));
    }
  } catch (error) {
    console.error("Failed to fetch spot:", error);
  }
};

export const fetchGetSpots = ({ spots }) => async (dispatch) => {
  const response = await csrfFetch("api/spots", {
    method: "GET",
    body: JSON.stringify({ spots }),
  });
  const data = await response.json();
  dispatch(getSpots(data));
  return data;
};

export const createSpot = (spot) => async (dispatch) => {
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

  const response = await csrfFetch("/api/spots", {
    method: "POST",
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
    }),
  });
  const data = await response.json();
  dispatch(getSpot(data.spot));

  await csrfFetch(`/api/spots/${data.id}/images`, {
    method: "POST",
    body: JSON.stringify({
      url: previewImage,
      preview: true,
    }),
  });

  const images = [image2, image3, image4, image5];
  images.forEach(async (image) => {
    if (image) {
      await csrfFetch(`/api/spots/${data.id}/images`, {
        method: "POST",
        body: JSON.stringify({
          url: image,
          preview: false,
        }),
      });
    }
  });

  return data;
};

export const getUserSpots = () => async (dispatch) => {
  try {
    const response = await fetch(`/api/spots/current`, {});
    const data = await response.json();
    if (data) {
      dispatch(userSpot(data.Spots));
    }
  } catch (error) {
    console.error("Failed to fetch spots");
  }
};


// Helper Function
const handleImageUpload = async (spotId, url, preview) => {
  await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify({ url, preview }),
  });
};

// Reducer
const initialState = { spot: null, spots: [] };

function spotReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_SPOTS_SUCCESS:
      return { ...state, spots: action.payload };
    case ActionTypes.SET_SPOT:
      return { ...state, spot: action.payload };
    case ActionTypes.GET_USER_SPOTS:
      return { ...state, spots: action.payload };
    case ActionTypes.UPDATE_SPOT:
      return { ...state, spot: action.payload };
    case ActionTypes.DELETE_SPOT:
      return {
        ...state,
        spots: state.spots.filter((spot) => spot.id !== action.spotId),
      };
    default:
      return state;
  }
}

export default spotReducer;
