import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // We still need the Navbar component here

const LayoutWithNavbar = () => {
  // This component is now much simpler.
  // It ALWAYS renders the Navbar, and then the page that matches the route.
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default LayoutWithNavbar;