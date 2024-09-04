import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface PaginationButtonProps {
  page: number;
  count: number;
  total: number;
  noFurtherPages?: boolean;
  changePageNumber: (num: number) => void;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  page,
  count,
  total,
  noFurtherPages = false,
  changePageNumber,
}) => {

  // Calculate maxOnPage
  const maxOnPage = Math.min(count * page, total);

  // Calculate numPages
  const numPages = React.useMemo(() => {
    const lastPage = Math.ceil(total / count);
    let numArr: (number | string)[] = [];
    if (lastPage <= 6) {
      numArr = Array.from(new Array(lastPage), (_, i) => i + 1);
    } else if (window.innerWidth >= 768) {
      if (page < 3 || page > lastPage - 3) {
        numArr = [
          ...Array.from(new Array(3), (_, i) => i + 1),
          '...',
          ...Array.from(new Array(3), (_, i) => lastPage - 2 + i),
        ];
      } else {
        numArr = [
          1,
          '...',
          ...Array.from(new Array(3), (_, i) => page - 1 + i),
          '...',
          lastPage,
        ];
      }
    } else {
      if (page < 2 || page > lastPage - 2) {
        numArr = [
          ...Array.from(new Array(2), (_, i) => i + 1),
          '...',
          ...Array.from(new Array(2), (_, i) => lastPage - 1 + i),
        ];
      } else if (page === 2) {
        numArr = [1, 2, 3, '...', lastPage];
      } else {
        numArr = [1, '...', page, page + 1, '...', lastPage];
      }
    }
    return numArr;
  }, [page, count, total]);

  // Handle page number click
  const handleChangePageNumber = (num: number) => {
    changePageNumber(num);
  };

  // Generate class names for page number buttons
  const pageNumClass = (num: number | string) => {
    let classes =
      'relative inline-flex items-center border px-4 py-2 text-sm font-medium ';
    if (num === '...') {
      classes +=
        'cursor-default relative inline-flex items-center border border-gray-300 dark:border-gray-500 bg-white text-gray-700';
    } else if (num === page) {
      classes +=
        'border-sky-600 bg-sky-200 text-sky-800 hover:bg-gray-50 z-20';
    } else {
      classes +=
        'border-gray-300 dark:border-gray-500 bg-white text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-100 z-10';
    }
    return classes;
  };

  return (
    <div className="w-full flex items-center justify-between sm:border-t sm:border-gray-200 sm:py-3">
      <div className="flex flex-1 items-center justify-between flex-wrap flex-row-reverse sm:flex-row">
        <div className="w-full sm:w-auto pb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
            Showing{' '}
            <span className="font-medium">
              {1 + count * (page - 1)}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {maxOnPage}
            </span>{' '}
            of{' '}
            <span className="font-medium">
              {total}
            </span>{' '}
            result{total > 1 ? 's' : ''}
          </p>
        </div>
        <div className="pb-4 mx-auto sm:mr-0">
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => handleChangePageNumber(page - 1)}
              disabled={page <= 1}
              className={`relative inline-flex items-center rounded-l-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 px-2 py-2 text-sm font-medium focus:z-20 ${
                page > 1 ? 'text-gray-500 dark:text-gray-50 dark:text-gray hover:bg-gray-50 dark:hover:bg-gray-600' : 'text-gray-500 cursor-default'
              }`}
            >
              <span className="sr-only">Previous</span>
              <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" aria-hidden="true" />
            </button>
            {numPages.map((pageOption, idx) => (
              <button
                key={idx}
                onClick={() => handleChangePageNumber(pageOption as number)}
                disabled={pageOption === '...' || pageOption === page}
                className={pageNumClass(pageOption)}
              >
                {pageOption}
              </button>
            ))}
            <button
              onClick={() => handleChangePageNumber(page + 1)}
              disabled={noFurtherPages}
              className={`relative inline-flex items-center rounded-r-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 px-2 py-2 text-sm font-medium focus:z-20 ${
                noFurtherPages ? 'text-gray-500 cursor-default' : 'text-gray  hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <span className="sr-only">Next</span>
              <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PaginationButton;