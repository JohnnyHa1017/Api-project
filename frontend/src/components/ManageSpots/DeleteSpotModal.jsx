import { useModal } from "../../context/Modal";
import { deleteSpot } from "../../store/spots";
import { useDispatch } from "react-redux";
import "./DeleteSpotModal.css"

const DeleteSpotModal = ({ spotId }) => {
	const dispatch = useDispatch();
	const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(deleteSpot(spotId));
    closeModal();
  };

	return (
		<>
			<div className="delete-spot-modal">
				<h3>Confirm Delete</h3>
				<p> Are you sure you want to delete this spot?</p>
				<button className="yes-delete-spot" onClick={handleSubmit}>
					Yes (Delete Spot)
				</button>
				<button onClick={() => {closeModal()}}>
					No (Keep Spot)
				</button>
			</div>
		</>
	);
}

export default DeleteSpotModal;
