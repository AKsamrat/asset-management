import React from 'react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto ">
      <h1 className="text-center text-4xl font-bold mt-16">
        About <span className="text-[#FEBF32]">US</span>
      </h1>
      <p className="text-center text-lg mb-11">Some quote About Our Company </p>
      <div className="lg:px-16">
        <ol className="text-[16px] text-gray-500 font-medium list-disc">
          <li>
            This is an asset management web base system .Where any company can
            operate their business smoothly .If you want to use this system you
            need to follow some rules.
            <br />
          </li>
          <li>
            Firstly you need to register as hr manager . In this system we have
            three package for get employee. You can select and pay in the
            registration period . If you dont you can pay later. But one things
            you can't access any hr manager feature without payment.
          </li>
          <li className="my-3 ">
            when you want to access any feature it will be redirect you in the
            payment page. after select package and payment you can access your
            all feature.In the navbar you can find your all feature.
            <ol className="pl-4 list list-disc">
              <li>
                <span className="font-bold text-black">Home : </span> In your
                home page will sow some important table.Where you can find your
                limited stock list,pending request,Top request item . Also you
                can find pie chart which will show you summary of your available
                and un available asset. After that you can find message section
                of your employee and you can also reply them
              </li>
              <li>
                <span className="font-bold text-black">Asset List : </span> In
                this section you can find all of your asset of your
                business.From this section search ,query and filter of your
                asset to known good about your asset.
              </li>
              <li>
                <span className="font-bold text-black">Add Asset : </span> In
                this section you can find a form where you can add your asset.
              </li>
              <li>
                <span className="font-bold text-black">All Request : </span> In
                this section you can find all of asset request which come from
                your employee.By clicking approve button you can approve them.
              </li>
              <li>
                <span className="font-bold text-black">Add Employee : </span> In
                this section you can find all employee who are not affiliated
                with any company.you can add them by clicking add them.In top
                you can find your employee count and also limit count.
              </li>
            </ol>
          </li>
          <li>
            For your employee there some feature also
            <ol className="pl-4 list list-disc">
              <li>
                <span className="font-bold text-black">Home : </span> In your
                home page will sow some important table.Where you can find your
                limited stock list,pending request,Top request item . After that
                you can find notice section where you can talk to the your hr
                manager. And you can find hr manger answer below them.
              </li>
              <li>
                <span className="font-bold text-black">My asset : </span> You
                can find all of your approved asset request here.
              </li>
              <li>
                <span className="font-bold text-black">My team : </span> You can
                find all of your approved team member.
              </li>
              <li>
                <span className="font-bold text-black">
                  Request for asset :{' '}
                </span>
                In this section you can send request for any product which
                showing in table.
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default About;
