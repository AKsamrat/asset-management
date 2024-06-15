import React from 'react';
import MenuItem from './MenuItem';

const EmployeeMenu = () => {
  return (
    <>
      <MenuItem label="Home" address="/" />
      <MenuItem label="My Asset" address="my-asset" />
      <MenuItem label="My Team" address="my-team" />
      <MenuItem label="Req. For Asset" address="req-forAsset" />
      <MenuItem label="Profile" address="profile" />
    </>
  );
};

export default EmployeeMenu;
