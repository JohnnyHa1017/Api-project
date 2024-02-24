import { csrfFetch } from "./csrf";

// Action Types
const FETCH_SPOTS_SUCCESS = "FETCH_SPOTS_SUCCESS";
const RETRIEVE_SPOT = "RETRIEVE_SPOT";
const SPOT_CREATED = "SPOT_CREATED";
const UPDATE_SPOT = "UPDATE_SPOT";
const DELETE_SPOTS = "DELETE_SPOTS";

// Action Creators
export const fetchSpotsSuccess = (spots) => ({ type: FETCH_SPOTS_SUCCESS, payload: spots });
export const getSpot = (spot) => ({ type: RETRIEVE_SPOT, payload: spot });
export const spotCreated = (spot) => ({ type: SPOT_CREATED, payload: spot });
export const updateSpot = (spot) => ({ type: UPDATE_SPOT, payload: spot });
export const deleteSpot = (spotId) => ({ type: DELETE_SPOTS, spotId: spotId });

// Thunks
export const fetchSpots = () => {
  return async (dispatch) => {
    try {
		const response = await csrfFetch("api/spots", {
			method: "GET",
		});
    const data = await response.json();
    if (data && data.Spots) {
      dispatch(fetchSpotsSuccess(data.Spots));
    }
    } catch (error) {
      console.error("Failed to fetch spots:", error);
      throw new Error(error);
    }
  };
};

export const fetchSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "GET",
    });
    const data = await response.json();
    if (data) {
      dispatch(getSpot(data));
    }
  } catch (error) {
    console.error("Failed to fetch spot:", error);
    throw new Error(error);
  }
};

export const fetchCreateSpot = (spot, images) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify(spot),
    });

    if (!response.ok) {
      console.error("Failed to create spot. Server returned:", response.status, response.statusText);
      throw new Error("Failed to create spot");
    }

    const data = await response.json();
      dispatch(getSpot(data.id));

    if (images && images.length > 0) {
      for (const imageUrl of images) {
        dispatch(uploadSpotImage(data.id, imageUrl));
      }
    }

    return data;
  } catch (error) {
    console.error("Failed to create spot", error);
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
    if (spot.id) {
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update spot:", errorData.message);
      throw new Error(errorData.message);
    }

    const data = await response.json();
    dispatch(updateSpot({ ...spot, ...data }));

    if (previewImage) {
      await deleteSpotImages(spotPrior.SpotImages);
      await uploadSpotImage(data.id, previewImage, true);
    }

    const images = [image2, image3, image4, image5].filter((image) => image);
    await Promise.all(
      images.map((image) => uploadSpotImage(data.id, image, false))
    );

    return data;
  } else {
    return null;
  }
  } catch (error) {
    console.error("Failed to update spot", error);
    throw error;
  }
};

export const fetchDeleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });

  const data = await response.json();
    if (data) {
      console.log('SPOTS.JS', 'DATA', data);
      console.log('SPOTS.JS', 'DATA.spotId', data.spotId);
      dispatch(deleteSpot(data.spotId));
    }

  } catch (error) {
    console.error("Failed to delete spot", error);
    throw error;
  }
};

const initialState = { spots: [] };

  function spotReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_SPOTS_SUCCESS:
        return { ...state, spots: action.payload };
      case RETRIEVE_SPOT:
        return { ...state, spot: action.payload };
      case UPDATE_SPOT:
        return { ...state, spots: action.payload };
      case DELETE_SPOTS:
        return {
          ...state,
          spots: state.spots.filter((spot) => spot.id !== action.spotId)
        };
      default:
        return state;
    }
  }

  export default spotReducer;
