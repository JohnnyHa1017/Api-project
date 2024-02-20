import { csrfFetch } from "./csrf";

export const fetchSpot = async (spotId) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, { method: "GET" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch spot:", error);
    throw error;
  }
};

export const fetchUserSpots = async () => {
  try {
    const response = await csrfFetch(`/api/spots/current`, {});
    const data = await response.json();
    return data.Spots;
  } catch (error) {
    console.error("Failed to fetch spots");
    throw error;
  }
};

export const fetchUpdateSpot = async (spot) => {
  try {
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
      method: "PUT",
      body: JSON.stringify(spot),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update spot:", error);
    throw error;
  }
};

export const fetchDeleteSpot = async (spotId) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to delete spot:", error);
    throw error;
  }
};

export const fetchGetSpots = async () => {
  try {
    const response = await csrfFetch("/api/spots", {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get spots:", error);
    throw error;
  }
};

export const fetchCreateSpot = async (spot) => {
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify(spot),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create spot:", error);
    throw error;
  }
};

// spotReducer
import {
  SET_SPOT,
  GET_USER_SPOTS,
  UPDATE_SPOT,
  DELETE_SPOTS,
} from "./spotActions";

const initialState = { spot: null, spots: [] };

function spotReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPOT:
      return { ...state, spot: action.payload };
    case GET_USER_SPOTS:
      return { ...state, spots: action.payload };
    case UPDATE_SPOT:
      return { ...state, spot: action.payload };
    case DELETE_SPOTS:
      return {
        ...state,
        spots: state.spots.filter((spot) => (spot.id === action.spotId ? false : true)),
      };
    default:
      return state;
  }
}

export default spotReducer;
