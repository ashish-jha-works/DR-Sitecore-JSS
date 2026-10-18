import ChevronLeft from 'assets/icons/ChevronLeft';
import ChevronRight from 'assets/icons/ChevronRight';
import React, { useState, useEffect } from 'react';

const getPaginationRange = (currentPage: number, totalPages: number, isMobile: boolean) => {
  const delta = isMobile ? 0 : 1;
  const range = [];
  const rangeWithDots = [];
  let prev;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (prev) {
      if (i - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (i - prev !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    prev = i;
  }

  return rangeWithDots;
};

export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: any) {
  const [isMobile, setIsMobile] = useState(false);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (totalPages <= 1) return null;

  const paginationRange = getPaginationRange(currentPage, totalPages, isMobile);

  const handleAction = (page: number) => {
    onPageChange(page);

    // const section = document.querySelector('.pagination-wrapper')?.closest('section');
    // if (section) {
    //     section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // }
  };

  return (
    <nav className="pagination-wrapper mt-5 md:mt-6">
      <ul className="flex items-center justify-center gap-1 md:gap-2 list-none p-0">
        <li className="me-auto">
          <button
            className={`btn btn-secondary ${
              currentPage === 1 ? 'disabled opacity-50 pointer-events-none' : ''
            } size-11 p-2 rounded-md md:rounded-xl`}
            onClick={() => handleAction(currentPage - 1)}
            aria-label="Previous Page"
          >
            <ChevronLeft />
          </button>
        </li>

        {paginationRange.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-1 md:px-2 font-bold text-gray-500">...</span>
            ) : (
              <button
                className={`btn ${
                  currentPage === page ? 'btn-primary' : 'btn-secondary'
                } size-11 p-1 rounded-md md:rounded-xl md:p-2 text-sm md:text-base`}
                onClick={() => handleAction(Number(page))}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        <li className="ms-auto">
          <button
            className={`btn btn-secondary ${
              currentPage === totalPages ? 'disabled opacity-50 pointer-events-none' : ''
            } size-11 p-2 rounded-md md:rounded-xl`}
            onClick={() => handleAction(currentPage + 1)}
            aria-label="Next Page"
          >
            <ChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
}
