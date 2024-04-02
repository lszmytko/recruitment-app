import { Dispatch, SetStateAction } from "react";
import ReactPaginate from "react-paginate";

type Props = {
  pageCount: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
};

export default function Pagination({ pageCount, setPage, page }: Props) {
  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
  };

  return (
    <div className="mt-4 flex justify-center">
      <ReactPaginate
        className="flex gap-2"
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
        activeLinkClassName="bg-sky-100 px-1 rounded"
        forcePage={page - 1}
      />
    </div>
  );
}
