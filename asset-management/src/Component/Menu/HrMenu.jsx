import React from 'react';
import MenuItem from './MenuItem';

const HrMenu = () => {
  return (
    <>
      <MenuItem label="Home" address="/" />
      <MenuItem label="Asset List" address="asset-list" />
      <MenuItem label="Add Asset" address="add-asset" />
      <MenuItem label="All Req." address="all-request" />
      <MenuItem label="My Employee" address="my-employee" />
      <MenuItem label="Add Employee" address="Add-employee" />
      <MenuItem label="Profile" address="profile" />
    </>
  );
};

export default HrMenu;
