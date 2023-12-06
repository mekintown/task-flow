// PaginationComponent.js
import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (arg0: number) => void;
}
const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex justify-center mt-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page + 1)}
          className={`px-4 py-2 mx-1 rounded-md ${
            currentPage === page + 1 ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          {page + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
