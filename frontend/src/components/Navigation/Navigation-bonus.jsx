import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import CreateSpot from "../CreateSpot/CreateSpot";
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

	return (
		<header>
			<ul className='header-ul'>
				<li>
					<NavLink to='/'>
          <img src='https://i.postimg.cc/W4JQVvwC/imageedit-2-3707800134.png' border='0' alt='imageedit-2-3707800134' />
					</NavLink>
				</li>
				<li className="name-container">
					<h1 className="app-name">ArkesiaBnB</h1>
				</li>
				{sessionUser && (
				<li className="create-spot">
					<CreateSpot />
				</li>
				)}
				{isLoaded && (
					<li className="profile-button-container">
						<ProfileButton user={sessionUser} />
					</li>
				)}
			</ul>
		</header>
	);
}

export default Navigation;
