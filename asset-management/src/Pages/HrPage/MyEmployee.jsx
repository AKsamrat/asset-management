import React, { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';

const MyEmployee = () => {
  const { user } = useAuth();
  const axiosCommon = useAxiosCommon();
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState('');

  const [itemperPage, setItemperPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);
  const {
    data: myEmployees = [],
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axiosSecure(
        `/my-employee/${user?.email}?page=${currentPage}&size=${itemperPage}`
      );
      console.log(data);
      return data;
    },
    queryKey: ['allAssets', count, currentPage, itemperPage],
  });

  //for pagination------

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
      const { data } = await axiosCommon(`/employeeCount/${user?.email}`);
      console.log(data);
      // refetch();
      setCount(data.count.length);

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

  //delete asset========

  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/myEmployee/${id}`).then(res => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success',
            });
          }
        });
      }
    });
  };
  return (
    <div className="mx-w-4xl pt-24 mx-auto px-5 md:px-8 lg:px-36 ">
      <Helmet>
        <title>Hr | My Employee</title>
      </Helmet>
      <h1 className="text-center text-4xl font-bold">
        My <span className="text-[#FEBF32]">Employee</span>
      </h1>
      <p className="text-center text-lg">Here is Your All Employee</p>

      <div className="py-8">
        <div className=" px-4 sm:px-8 py-4 overflow-x-auto max-w-5xl mx-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
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
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {myEmployees.map(employee => (
                  <tr
                    data-aos="fade-left"
                    data-aos-duration="1000"
                    key={employee._id}
                  >
                    <div className="flex-shrink-0">
                      <div className="block relative">
                        <img
                          alt="profile"
                          src={employee?.image_url}
                          className="mx-auto object-cover rounded h-10 w-15 "
                        />
                      </div>
                    </div>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {employee?.name}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {employee?.role}
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="pagination ">
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

export default MyEmployee;
