import { useState } from 'react';
import useAxiosCommon from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';

const TopReqitems = () => {
  const { user } = useAuth();
  const axiosCommon = useAxiosCommon();
  const [itemperPage, setItemperPage] = useState(4);
  const [sort, setSort] = useState('dec');

  const {
    data: allAssets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axiosCommon(
        `/topReq-items/${user?.email}?size=${itemperPage}&sort=${sort}`
      );
      console.log(data);
      return data;
    },
    queryKey: ['allAssets', itemperPage, sort, user?.email],
  });

  return (
    <div className="mx-w-5xl pt-24 mx-auto px-5 md:px-8 lg:px-20 ">
      <h1 className="text-center text-4xl font-bold">
        Top Requested <span className="text-[#FEBF32]">Assets</span>
      </h1>
      <p className="text-center text-lg py-3">
        Here Your All top requested asset which are made by employee
      </p>

      <div className="py-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Requested
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Added Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {allAssets.map(asset => (
                  <tr
                    data-aos="fade-left"
                    data-aos-duration="1000"
                    key={asset._id}
                  >
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {asset?.productName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {asset?.productType}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {asset?.productQty} Pcs
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {asset?.reqCount} Times
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {new Date(asset?.addetDate).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopReqitems;
