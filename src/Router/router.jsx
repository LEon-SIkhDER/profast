import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import ForgetPass from "../Pages/Auth/ForgetPass";
import VerifyCode from "../Pages/Auth/VerifyCode";
import ResetPassword from "../Pages/Auth/ResetPassword";
import Coverage from "../Pages/Coverage/Coverage";
import ErrorElement from "../Pages/ErrorPage/ErrorElement";
import AboutUsPage from "../Pages/AboutUs/AboutUsPage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import DashBoard from "../Layout/Dashboard/Dashboard";
import Dashboard from "../Layout/Dashboard/Dashboard";
import MyParcels from "../Pages/Dashboard/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHIstory from "../Pages/Dashboard/PaymentHIstory";
import TrackYourParcel from "../Pages/Dashboard/TrackYourParcel";
import UpdateProfile from "../Pages/Dashboard/UpdateProfile";
import BeARiderForm from "../Pages/BeARider/BeARiderForm";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import MyParcel from "../Pages/Dashboard/MyParcel/MyParcel";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin";
import AdminRoute from "../PrivateRoute/AdminRoute";
import Forbidden from "../Components/Forbidden";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorElement></ErrorElement>,
    children: [
      { index: true, Component: Home },
      {
        path: "/coverage",
        loader: () => fetch("./serviceCenter.json"),
        Component: Coverage
      },
      {
        path: "/about-us",
        Component: AboutUsPage
      },
      {
        path: "/send-parcel",
        loader: async () => {
          const wareHouses = await fetch("./warehouses.json").then(res => res.json())
          const division = await fetch("./division.json").then(res => res.json())
          return { wareHouses, division }

        },
        element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>
      },
      {
        path: "/be-a-rider",
        loader: async () => {
          const warehouses = await fetch("./warehouses.json").then(res => res.json())
          const divisions = await fetch("./division.json").then(res => res.json())
          return { warehouses, divisions }

        },
        element: <PrivateRoute><BeARiderForm></BeARiderForm></PrivateRoute>
      },

    ]
  },

  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login
      },
      {
        path: "register",
        Component: Register
      },
      {
        path: "forget-pass",
        Component: ForgetPass
      },
      {
        path: "/verify-code",
        Component: VerifyCode
      },
      {
        path: "/reset-password",
        Component: ResetPassword
      }

    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    children: [
      {
        index: true,
        // loader:()=> fetch("./warehouses.json"),
        Component: MyParcels
      },
      {
        path: "my-parcel/:id",
        Component: MyParcel
      },
      {
        path: "/dashboard/payment/:id",
        Component: Payment
      },
      {
        path: "payment-history",
        Component: PaymentHIstory
      },
      {
        path: "track-your-parcel",
        Component: TrackYourParcel
      },
      {
        path: "update-profile",
        Component: UpdateProfile
      },
      // admin 
      {
        path: "assign-rider",
        loader:()=> fetch("/warehouses.json"),
        element: <AdminRoute><AssignRider></AssignRider></AdminRoute>
      },
      {
        path: "active-riders",
        element: <AdminRoute><ActiveRiders></ActiveRiders></AdminRoute>
      },
      {
        path: '/dashboard/pending-riders',
        element: <AdminRoute><PendingRiders></PendingRiders></AdminRoute>
      },
      {
        path: "make-admin",
        element: <AdminRoute><MakeAdmin></MakeAdmin></AdminRoute>
      }
    ]

  },
  {
    path: "/forbidden",
    Component: Forbidden
  }


]);