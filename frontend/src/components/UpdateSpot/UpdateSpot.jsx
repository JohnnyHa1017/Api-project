import CreateSpotForm from "../CreateSpot/CreateSpotForm";
import { fetchSpot } from "../../store/spots";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const UpdateSpot = () => {
	const dispatch = useDispatch();
	const { spotId } = useParams();

	const spot = useSelector((state) => state.spots.spot);

	useEffect(() => {
		dispatch(fetchSpot(spotId));
	}, [dispatch, spotId]);

	if (!spot || spot.id.toString() !== spotId) {
		return <h3>Loading</h3>;
	}

	return (
		<>
			<h1> Update Spot </h1>
			<CreateSpotForm title="Update Form" spot={spot} />
		</>
	);
};

export default UpdateSpot;
