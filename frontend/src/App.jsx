import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import LandingPage from './components/LandingPage/LandingPage';
import SpotInfo from './components/SpotInfo/SpotInfo';
import CreateSpotForm from "./components/CreateSpot/CreateSpotForm";
import UpdateSpot from "./components/UpdateSpot/UpdateSpot";
// import ManageSpots from "./components/ManageSpots/ManageSpots";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				index: true,
				path: "/",
				element: <LandingPage />,
			},
			{
				index: true,
				path: "/spots/:spotId",
				element: <SpotInfo />,
			},
			{
				index: true,
				path: "/spots/new",
				element: <CreateSpotForm title="Create Spot" />,
			},
			{ index: true,
        path: "/spots/:spotId/edit",
        element: <UpdateSpot />
      },
			// { index: true, path: "/spots/current", element: <ManageSpots /> },
			{
				path: "*",
				element: <h1>Page Not Found</h1>,
			},
		],
	},
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
