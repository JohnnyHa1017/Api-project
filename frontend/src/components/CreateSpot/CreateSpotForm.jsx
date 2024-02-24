import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as spotActions from "../../store/spots";
import "./CreateSpot.css";

function CreateSpotForm({ title, spot = null }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [country, setCountry] = useState(spot?.country ?? "");
  const [address, setAddress] = useState(spot?.address ?? "");
  const [city, setCity] = useState(spot?.city ?? "");
  const [state, setState] = useState(spot?.state ?? "");
  const [lat, setLat] = useState(spot?.lat ?? "");
  const [lng, setLng] = useState(spot?.lng ?? "");
  const [description, setDescription] = useState(spot?.description ?? "");
  const [name, setName] = useState(spot?.name ?? "");
  const [price, setPrice] = useState(spot?.price ?? "");
  const oldPreview = spot?.SpotImages.find((image) => image.preview === true);
  const [previewImage, setPreviewImage] = useState(spot?.previewImage ?? oldPreview?.url ?? "");

	const falseImage = spot === null ? [] : spot.SpotImages.filter((image) => image.preview === false);

	const [image2, setImage2] = useState(falseImage.length > 0 ? falseImage[0].url : "");
	const [image3, setImage3] = useState(falseImage.length > 1 ? falseImage[1].url : "");
	const [image4, setImage4] = useState(falseImage.length > 2 ? falseImage[2].url : "");
	const [image5, setImage5] = useState(falseImage.length > 3 ? falseImage[3].url : "");

  const [errors, setErrors] = useState({});

  const validateLng = function (lng) {
    if (lng < -180 || lng > 180) {
      return "lng needs to be between -180 and 180";
    } else {
      return undefined;
    }
  };

  const validateLat = function (lat) {
    if (lat < -90 || lat > 90) {
      return "lat needs to be between -90 and 90";
    } else {
      return undefined;
    }
  };

	const validateImgURL = function (imageUrl) {
		if (
			imageUrl.slice(-3) !== "png" &&
			imageUrl.slice(-4) !== "jpeg" &&
			imageUrl.slice(-3) !== "jpg"
		) {
			return "Image URL must end in .png, .jpeg, .jpg";
		} else {
			return undefined;
		}
	};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      country: country === "" ? "Country is required" : undefined,
      address: address === "" ? "Address is required" : undefined,
      city: city === "" ? "City is required" : undefined,
      state: state === "" ? "State is required" : undefined,
      lat: lat === "" ? "Latitude is required" : validateLat(lat),
      lng: lng === "" ? "Longitude is required" : validateLng(lng),
      name: name === "" ? "Name is required" : undefined,
      price: price <= 0 || price === "" ? "Price is required" : undefined,
      previewImage:
        spot === null
          ? previewImage === ""
            ? "Preview image is required"
            : validateImgURL(previewImage)
          : undefined,
      description:
        description.length < 30
          ? "Description needs a minimum of 30 characters"
          : undefined,
      image2: image2 === "" ? undefined : validateImgURL(image2),
      image3: image3 === "" ? undefined : validateImgURL(image3),
      image4: image4 === "" ? undefined : validateImgURL(image4),
      image5: image5 === "" ? undefined : validateImgURL(image5),
    };

    setErrors(newErrors);

					if (Object.values(newErrors).every((value) => value === undefined)) {
						try {
							if (spot === null) {
								const createdSpot = dispatch(
									spotActions.spotCreated({
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
									}, spot));
									navigate(`/spots/${createdSpot.id}`);
							} else {
								const updatedSpot = dispatch(
									spotActions.updateSpot(
										{
											id: spot.id,
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
									}, spot));
							navigate(`/spots/${updatedSpot.id}`);
						}
					} catch (error) {
						console.error("Error occurred:", error);
					}
				}
			};

  return (
		<form className="create-spot-form" onSubmit={handleSubmit}>
			<h2>{title} </h2>
			<h3> Where&apos;s your place located?</h3>
			<p>
				Guests will only get your exact location once they have booked a reservation
			</p>
			<div className="create-form">
				<label htmlFor="name">Country : </label>
				<input
					type="text"
					value={country}
					name="country"
					placeholder="Country"
					onChange={(e) => setCountry(e.target.value)}
				></input>
				{errors.country && <p className="error-messages">{errors.country}</p>}
			</div>
			<div className="create-form">
				<label htmlFor="name">Street Address : </label>
				<input
					type="text"
					value={address}
					name="address"
					placeholder="Address"
					onChange={(e) => setAddress(e.target.value)}
				></input>
				{errors.address && <p className="error-messages">{errors.address}</p>}
			</div>
			<div className="create-form">
				<label htmlFor="name">City : </label>
				<input
					type="text"
					value={city}
					name="city"
					placeholder="City"
					onChange={(e) => setCity(e.target.value)}
				></input>
				{errors.city && <p className="error-messages">{errors.city}</p>}
			</div>
			<div className="create-form">
				<label htmlFor="name">State : </label>
				<input
					type="text"
					value={state}
					name="state"
					placeholder="STATE"
					onChange={(e) => setState(e.target.value)}
				></input>
				{errors.state && <p className="error-messages">{errors.state}</p>}
			</div>
			<div className="create-form">
				<label htmlFor="name">Latitude : </label>
				<input
					type="number"
					value={lat}
					name="lat"
					placeholder="Latitude"
					onChange={(e) => setLat(e.target.value)}
				></input>
				{errors.lat && <p className="error-messages">{errors.lat}</p>}
			</div>
			<div className="create-form">
				<label htmlFor="name">Longitude : </label>
				<input
					type="number"
					value={lng}
					name="lng"
					placeholder="Longitude"
					onChange={(e) => setLng(e.target.value)}
				></input>
				{errors.lng && <p className="error-messages">{errors.lng}</p>}
			</div>
			<h3>Describe your place to your guests</h3>
			<p>
			Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.
			</p>
			<div className="description">
				<textarea
					value={description}
					placeholder="Please write at least 30 characters"
					onChange={(e) => setDescription(e.target.value)}
				></textarea>
				{errors.description && (
					<p className="error-messages">{errors.description}</p>
				)}
			</div>
			<h3>Create a title for your spot</h3>
			<p>
				Catch guests&apos; attention with a spot title that highlights what makes your place special
			</p>
			<div className="spot-name">
				<input
					type="text"
					value={name}
					name="spot-name"
					placeholder="Name your spot"
					onChange={(e) => setName(e.target.value)}
				></input>
				{errors.name && <p className="error-messages">{errors.name}</p>}
			</div>
			<h3> Set a base price for your spot</h3>
			<p>
			Competitive pricing can help your listing stand out and rank higher in search results.
			</p>
			<div className="price">
				<input
					type="number"
					value={price}
					name="spot-price"
					placeholder="Price per night(USD)"
					onChange={(e) => setPrice(e.target.value)}
				></input>
				{errors.price && <p className="error-messages">{errors.price}</p>}
			</div>

			<h3>Liven up your spot with photos</h3>
			{spot === null ? (
				<p>Submit a link to at least one photo to publish your spot.</p>
			) : (
				<p> Have some new picture to add?</p>
			)}

			<div className="spot-photos">
				<div className="photos">
					<input
						type="url"
						value={previewImage}
						name="spot-image-1"
						placeholder="Preview Image URL"
						onChange={(e) => setPreviewImage(e.target.value)}
					></input>
					{errors.previewImage && (
						<p className="error-messages">{errors.previewImage}</p>
					)}
				</div>
				<div className="photos">
					<input
						type="url"
						name="spot-image-2"
						placeholder="Image URL"
						value={image2}
						onChange={(e) => setImage2(e.target.value)}
					></input>
					{errors.image2 && <p className="error-messages">{errors.image2}</p>}
				</div>
				<div className="photos">
					<input
						type="url"
						name="spot-image-3"
						placeholder="Image URL"
						value={image3}
						onChange={(e) => setImage3(e.target.value)}
					></input>
					{errors.image3 && <p className="error-messages">{errors.image3}</p>}
				</div>
				<div className="photos">
					<input
						type="url"
						name="spot-image-4"
						placeholder="Image URL"
						value={image4}
						onChange={(e) => setImage4(e.target.value)}
					></input>
					{errors.image4 && <p className="error-messages">{errors.image4}</p>}
				</div>
				<div className="photos">
					<input
						type="url"
						name="spot-image-5"
						placeholder="Image URL"
						value={image5}
						onChange={(e) => setImage5(e.target.value)}
					></input>
					{errors.image5 && <p className="error-messages">{errors.image5}</p>}
				</div>
			</div>

			<button>{spot === null ? "Create Spot" : "Update Your Spot"}</button>

		</form>
	);
}

export default CreateSpotForm;
