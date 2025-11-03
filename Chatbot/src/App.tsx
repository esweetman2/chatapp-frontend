import {
  createBrowserRouter,
  RouterProvider
} from "react-router";
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
// import Layout from "../components/Layout";
import AppLayout from "../components/AppLayout";
import './App.css'
// import { IconButton, Paper, TextField, Typography } from '@mui/material';
// import { MyContext } from './context';
// import { useState } from "react";
// import { AuthProvider } from "./Context/AuthContext";
import { UserProvider } from "./Context/UserContext";
import ProtectedRoute from "../components/ProtectedRoutes";
// import { useContext } from "react";
// import React from "react";
// import ReactDOM from "react-dom/client";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginScreen />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            path: "chat",
            element: <ChatScreen />,
          },
        ],
      },
    ],
  },
]);

function App() {
  // const [username, setUsername] = useState('');


  return (
    <UserProvider>
    {/* <AuthProvider> */}
      <RouterProvider router={router} />
    {/* </AuthProvider> */}
    </UserProvider>
  )
}

export default App
