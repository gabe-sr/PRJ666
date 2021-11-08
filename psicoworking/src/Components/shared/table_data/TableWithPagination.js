// CUSTOM TABLE DATA COMPONENT: renders a table of data
// Props:
// values =  array of objects to be displayed
// headers =  array of headers
// columns =  array of columns (headers and columns must be in the same order)
// whenClicked = a callback to do something when clicking in a row
// customColumn = renders a custom column element (eg.: the activate green/red button)

import { React, useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";

const TableData = ({
  values,
  whenClicked,
  customColumn,
  pagination,
  paginationQuery,
  ...props
}) => {
  const [pagActive, setPagActive] = useState(1);
  const [currPage, setCurrPage] = useState();
  const [changed, setChanged] = useState(true);

  // calculates total of pages in pagination
  const { max_rows, paginationTotal } = pagination;
  let num_pages = Math.ceil(paginationTotal / max_rows);

  // sets pagination item to active
  const handlePagination = (e) => {
    if (parseInt(e.target.id) !== pagActive) {
      setChanged(true);
      setPagActive(parseInt(e.target.id));
    }
  };

  const handlePagFirstLast = (position) => {
    if (position === "last" && pagActive < num_pages) {
      setChanged(true);
      setPagActive(num_pages);
    } else if (position === "first" && pagActive > 1) {
      setChanged(true);
      setPagActive(1);
    }
  };

  const handlePagNextPrev = (position) => {
    if (position === "next" && pagActive < num_pages) {
      setChanged(true);
      setPagActive((prev) => prev + 1);
    } else if (position === "prev" && pagActive > 1) {
      setChanged(true);
      setPagActive((prev) => prev - 1);
    }
  };

  // updates the pagination
  // returns pagination query to parent component via callback
  useEffect(() => {
    if (changed) {
      paginationQuery(
        `&startpage=${(pagActive - 1) * max_rows}&maxrows=${max_rows}`
      );
      setCurrPage(pagActive);
      setChanged(false);
    }
  }, [pagActive, changed, paginationQuery, values, max_rows]);

  // Create the pagination items
  let items = [];
  for (let number = 1; number <= num_pages; number++) {
    items.push(
      <Pagination.Item
        onClick={handlePagination}
        key={number}
        active={number === pagActive}
        id={number}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <>
      {values.length > 0 ? (
        <>
          <Table bordered responsive hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                {props.headers.map((head, index) => (
                  <th key={index}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {values.map((user, index) => (
                <tr style={{ cursor: "pointer" }} key={index}>
                  <td onClick={() => whenClicked(user)}>
                    {((currPage - 1) * max_rows + index + 1).toString()}
                  </td>

                  {props.columns.map((colName, index) => {
                    switch (colName) {
                      case "fullname":
                        return (
                          <td
                            onClick={() => whenClicked(user)}
                            key={index}
                          >{`${user.first_name} ${user.last_name}`}</td>
                        );

                      // Custom Column data: returns a custom component passed in the props
                      // repeat for any future customized column component
                      case "activeAuthorize":
                        const { customColumnComp } = customColumn.find(
                          (fnc) => fnc.colDesc === "activeAuthorize"
                        );
                        return <td key={index}>{customColumnComp(user)}</td>;

                      default:
                        return (
                          <td onClick={() => whenClicked(user)} key={index}>
                            {user[colName]}
                          </td>
                        );
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </Table>

          <div>
            <Pagination>
              <Pagination.First onClick={() => handlePagFirstLast("first")} />
              <Pagination.Prev onClick={() => handlePagNextPrev("prev")} />
              {items}
              <Pagination.Next onClick={() => handlePagNextPrev("next")} />
              <Pagination.Last onClick={() => handlePagFirstLast("last")} />
            </Pagination>
          </div>
        </>
      ) : null}
    </>
  );
};

export default TableData;
