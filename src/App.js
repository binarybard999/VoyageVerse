// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Master from './components/layouts/Master';
import Home from './components/pages/Home';
import Contact from './components/pages/Contact';
import Listing from './components/pages/Listing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PackageView from './components/pages/PackageView';
// import SingleListing from './components/pages/SingleListing';
import Explore from './components/pages/Explore';

import AdminMaster from './components/layouts/AdminMaster';
import AdminDashboard from './components/admin/AdminDashboard';

import AddCity from './components/admin/city/AddCity';
import EditCity from './components/admin/city/EditCity';
import ManageCity from './components/admin/city/ManageCity';

import AddPlaces from './components/admin/places/AddPlaces';
import EditPlace from './components/admin/places/EditPlace';
import ManagePlaces from './components/admin/places/ManagePlaces';

import AddPackages from './components/admin/packages/AddPackages';
import EditPackage from './components/admin/packages/EditPackage';
import ManagePackages from './components/admin/packages/ManagePackages';

import ViewBookings from './components/admin/bookings/ViewBookings';
import ManageReviews from './components/admin/reviews/ManageReviews';

import UserProfile from './components/users/UserProfile';
import Error from './components/pages/Error';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Master />}>
                        <Route path='/' element={<Home />} />
                        <Route path='/contact' element={<Contact />} />
                        <Route path='/listing' element={<Listing />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/view/:id' element={<PackageView />} />
                        <Route path='/explore' element={<Explore />} />
                        <Route path='/profile' element={<UserProfile />} />
                        <Route path='/*' element={<Error />} />
                    </Route>

                    <Route path='/admin' element={<AdminMaster />}>
                        <Route path='/admin' element={<AdminDashboard />} />
                        <Route path='/admin/dashboard' element={<AdminDashboard />} />
                        <Route path='/admin/city/add' element={<AddCity />} />
                        <Route path='/admin/city/edit/:id' element={<EditCity />} />
                        <Route path='/admin/city/manage' element={<ManageCity />} />
                        <Route path='/admin/places/add' element={<AddPlaces />} />
                        <Route path='/admin/places/edit/:id' element={<EditPlace />} />
                        <Route path='/admin/places/manage' element={<ManagePlaces />} />
                        <Route path='/admin/packages/add' element={<AddPackages />} />
                        <Route path='/admin/packages/edit/:id' element={<EditPackage />} />
                        <Route path='/admin/packages/manage' element={<ManagePackages />} />
                        <Route path='/admin/bookings' element={<ViewBookings />} />
                        <Route path='/admin/reviews' element={<ManageReviews />} />
                        <Route path='/admin/*' element={<Error />} />
                    </Route>

                </Routes>
            </BrowserRouter>
            <ToastContainer />
        </>
    );
}

export default App;
