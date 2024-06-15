import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import useRool from '../../hooks/useRool';
import HrRoot from '../HrRoot/HrRoot';
import Footer from '../Footer/Footer';

const Root = () => {
  const [role] = useRool();
  return (
    <>
      {role === 'Hr Manager' ? (
        <HrRoot></HrRoot>
      ) : (
        <div>
          <Navbar></Navbar>
          <Outlet></Outlet>
          <Footer></Footer>
        </div>
      )}
    </>
  );
};

export default Root;
