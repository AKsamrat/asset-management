import React from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import Swal from 'sweetalert2';
const options = {
  // default is `save`
  method: 'open',

  resolution: Resolution.HIGH,
  page: {
    margin: Margin.SMALL,
    format: 'letter',
    orientation: 'landscape',
  },
  canvas: {
    mimeType: 'image/png',
    qualityRatio: 1,
  },

  overrides: {
    pdf: {
      compress: true,
    },
    canvas: {
      useCORS: true,
    },
  },
};
const getTargetElement = () => document.getElementById('container');

const downloadPdf = () => generatePDF(getTargetElement, options);

const MyAssetData = ({ asset, refetch }) => {
  const axiosSecure = useAxiosSecure();
  const reqData = {
    assetId: asset?.assetId,
  };
  const handleReturn = id => {
    console.log(id);
    axiosSecure.patch(`/increase-qty/${id}`, reqData).then(res => {
      console.log(res.data);
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          title: 'Returned!',
          text: 'Your file has been Returned.',
          icon: 'success',
        });
      }
    });
  };

  //cancel request================xxxxxxxxxxxxxxxxxx
  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!',
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/reject-request/${id}`).then(res => {
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
    <tr
      data-aos="fade-left"
      data-aos-duration="1000"
      key={asset._id}
      id="container"
    >
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">
              {asset?.assetName}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{asset?.assetType}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {new Date(asset?.reqDate).toLocaleDateString()}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {asset?.appDate ? new Date(asset?.appDate).toLocaleDateString() : ''}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{asset?.reqStatus}</p>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {asset?.reqStatus === 'pending' ? (
          <button
            onClick={() => handleDelete(asset?._id)}
            className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight "
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            ></span>
            <span className="relative">Cancel</span>
          </button>
        ) : asset?.reqStatus === 'approved' ? (
          <button
            onClick={downloadPdf}
            className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight "
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            ></span>
            <span className="relative">Generate PDF</span>
          </button>
        ) : (
          <p></p>
        )}
        {asset?.reqStatus === 'approved' &&
        asset?.assetType === 'returnable' ? (
          <button
            onClick={() => handleReturn(asset?._id)}
            className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight "
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
            ></span>
            <span className="relative">Return</span>
          </button>
        ) : (
          <p></p>
        )}
      </td>
    </tr>
  );
};

export default MyAssetData;
