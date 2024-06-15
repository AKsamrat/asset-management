import MenuItem from './MenuItem';

const DefaultMenu = () => {
  return (
    <>
      <div className="flex justify-center items-center gap-4">
        <MenuItem label="Home" address="/" />
        <MenuItem label="Join As Employee" address="employee-registration" />
        <MenuItem label="Join As HR" address="hr-registration" />
      </div>
    </>
  );
};

export default DefaultMenu;
