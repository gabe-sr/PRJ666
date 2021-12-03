import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  addDays,
  differenceInDays,
  startOfMonth,
  startOfDay,
  setHours,
  parseISO,
  subMinutes
} from "date-fns";
import DayPicker from "react-day-picker";
import "../../../node_modules/react-day-picker/lib/style.css";
import axios from "axios";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import TimePicker from "./TimePicker";

const Maintenance = ({ userid, roomid }) => {
  const [day, setDay] = useState(setHours(startOfDay(new Date()),2));
  const [bookings, setBookings] = useState([]);
  const [selected, setSelec] = useState([]);
  const [price, setPrice] = useState(0);
  const [show, setshow] = useState(false);
  const [data, setData] = useState({});
  const currDay = useRef(startOfDay(new Date()));
  const maxDay = useRef(addDays(startOfDay(new Date()), 7));
  const roomName = useRef();

  const timeSelected = (time) => {
    /* correct date for timezone. Data should be persisted to db only in UTC time, due to date-fns ver2.x not accepting operations with dates from strings
        it is parsed, using parseISO, it is adjusted to local browser/system time. When the time is selected since we are using raw numeric values for the
        time, it needs to be readjusted/corrected to correctly represent the actual timeslot selected. All revolves around time in the coworking location.
        " SELECTED IS ALWAYS CORRECTED FOR UTC TIME, OR NULL "*/
    const dateWtime = setHours(day,time);
    const correctedDate = subMinutes(dateWtime, day.getTimezoneOffset());
    setSelec(prevSelec => {
        const newSelec = prevSelec.filter(d => d.getUTCHours() !== correctedDate.getUTCHours());
        return newSelec.length < prevSelec.length ? newSelec : [...prevSelec, correctedDate ];
    })
  };

  const handleDayClick = (date, modifiers = {}) => {
    if (modifiers.disabled) {
      return;
    }
    setDay(setHours(date, 2));
  };

  /* function to fetch bookings for a certain date it uses usecallback so it doesnt get
      reconstructed after every render, and to assure that if the function is passed to
      children components it will have referential integrity*/
  const fetchBookings = useCallback(
    async (day) => {
      try {
        const res = await axios.get("/book", {
          params: {
            type: 'general',
            begin: day.toDateString(), 
            end: addDays(day, 1).toDateString(), 
            roomid: roomid
          },
        });
        const fetchedbkns = await res.data;
        
        /* sanitize data (only valid timeslots are set to bookings)
            if there are invalid bookings in db this removes it for 
            display purposes (implement DELETE method to clean DB)*/
        const newB = fetchedbkns.filter((b)=>{
          return ((parseISO(b.booking_date).getUTCHours()) >= 8 && 
                  (parseISO(b.booking_date).getUTCHours()) <= 19 &&
                  (parseISO(b.booking_date).getUTCHours()) !== 12)
        })
        // console.log("hello");
        setBookings(newB);
        console.log(day);
        console.log(day.getDate())
      } catch (err) {
        alert(err.message);
        console.log(err);
      }
    },
    [roomid]
  );

  /* The price for the room the user is curently booking a room for should be 
      easily accessible to user */
  useEffect(() => {
    const fetchRoomPrice = async () => {
      try {
        const res = await axios.get(`/rooms/${roomid}`);
        const fetchedroom = await res.data;
        setPrice(fetchedroom.price);
        roomName.current = fetchedroom.name;
      } catch (err) {
        console.log(err);
      }
    };

    fetchRoomPrice();
  }, [roomid]);

  /* on day change trigger fetch function to get bookings for the day
      (useEffect garantees that )*/
  useEffect(() => {
    fetchBookings(day);
    setSelec([]);
  }, [day, fetchBookings]);

  /* When user clicks the confirm button the data should be sent to database
      if the data is persisted successfully or not the user should be notified, 
      one way or the other. Insightful information should be displayed to help
      user inform helpdesk of the issue*/
  const onConfirm = useCallback(async () => {
    try {
      const req = await axios.post("/book/maintenance", {
        booking_dates: selected,
        user_id: userid,
        room_id: roomid,
        price_at_booking: price,
        booking_type: "maintenance",
      });
    //   console.log(req)
      fetchBookings(day);
      setSelec([]);
      setData(req.data);
      setshow(true);
    } catch (err) {
      setData(err.data);
      setshow(true);
    }
  }, [day, fetchBookings, price, roomid, selected, userid]);

  const handleClose = ()=> setshow(false);

  /* When user clicks cancel, the current selection should be nullified and 
      the timeslots cleared*/
  const onCancel = useCallback(() => {
    setSelec([]);
    fetchBookings(day);
  }, [day, fetchBookings]);

  return (
    <Container>
      <Row>
        <Col>
        <Row>
          {differenceInDays(startOfMonth(maxDay.current), currDay.current) < 0 ? 
          (
            <DayPicker
              canChangeMonth={false}
              selectedDays={day}
              onDayClick={handleDayClick}
              disabledDays={{
                before: currDay.current,
                after: maxDay.current,
              }}
            />
          ) : (
            <DayPicker
              selectedDays={day}
              onDayClick={handleDayClick}
              disabledDays={{
                before: currDay.current,
                after: maxDay.current,
              }}
              fromMonth={currDay.current}
              toMonth={maxDay.current}
              fixedWeeks
            />
          )}
        </Row>
        <Row className="justify-content-md-center">
                        <span>Room Price: ${price}</span><br/>
        </Row>
        <Row className="justify-content-md-center">
        {selected.length}
        </Row>
        {selected.length > 0 ? 
            selected.map((s, idx) =>{
                return(
                    <Row key={idx}className="justify-content-md-center">
                        {/* {s.toString()} */}
                        <p className="font-weight-bold ">{idx !== 0 ? null : s.toDateString()}</p>
                        <p className="font-weight-bold ">{!selected ? null : `at ${s.getUTCHours()}:00`}</p>
                    </Row>
                )
            }
            ):(
                <Row className="justify-content-md-center">No booking selected</Row>
            )
        }
        </Col>
        <Col className="mt-4 justify-content-md-center">
          <Row className="mb-4"><span className="font-weight-bold">Choose available timeslot below</span></Row>
          <Row><TimePicker bookings={bookings} timeSelected={timeSelected} maintenance={true} day={day} /></Row>
          
        </Col>
      </Row>

      {selected.length === 0 ? (
        <Row className="mt-4">
          <Col className="d-grid gap-2">
            <Button variant="primary" size="lg" disabled>
              Confirm
            </Button>
          </Col>
          <Col className="d-grid gap-2">
            <Button variant="secondary" size="lg" disabled>
              Cancel
            </Button>
          </Col>
        </Row>
      ) : (
        <Row className="mt-4">
          <Col className="d-grid gap-2">
            <Button variant="primary" size="lg" onClick={onConfirm}>
              Confirm
            </Button>
          </Col>
          <Col className="d-grid gap-2">
            <Button variant="secondary" size="lg" onClick={onCancel}>
              Cancel
            </Button>
          </Col>
        </Row>
      )}
      <Modal 
        show={show} 
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header>
        <strong>{data.title}</strong><br/>
        </Modal.Header>
        <Modal.Body>
        {data === undefined ?
            <p>`Application Error, please contact admin. Error: server response undefined`</p>
            :
            (data.error ? 
              <div>
                <strong>{data.message}, please inform the administrator.</strong>
                <div className="p-3 mb-2 bg-danger text-white">Booking Error</div> 
              </div>
              :
              <div>
                <p>{roomName.current} was successfully reserved at {data.message}</p>
                <div className="p-3 mb-2 bg-success text-white">Booking ok</div>
              </div>)
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>Dismiss</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Maintenance;
