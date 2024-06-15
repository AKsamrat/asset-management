import React from 'react';
import Banner from '../Component/Banner/Banner';
import About from '../Component/About/About';
import Packages from '../Component/Packages/Packages';
import useRool from '../hooks/useRool';
import EmpPendingRequest from '../Component/HomeComponent/EmpPendingRequest';
import EmpAllRequest from '../Component/HomeComponent/EmpAllRequest';
import NoticeAndCalender from '../Component/HomeComponent/NoticeAndCalender';
import PendingRequestHr from '../Component/HrHomeComponents/PendingReqHr';
import TopReqitems from '../Component/HrHomeComponents/TopReqItems';
import LimitedStockItems from '../Component/HrHomeComponents/LimitedStockItems';
import HrPieChart from '../Component/HrHomeComponents/HrPieChart';
import EmployeeQuery from '../Component/HrHomeComponents/EmployeeQuery';
import Testimonial from './HrPage/Testimonial';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const [role] = useRool();
  return (
    <div className="max-w-7xl mx-auto">
      <Helmet>
        <title>Home</title>
      </Helmet>
      {role === 'employee' ? (
        <div>
          <EmpPendingRequest></EmpPendingRequest>
          <EmpAllRequest></EmpAllRequest>
          <NoticeAndCalender></NoticeAndCalender>
        </div>
      ) : role === 'Hr Manager' ? (
        <div>
          <PendingRequestHr></PendingRequestHr>
          <TopReqitems></TopReqitems>
          <LimitedStockItems></LimitedStockItems>
          <HrPieChart></HrPieChart>
          <EmployeeQuery></EmployeeQuery>
          <Testimonial></Testimonial>
        </div>
      ) : (
        <div>
          <Banner></Banner>
          <About></About>
          <Packages></Packages>
        </div>
      )}
    </div>
  );
};

export default Home;
