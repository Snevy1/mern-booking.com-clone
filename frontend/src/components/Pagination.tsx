

import React, { useState, useEffect } from 'react';

export type Props = {
    page: number;
    pages: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({ page, pages, onPageChange }: Props) => {
    const [visiblePages, setVisiblePages] = useState<number[]>([]);
    
    // Calculate which page numbers to show (with ellipsis for many pages)
    useEffect(() => {
        const maxVisible = 5; // Number of page buttons to show
        let pageNumbers: number[] = [];
        
        if (pages <= maxVisible) {
            // Show all pages if total pages are less than maxVisible
            for (let i = 1; i <= pages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);
            
            let start = Math.max(2, page - 1);
            let end = Math.min(pages - 1, page + 1);
            
            // Adjust if we're near the start
            if (page <= 3) {
                end = Math.min(pages - 1, 4);
            }
            
            // Adjust if we're near the end
            if (page >= pages - 2) {
                start = Math.max(2, pages - 3);
            }
            
            // Add ellipsis after first page if needed
            if (start > 2) {
                pageNumbers.push(-1); // -1 represents ellipsis
            }
            
            // Add middle pages
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }
            
            // Add ellipsis before last page if needed
            if (end < pages - 1) {
                pageNumbers.push(-2); // -2 represents ellipsis
            }
            
            // Always show last page
            if (pages > 1) {
                pageNumbers.push(pages);
            }
        }
        
        setVisiblePages(pageNumbers);
    }, [page, pages]);

    const handlePrevious = () => {
        if (page > 1) {
            onPageChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < pages) {
            onPageChange(page + 1);
        }
    };

    // Generate page numbers array if you want simple pagination
    const simplePageNumbers = [];
    for (let i = 1; i <= pages; i++) {
        simplePageNumbers.push(i);
    }

    if (pages <= 1) return null;

    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-4">
            {/* Mobile - Simple pagination for small screens */}
            <div className="flex items-center justify-between w-full md:hidden">
                <button
                    onClick={handlePrevious}
                    disabled={page === 1}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>
                
                <div className="text-sm font-medium text-gray-700">
                    Page <span className="font-bold">{page}</span> of <span className="font-bold">{pages}</span>
                </div>
                
                <button
                    onClick={handleNext}
                    disabled={page === pages}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                >
                    Next
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Desktop - Full pagination */}
            <div className="hidden md:flex items-center justify-center space-x-2">
                {/* Previous button */}
                <button
                    onClick={handlePrevious}
                    disabled={page === 1}
                    className="flex items-center justify-center w-10 h-10 text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                    aria-label="Previous page"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                    {visiblePages.map((pageNum, index) => {
                        if (pageNum < 0) {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="flex items-center justify-center w-10 h-10 text-gray-400"
                                >
                                    ...
                                </span>
                            );
                        }
                        
                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`
                                    flex items-center justify-center w-10 h-10 text-sm font-medium rounded-full
                                    transition-all duration-300 transform hover:scale-105 active:scale-95
                                    ${page === pageNum
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                                    }
                                `}
                                aria-label={`Page ${pageNum}`}
                                aria-current={page === pageNum ? 'page' : undefined}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                {/* Next button */}
                <button
                    onClick={handleNext}
                    disabled={page === pages}
                    className="flex items-center justify-center w-10 h-10 text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                    aria-label="Next page"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-500 hidden md:block">
                Showing page <span className="font-semibold text-gray-700">{page}</span> of{" "}
                <span className="font-semibold text-gray-700">{pages}</span>
            </div>

            {/* Jump to page (optional feature) */}
            {pages > 10 && (
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Go to:</span>
                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            max={pages}
                            defaultValue={page}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const value = parseInt(e.currentTarget.value);
                                    if (!isNaN(value) && value >= 1 && value <= pages) {
                                        onPageChange(value);
                                        e.currentTarget.value = '';
                                    }
                                }
                            }}
                            className="w-20 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Page"
                        />
                        <button
                            onClick={(e) => {
                                const input = e.currentTarget.previousSibling as HTMLInputElement;
                                const value = parseInt(input.value);
                                if (!isNaN(value) && value >= 1 && value <= pages) {
                                    onPageChange(value);
                                    input.value = '';
                                }
                            }}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pagination;







// The commentent out is the original code

/* export type Props = {
    page: number,
    pages:number;
    onPageChange: (page:number)=> void;

};


const Pagination = ({page,pages, onPageChange}:Props)=>{
    const pageNumbers = [];

    for(let i = 1; i <= pages; i++){
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center ">
            <ul className="flex border border-slate-300">
                {
                   pageNumbers.map((number)=>(
                    <li className={`px-2 py-1 ${page === number ? "bg-gray-200": ""}`}>
                         <button onClick={()=>onPageChange(number)} className="cursor-pointer">{number}</button>
                    </li>
                   )) 
                }

            </ul>

        </div>
    )

};


export default Pagination; */