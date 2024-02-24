import { useModal } from "../../context/Modal";
import { fetchDeleteSpot } from "../../store/spots";
import { useDispatch } from "react-redux";
import "./DeleteSpotModal.css"

function DeleteSpotModal({ spotId }) {
	const dispatch = useDispatch();
	const { closeModal } = useModal();

	const handleSubmit = (e) => {
		e.preventDefault();
		return dispatch(fetchDeleteSpot(spotId)).then(closeModal);
	};
  const handleCancel = () => {
    closeModal();
  };

  return (
    <>
      <div className="delete-spot-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to remove this spot from the listing?</p>
        <button className="yes-delete-spot" onClick={handleSubmit}>
          Yes (Delete Spot)
        </button>
        <button onClick={handleCancel}>
          No (Keep Spot)
        </button>
      </div>
    </>
  );
};

export default DeleteSpotModal;

