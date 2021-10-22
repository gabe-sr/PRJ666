import React, {useState, useRef, useEffect, useCallback} from 'react'
import { addDays, startOfDay } from 'date-fns'
import DayPicker from 'react-day-picker'
import "../../../node_modules/react-day-picker/lib/style.css"
import axios from 'axios'
import {Container, Row, Col, Button } from 'react-bootstrap'
import TimePicker from './TimePicker'

const Scheduler = () => {
    const [ day, setDay ] = useState(startOfDay(new Date()))
    const [bookings, setBookings] = useState([])
    const currDay = useRef(startOfDay(new Date()))
    const maxDay = useRef(addDays(startOfDay(new Date()),7))
    const selected = useRef(day)
    // const render = useRef(0)

    const timeSelected = ()=>{

    }

    const handleDayClick = (date, modifiers={})=>{
        if(modifiers.disabled){
            return;
        }
        setDay(date)
    }

    // function to fetch bookings for a certain date it uses usecallback so it doesnt get
    // reconstructed after every render, and to assure that if the function is passed to 
    // children components it will have referential integrity
    const fetchBookings = useCallback(async (day)=>{
        try {
            // console.log(day)
            const res = await axios.get("http://localhost:8080/book",
                                    {params:{
                                        begin: day.toDateString(),
                                        end: addDays(day,1).toDateString()
                                    }})
            const fetchedbkns = await res.data
            setBookings(fetchedbkns)
            // console.log("this is render no: " + render.current)
            // console.log({function: "fetch", objects: bookings})
            // console.log(bookings)
        } catch (err) {
            console.log(err)
        }
        
    }, [])

    // on day change trigger fetch function to get bookings for the day
    // (useState garantees that )
    useEffect(()=>{
        // console.log("useEffect on day change")
        // console.log("this is render no: " + render.current)
        fetchBookings(day)
    }, [day,fetchBookings])

    // render.current = render.current+1
    // console.log(render.current)
    return (
        <Container>
            <Row>
                <Col>
                    {!currDay ? null : 
                    <DayPicker 
                    canChangeMonth={false}
                    selectedDays={day}
                    onDayClick={handleDayClick}
                    disabledDays={{
                        before: currDay.current,
                        after: maxDay.current
                    }}
                    />  
                    }
                    {/* {bookings.map((b)=>{return b.booking_date})} */}
                </Col>
                <Col>
                    <TimePicker bookings={bookings}/>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col className="d-grid gap-2">
                    <Button variant="primary" size="lg">Confirm</Button>
                </Col>
                <Col className="d-grid gap-2">
                    <Button variant="secondary" size="lg">Cancel</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Scheduler
