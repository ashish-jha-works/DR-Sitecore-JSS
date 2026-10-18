import React from 'react';

const Legends = () => {
  return (
    <ul className="flex flex-wrap gap-5 md:gap-6 mt-5 md:mt-6 text-body font-light">
      <li className="flex items-center gap-2 md:gap-3">
        <span className="size-6 bg-success-50 rounded-sm border border-solid border-success-500"></span>
        Upcoming
      </li>
      <li className="flex items-center gap-2 md:gap-3">
        <span className="size-6 bg-lilac-100 rounded-sm border border-solid border-lilac-500"></span>
        Previous
      </li>
      <li className="flex items-center gap-2 md:gap-3">
        <span className="size-6 bg-danger-50 rounded-sm border border-solid border-danger-500"></span>
        Cancelled
      </li>
    </ul>
  );
};

export default Legends;
