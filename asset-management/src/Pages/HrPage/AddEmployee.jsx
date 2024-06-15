import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaUserGroup } from 'react-icons/fa6';
import { Helmet } from 'react-helmet-async';

const AddEmployee = () => {
  const { user } = useAuth();
  const [myEmployeeCount, setMyEmployeeCount] = useState('');
  const axiosCommon = useAxiosCommon();
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState('');

  const [itemperPage, setItemperPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);

  //for check box============================
  const [allchecked, setAllChecked] = React.useState([]);
  function handleChange(e) {
    if (e.target.checked) {
      setAllChecked([...allchecked, e.target.value]);
    } else {
      setAllChecked(allchecked.filter(item => item !== e.target.value));
    }
  }
  console.log(allchecked);
  const handleCheckbox = () => {
    allchecked?.map(value => {
      addEmployees(value);
    });
    setAllChecked('');
    refetch();
  };

  //employee limit count

  const { data: employeeCount = [] } = useQuery({
    queryFn: async () => {
      const { data } = await axiosCommon(`/employee-count/${user?.email}`);
      console.log(data);
      return data;
    },
    queryKey: ['employeeCount', user?.email],
  });
  const limitEmploye = employeeCount.reduce(
    (total, employees) => total + employees.employee,
    0
  );

  //=============

  //lode user data with pagination
  const {
    data: allUsers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axiosSecure(
        `/all-users?page=${currentPage}&size=${itemperPage}`
      );
      console.log(data);
      return data;
    },
    queryKey: ['allUsers', count, currentPage, itemperPage],
  });

  //for pagination----------------------------

  const numberOfpages = Math.ceil(count / itemperPage);
  const pages = [...Array(numberOfpages).keys()];

  const handleItemsPerPage = e => {
    console.log(e.target.value);
    const val = parseInt(e.target.value);
    setItemperPage(val);
    setCurrentPage(0);
  };

  const { data: assetCount } = useQuery({
    queryFn: async () => {
      const { data } = await axiosCommon('/userCount');
      console.log(data);
      // refetch();
      setCount(data.count);

      return data;
    },
    queryKey: ['assetCount', search],
  });

  const handlePreviouspage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextpage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  //Add Employee============================
  const hrData = {
    hrEmail: user?.email,
    hrName: user?.displayName,
  };

  const addEmployees = id => {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'You want to Add !',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, want it!',
    // }).then(result => {
    if (true) {
      axiosSecure.post(`/add-employee/${id}`, hrData).then(res => {
        console.log(res.data);
        if (res.data.insertedId) {
          refetch();
          Swal.fire({
            title: 'Added!',
            text: 'Your file has been added.',
            icon: 'success',
          });
        }
      });
      axiosSecure.patch(`/employee-infoAdd/${id}`, hrData).then(res => {
        console.log(res.data);
        if (res.data.insertedId) {
          refetch();
          // Swal.fire({
          //   title: 'Added!',
          //   text: 'Your file has been deleted.',
          //   icon: 'success',
          // });
        }
      });
    }

    refetch();
  };

  //count my emplyee======================
  const { data: myEmployee = [] } = useQuery({
    queryFn: async () => {
      const { data } = await axiosCommon(`/employeeCount/${user?.email}`);
      // console.log(data);

      setMyEmployeeCount(data.length);
      return data;
    },
    queryKey: ['myEmployee', user?.email],
  });

  return (
    <div className="mx-w-7xl pt-24 mx-auto px-5 md:px-8 lg:px-36 ">
      <Helmet>
        <title>Hr | Add Employee</title>
      </Helmet>
      <h1 className="text-center text-4xl font-bold">
        Add <span className="text-[#FEBF32]">Employee</span>
      </h1>
      <p className="text-center text-lg mb-11">
        Please Add your Employee under your Subscription{' '}
      </p>
      <div className="flex justify-center items-center gap-4 py-6">
        <div className="bg-yellow-200 p-4 text-center rounded-lg">
          <h2 className="text-xl font-semibold">My Employee</h2>
          <p className="text-3xl font-bold">{myEmployeeCount}</p>
        </div>
        <div className="bg-yellow-200 p-4 text-center rounded-lg">
          <h2 className="text-xl font-semibold">My Package Limit</h2>
          <p className="text-3xl font-bold flex justify-center items-center gap-6">
            {limitEmploye} <FaUserGroup></FaUserGroup>
          </p>
        </div>
        <Link to={'/paymentPage'}>
          <button className="px-3 py-2 bg-[#FEBF32] rounded-xl font-semibold">
            Increase limit
          </button>
        </Link>
      </div>
      <div className="flex justify-center items-center gap-3"></div>
      <div className="py-8 max-w-4xl mx-auto">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th scope="col">
                    <input
                      value="One"
                      type="checkbox"
                      onChange={handleChange}
                      className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Member Name
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Member Type
                  </th>

                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Add Employee
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(eUser => (
                  <tr
                    data-aos="fade-left"
                    data-aos-duration="1000"
                    key={eUser._id}
                  >
                    <td scope="row">
                      <input
                        value={eUser._id}
                        type="checkbox"
                        onChange={handleChange}
                        // checked={!allchecked ? 'false' : 'true'}
                      />
                    </td>
                    <td>
                      <div className="flex-shrink-0">
                        <div className="block relative h-10 w-12 ml-4">
                          <img
                            alt="profile"
                            src={eUser?.image_url}
                            className="mx-auto object-cover rounded h-full w-full "
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {eUser?.name}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {eUser?.role}
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        disabled={
                          eUser?.hrData?.hrEmail ||
                          myEmployeeCount === limitEmploye
                        }
                        onClick={() => addEmployees(eUser?._id)}
                        className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight disabled:cursor-progress"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">
                          {' '}
                          {eUser?.hrData?.hrEmail ? 'Already Added' : 'ADD'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleCheckbox}
              className="px-3 py-2 bg-[#FEBF32] rounded-xl font-semibold"
            >
              Add Selected Member
            </button>
          </div>
        </div>
      </div>
      <div className="pagination mx-auto ">
        <button onClick={handlePreviouspage}>Prev</button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`hidden ${
              currentPage === p ? 'bg-[#FEBF32] text-white' : ''
            } px-4 py-2 mx-1 transition-colors duration-300 transform  rounded-md sm:inline hover:bg-[#ffd16c] hover:text-white`}
          >
            {p}
          </button>
        ))}

        <button onClick={handleNextpage}>Next</button>

        <select value={itemperPage} onChange={handleItemsPerPage} name="" id="">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>
  );
};

export default AddEmployee;
