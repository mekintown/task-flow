import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface Props {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalTasks,
  onPageChange,
}: Props) => {
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const pageNumbers = () => {
    const pages = [];
    const surroundingPages = 2; // Number of pages before and after the current page
    const startPage = Math.max(1, currentPage - surroundingPages);
    const endPage = Math.min(totalPages, currentPage + surroundingPages);

    // Add first page and possibly an ellipsis
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    // Add the current range of pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add an ellipsis and the last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white dark:bg-transparent px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        {/* Previous Button - Always visible */}
        <button
          onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
          className="flex-1 inline-flex justify-start items-center rounded-l-md px-2 py-2 dark:bg-gray-900 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          disabled={currentPage === 1}
        >
          <IoChevronBackOutline size={20} />
          <span className="ml-2">Previous</span>
        </button>

        {/* Next Button - Always visible */}
        <button
          onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
          className="flex-1 inline-flex justify-end items-center rounded-r-md px-2 py-2 dark:bg-gray-900 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          disabled={currentPage === totalPages}
        >
          <span className="mr-2">Next</span>
          <IoChevronForwardOutline size={20} />
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-col sm:gap-2 md:flex-row sm:flex-1 sm:items-center sm:justify-center md:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-50">
            Showing{" "}
            <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(totalTasks, totalPages * 10)}
            </span>{" "}
            of <span className="font-medium">{totalTasks}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              disabled={currentPage === 1}
            >
              <IoChevronBackOutline size={14} />
            </button>

            {pageNumbers().map((page, index) =>
              typeof page === "number" ? (
                // Page Number Button
                <button
                  key={index}
                  onClick={() => handlePageClick(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === page
                      ? "z-10 bg-sky-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                      : "text-gray-900 dark:bg-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                  }`}
                >
                  {page}
                </button>
              ) : (
                // Ellipsis
                <span
                  key={index}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-50"
                >
                  {page}
                </span>
              )
            )}

            <button
              onClick={() =>
                handlePageClick(Math.min(totalPages, currentPage + 1))
              }
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset
              ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              disabled={currentPage === totalPages}
            >
              <IoChevronForwardOutline size={14} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
