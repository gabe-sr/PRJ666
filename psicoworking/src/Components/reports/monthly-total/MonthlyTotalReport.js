import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import QueryForm from "./QueryForm";
import "./MontlyTotalReport.css";
import NewTableData from "../../shared/table_data_new/NewTableData";
import WithLoadingSpinner from "../../HOC/loading-spinner/WithLoadingSpinner";
import WithMessage from "../../HOC/modal-messages/WithMessage";
import axios from "axios";
import { format } from "date-fns";

const MonthlyTotalReport = (props) => {
  const [query, setQuery] = useState();
  const [month, setMonth] = useState();
  const [data, setData] = useState();
  const [total, setTotal] = useState();
  const [textResponse, setTextResponse] = useState(null);

  const { setLoadingSpinner, setModalMessage } = props;

  const handleQuery = (_query) => {
    setQuery(_query);
    console.log(_query);
  };

  useEffect(() => {
    if (query) {
      setLoadingSpinner(true, "Generating report data...");
      const fetchTotal = async () => {
        try {
          const response = await axios.get(`/reports/monthlytotal?${query}`);
          setData(response.data);
          let sum = 0;
          response.data.forEach((d) => {
            sum += d.total;
          });
          setTotal(sum.toFixed(2));
          setMonth(format(new Date(response.data[0].lastBookingDate), "MMMM"));
        } catch (err) {
          console.log(err);
          setTextResponse("Something went wrong. Please, try again later.");
          setModalMessage(
            true,
            "Something went wrong",
            "We couldn't generate the report at this moment. Please, try again later."
          );
        } finally {
          setLoadingSpinner(false);
        }
      };
      fetchTotal();
      setQuery(null);
    }
  }, [query, setModalMessage, setLoadingSpinner]);

  return (
    <>
      <div className="query-container">
        <h3 className="text-secondary mb-4">Monthly Total Report</h3>
        <QueryForm setQuery={handleQuery} />
      </div>
      {data ? (
        <>
          <NewTableData
            headers={[
              "User Name",
              "Email",
              "CPF",
              "Last booking at",
              "Quantity",
              "Total",
            ]}
            columns={[
              "user.fullname",
              "user.email",
              "user.cpf_no",
              "lastBookingDate",
              "quantity",
              "total",
            ]}
            values={data}
            whenClicked={() => null}
          />
          <Row className="total">
            <Col className="total-col" xs={{ span: 3, offset: 7 }}>
              Total for {month}
            </Col>
            <Col className="total-col result" xs={{ span: 2 }}>
              R$ {total}
            </Col>
          </Row>
        </>
      ) : null}
    </>
  );
};

export default WithLoadingSpinner(WithMessage(MonthlyTotalReport));
