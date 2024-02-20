// Action Types
export const SET_SPOT = "spots/setSpot";
export const GET_USER_SPOTS = "spots/userSpots";
export const UPDATE_SPOT = "spots/updateSpot";
export const DELETE_SPOTS = "spots/deleteSpot";
export const FETCH_SPOTS_SUCCESS = "FETCH_SPOTS_SUCCESS";
export const FETCH_SPOTS_FAILURE = "FETCH_SPOTS_FAILURE";


// Action Creators
export const getSpot = (spot) => ({ type: SET_SPOT, payload: spot });
export const getUserSpots = (spots) => ({ type: GET_USER_SPOTS, payload: spots });
export const updateSpot = (spot) => ({ type: UPDATE_SPOT, payload: spot });
export const deleteSpot = (spotId) => ({ type: DELETE_SPOTS, spotId });
