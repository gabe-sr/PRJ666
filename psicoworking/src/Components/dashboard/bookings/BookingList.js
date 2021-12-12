import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import NewTableData from "../../shared/table_data_new/NewTableData.js";
import {
  Button,
  ButtonGroup,
  Card,
  Container,
  Modal,
  Row,
  ToggleButton,
  Tabs,
  Tab,
} from "react-bootstrap";
import { format, parseISO, subMinutes } from "date-fns";
import "./BookingList.css";

const radios = [
  { name: "past bookings", value: "2" },
  { name: "upcoming bookings", value: "1" },
];

/* Receives a user id as a prop, returns a table containing all the bookings for
    that user. The user is able to request a cancellation if needed.*/
const BookingList = ({ user }) => {
  const [data, setData] = useState([]);
  const [radioValue, setRValue] = useState("1");
  const [show, setShow] = useState(false);
  const [tabKey, setTab] = useState("mine");
  // const [ context, setContext ] = useState();
  const tabChanged = useRef(false);
  // const [ currBkng, setBkng ] = useState({});
  const bk = useRef(null);
  const today = useRef(subMinutes(new Date(), new Date().getTimezoneOffset()));

  const fetchBookings = useCallback(
    async (key) => {
      try {
        console.log(key);
        if (key === "mine") {
          if (radioValue === "1") {
            // console.log(`sent today.current: ${today.current}`)
            // console.log(`radio value ${radioValue}`)
            const res = await axios.get("/book", {
              params: {
                type: "aftbkns",
                date: today.current,
                userid: user._id,
              },
            });
            const temp = await res.data;
            console.log(temp);
            setData(temp);
          } else {
            // console.log(`radio value ${radioValue}`)
            // console.log(`sent today.current: ${today.current}`)
            const res = await axios.get("/book", {
              params: {
                type: "bfrbkns",
                date: today.current,
                userid: user._id,
              },
            });
            const temp = await res.data;
            console.log(temp);
            setData(temp);
          }
        } else if (key === "general") {
          if (radioValue === "1") {
            // console.log(`radio value ${radioValue}`)
            const res = await axios.get("/book", {
              params: {
                type: "aftrequest",
                date: today.current,
                userid: user._id,
              },
            });
            const temp = await res.data;
            console.log(temp);
            setData(temp);
          } else {
            // console.log(`radio value ${radioValue}`)
            const res = await axios.get("/book", {
              params: {
                type: "bfrequest",
                date: today.current,
                userid: user._id,
              },
            });
            const temp = await res.data;
            console.log(temp);
            setData(temp);
          }
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }
      // if(radioValue === '1'){
      //     console.log(`radio value ${radioValue}`)
      //     const res = await axios.get('/book',{
      //         params:{
      //             type: 'aftrequest',
      //             date: today.current,
      //             userid: user._id
      //         }
      //     })
      //     const temp = await res.data
      //     setData(temp)
      // }
      // else{
      //     console.log(`radio value ${radioValue}`)
      //     const res = await axios.get('/book',{
      //         params:{
      //             type: 'bfrequest',
      //             date: today.current,
      //             userid: user._id
      //         }
      //     })
      //     const temp = await res.data
      //     setData(temp)
      // }
    },
    [radioValue, user._id]
  );

  const requestCancel = useCallback(
    async (bk) => {
      //set cancel request -> set cancel
      // console.log(bk)
      if (!bk._isCancelled && user.isAdmin) {
        const res = await axios.patch(`/book/cancel_approve/${bk._id}`, {
          _isCancelled: true,
        });
        // console.log(res)
      } else if (!bk.cancel_request) {
        const res = await axios.patch(`/book/cancel_request/${bk._id}`, {
          cancel_request: true,
        });
        // console.log(res)
      }
      fetchBookings(tabKey);
    },
    [user.isAdmin, fetchBookings, tabKey]
  );

  const customRequestColumn = (bk) => {
    const request = {
      variant: "secondary",
      text: "Request Cancel",
      disabled: false,
    };
    if (bk._isCancelled) {
      // console.log("custom column if cancelled exec")
      request.variant = "danger";
      request.text = "Booking cancelled";
      request.disabled = true;
    } else if (bk.cancel_request && !user.isAdmin) {
      // console.log("custom column if cancel req exec")
      request.variant = "warning";
      request.text = "Cancel request sent";
      request.disabled = true;
    } else if (bk.cancel_request && user.isAdmin) {
      request.variant = "info";
      request.text = "Cancel request received";
      request.disabled = false;
    }

    // console.log(bk)
    // console.log(request)
    // console.log("customRequestColumn exec")
    return (
      <Button
        variant={request.variant}
        disabled={request.disabled}
        size="sm"
        onClick={() => requestCancel(bk)}
      >
        {request.text}
      </Button>
    );
  };

  useEffect(() => {
    fetchBookings(tabKey);
  }, [radioValue, fetchBookings, tabKey]);

  const handleModalOpen = (booking) => {
    bk.current = booking;
    setShow(true);
  };
  const handleModalClose = () => {
    bk.current = null;
    setShow(false);
  };

  const handleKey = (e) => {
    setTab(e);
    tabChanged.current = true;
  };

  useEffect(() => {
    if (tabChanged.current) {
      fetchBookings(tabKey);
      tabChanged.current = false;
    }
  }, [tabKey, fetchBookings]);

  return (
    <Container>
      <Tabs
        className="bookings-filter-tab mb-4"
        color="#d66f3f"
        activeKey={tabKey}
        onSelect={(e) => handleKey(e)}
      >
        <Tab eventKey="mine" title="My Bookings"></Tab>
        {user.isAdmin ? (
          <Tab eventKey="general" title="All requests"></Tab>
        ) : null}
      </Tabs>

      <Row>
        <ButtonGroup>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="checkbox"
              variant="outline-success"
              name="radio"
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => setRValue(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Row>
      <Row>
        {!data ? (
          <Card className="text-center">
            <Card.Title>No Bookings found Yet!</Card.Title>
          </Card>
        ) : tabKey === "mine" ? (
          <NewTableData
            headers={[
              "Booking date",
              "Room",
              "Price",
              "Type",
              "Cancellation Request",
            ]}
            columns={[
              "booking_date2",
              "room_id",
              "price_at_booking",
              "booking_type",
              "cancelStatus",
            ]}
            values={data}
            whenClicked={handleModalOpen}
            customColumn={[
              {
                colDesc: "cancelStatus",
                customColumnComp2: customRequestColumn,
              },
            ]}
          />
        ) : (
          <NewTableData
            headers={[
              "User",
              "Booking date",
              "Room",
              "Price",
              "Type",
              "Cancellation Request",
            ]}
            columns={[
              "fullname2",
              "booking_date2",
              "room_id",
              "price_at_booking",
              "booking_type",
              "cancelStatus",
            ]}
            values={data}
            whenClicked={handleModalOpen}
            customColumn={[
              {
                colDesc: "cancelStatus",
                customColumnComp2: customRequestColumn,
              },
            ]}
          />
        )}
      </Row>
      {show && (
        <Modal show={show} onHide={handleModalClose} centered>
          <Modal.Title>Booking data</Modal.Title>
          <Modal.Body>
            {`${format(
              parseISO(bk.current.booking_date),
              "iiii '-' do 'of' MMMM', ' yyyy"
            )} 
                    at ${parseISO(bk.current.booking_date).getUTCHours()}:00`}
            <br />
            Booking status:
            <br />
            {bk.current._isCancelled ? (
              <div class="p-3 mb-2 bg-danger text-white">Cancelled</div>
            ) : null}
            {!bk.current._isCancelled && bk.current.cancel_request ? (
              <div class="p-3 mb-2 bg-warning text-white">
                Request pending approval
              </div>
            ) : null}
            {!bk.current._isCancelled && !bk.current.cancel_request ? (
              <div class="p-3 mb-2 bg-success text-white">Booking ok</div>
            ) : null}
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default BookingList;
