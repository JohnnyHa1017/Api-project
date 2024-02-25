import { csrfFetch } from "./csrf";

// Action Types
const FETCH_SPOTS_SUCCESS = "FETCH_SPOTS_SUCCESS";
const CREATE_UPDATE_SPOT = "CREATE_UPDATE_SPOT";
const RETRIEVE_SPOT = "RETRIEVE_SPOT";
const GET_USER_SPOTS = "GET_USER_SPOTS";
const UPDATE_SPOT = "UPDATE_SPOT";
const DELETE_SPOTS = "DELETE_SPOTS";

// Action Creators
export const fetchSpotsSuccess = (spots) => ({ type: FETCH_SPOTS_SUCCESS, payload: spots });
export const createUpdateSpot = (spot) => ({ type: CREATE_UPDATE_SPOT, payload: spot });
export const getSpot = (spot) => ({ type: RETRIEVE_SPOT, payload: spot });
export const userSpots = (spots) => ({ type: GET_USER_SPOTS, payload: spots })
export const updateSpot = (spot) => ({ type: UPDATE_SPOT, payload: spot });
export const deleteSpot = (spotId) => ({ type: DELETE_SPOTS, spotId: spotId });

// Fetch All Spots Thunk
export const fetchSpots = () => async (dispatch) => {
    try {
		const response = await fetch("api/spots", {
			method: "GET",
		});

    if (!response.ok) {
      console.error("Failed to fetch spots. Server returned:", response.status, response.statusText);
    }

    const data = await response.json();
      dispatch(fetchSpotsSuccess(data));

    return data;
    } catch (error) {
      console.error("Failed to fetch spots:", error);
    }
  };

// Fetch Specific Spot Thunk
export const fetchSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Failed to fetch spot. Server returned:", response.status, response.statusText);
    }

    const data = await response.json();
      dispatch(getSpot(data));

  } catch (error) {
    console.error("Failed to fetch spot:", error);
  }
};

// Fetch Current Users Spots Thunk
export const getUserSpots = () => async (dispatch) => {
	try {
		const response = await fetch(`/api/spots/current`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Failed to fetch session. Server returned:", response.status, response.statusText);
    }

		const data = await response.json();
			dispatch(userSpots(data));

    return data;
	} catch (error) {
		console.error("Failed to fetch spots");
	}
};

// Fetch Create Spot Thunk
export const fetchCreateSpot = (spot) => async (dispatch) => {
    const {
    previewImage,
    image2,
    image3,
    image4,
    image5,
  } = spot;

  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify(spot),
    });

    if (!response.ok) {
      console.error("Failed to create spot. Server returned:", response.status, response.statusText);
    }

    const data = await response.json();
    if (previewImage) {
      await uploadSpotImage(data.id, previewImage, true);
    }

    const images = [image2, image3, image4, image5].filter((image) => image);
    await Promise.all(
      images.map((image) => uploadSpotImage(data.id, image, false))
      );

    dispatch(createUpdateSpot(spot));
    return data;
  } catch (error) {
    console.error("Failed to create spot:", error);
  }
};

// Middleware Helper Functions to Handle Images
const deleteSpotImages = async (images) => {
  const deleteRequests = await images.map((image) =>
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

// Fetch Update Spot Thunk
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
      const response = await csrfFetch(`/api/spots/${spot.id}`, {
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
    }
  } catch (error) {
    console.error("Failed to update spot", error);
  }
};

// Fetch Delete Spot Thunk
export const fetchDeleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Failed to delete spot. Server returned:", response.status, response.statusText);
    }

		const data = await response.json();
		if (data) {
			dispatch(deleteSpot(spotId));
		}

  } catch (error) {
    console.error("Failed to delete spot", error);
  }
};

const initialState = { spot: null, spots: [] };

  function spotReducer(state = initialState, action) {

    switch (action.type) {
      case FETCH_SPOTS_SUCCESS:
        return { ...state, spots: action.payload };
      case CREATE_UPDATE_SPOT:
        return { ...state, spot: action.payload };
      case RETRIEVE_SPOT:
        return { ...state, spot: action.payload };
      case GET_USER_SPOTS:
        return { ...state, spots: action.payload };
      case UPDATE_SPOT:
        return { ...state, spot: action.payload };
      case DELETE_SPOTS:
        return {
          ...state,
          spots: state.spots.filter((spot) => spot.id !== action.spotId)
        }
      default:
        return state;
    }
  }

  export default spotReducer;
