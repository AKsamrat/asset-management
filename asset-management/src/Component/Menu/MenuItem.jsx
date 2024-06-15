import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const MenuItem = ({ label, address }) => {
  return (
    <NavLink
      to={address}
      end
      className={({ isActive, isPending }) =>
        isPending
          ? 'pending'
          : isActive
          ? 'text-[#FEBF32] bg-[#febd3223] px-2 py-2 rounded-lg font-semibold'
          : 'hover:text-[#dba635]'
      }
    >
      <span className="mx-4 font-medium">{label}</span>
    </NavLink>
  );
};
MenuItem.propTypes = {
  label: PropTypes.string,
  address: PropTypes.string,
};

export default MenuItem;
