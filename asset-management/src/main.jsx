import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from './Provider/AuthProvider.jsx';
import { ToastContainer } from 'react-toastify';
import Root from './Component/Root/Root.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Home from './Pages/Home.jsx';
import SignUp from './SignUp/SignUp.jsx';
import Login from './Pages/Login/Login.jsx';
import SignUpHr from './Pages/SignUpHr/SignUpHr.jsx';
import Payment from './Component/Payment/Payment';
import ErrorPage from './Pages/ErrorPage.jsx';
import HrRoot from './Component/HrRoot/HrRoot.jsx';
import HrHome from './Pages/HrPage/HrHome.jsx';
import AddAsset from './Pages/HrPage/AddAsset.jsx';
import AssetList from './Pages/HrPage/AssetList.jsx';
import AllRequest from './Pages/HrPage/AllRequest.jsx';
import MyEmployee from './Pages/HrPage/MyEmployee.jsx';
import AddEmployee from './Pages/HrPage/AddEmployee.jsx';
import Profile from './Component/Profile/Profile.jsx';
import PaymentPage from './Component/Payment/PaymentPage';
import UpdateAsset from './Pages/HrPage/UpdateAsset.jsx';
import MyTeam from './Pages/EmployeePages/MyTeam.jsx';
import ReqForAsset from './Pages/EmployeePages/ReqForAsset.jsx';
import MyAsset from './Pages/EmployeePages/MyAsset.jsx';
import MsgReply from './Component/HrHomeComponents/MsgReply.jsx';
import AdminRoute from './Component/PrivateRoute/AdminRoute.jsx';
import UpdateProfile from './Component/Profile/UpdateProfile.jsx';
import Aos from 'aos';
import 'aos/dist/aos.css';
import NoticeAndCalender from './Component/HomeComponent/NoticeAndCalender.jsx';
import EmployeeRoute from './Component/PrivateRoute/EmployeeRoute.jsx';
const queryClient = new QueryClient();
Aos.init();
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/employee-registration',
        element: <SignUp />,
      },
      {
        path: '/hr-registration',
        element: <SignUpHr />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/payment/:id',
        element: <Payment />,
      },
      {
        path: '/notice',
        element: <NoticeAndCalender />,
      },
    ],
  },
  {
    path: '',
    element: <HrRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'add-asset',
        element: (
          <AdminRoute>
            <AddAsset />
          </AdminRoute>
        ),
      },
      {
        path: 'asset-list',
        element: (
          <AdminRoute>
            <AssetList />
          </AdminRoute>
        ),
      },
      {
        path: 'all-request',
        element: (
          <AdminRoute>
            <AllRequest />
          </AdminRoute>
        ),
      },
      {
        path: 'my-employee',
        element: (
          <AdminRoute>
            <MyEmployee />
          </AdminRoute>
        ),
      },
      {
        path: 'add-employee',
        element: (
          <AdminRoute>
            <AddEmployee />
          </AdminRoute>
        ),
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'update-profile',
        element: <UpdateProfile />,
      },
      {
        path: 'paymentPage',
        element: <PaymentPage />,
      },
      {
        path: 'updateAsset/:id',
        element: (
          <AdminRoute>
            <UpdateAsset />,
          </AdminRoute>
        ),
      },
      {
        path: 'my-team',
        element: (
          <EmployeeRoute>
            <MyTeam />
          </EmployeeRoute>
        ),
      },
      {
        path: 'req-forAsset',
        element: (
          <EmployeeRoute>
            <ReqForAsset />
          </EmployeeRoute>
        ),
      },
      {
        path: 'my-asset',
        element: (
          <EmployeeRoute>
            <MyAsset />
          </EmployeeRoute>
        ),
      },
      {
        path: 'mes-reply/:id',
        element: <MsgReply />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <RouterProvider router={router} />
          <Toaster />
        </HelmetProvider>
      </QueryClientProvider>
    </AuthProvider>
    {/* <ToastContainer /> */}
  </React.StrictMode>
);
