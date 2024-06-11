interface Props {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, lastPage, onPageChange }: Props): JSX.Element => {
  const pages = [...Array(lastPage).keys()].map((page: number) => page + 1)

  return (
    <div>
      <div className="justify-between hidden text-sm sm:flex">
        <div>
          <span className="font-bold">{currentPage}</span>
          <span className="mx-1">of</span>
          <span className="font-bold">{lastPage}</span>
        </div>
        <div className="btn-group">
          {pages.map((page) => (
            <button
              key={page}
              className={
                page === currentPage ? 'btn-active btn-sm btn' : 'btn-sm btn'
              }
              onClick={() => {
                onPageChange(page)
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center sm:hidden">
        <div className="btn-group">
          <button
            className="btn"
            disabled={currentPage === 1}
            onClick={() => {
              onPageChange(currentPage - 1)
            }}
          >
            «
          </button>
          <button className="btn">Page {currentPage}</button>
          <button
            className="btn"
            disabled={currentPage === lastPage}
            onClick={() => {
              onPageChange(currentPage + 1)
            }}
          >
            »
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pagination
