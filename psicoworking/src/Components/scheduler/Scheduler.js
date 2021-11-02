import React, {useState, useRef, useEffect, useCallback} from 'react'
import { addDays, addMonths, differenceInDays, startOfMonth, startOfDay, setHours } from 'date-fns'
import DayPicker from 'react-day-picker'
import "../../../node_modules/react-day-picker/lib/style.css"
import axios from 'axios'
import {Container, Row, Col, Button } from 'react-bootstrap'
import TimePicker from './TimePicker'

const Scheduler = ({userid,roomid}) => {
    const [ day, setDay ] = useState(startOfDay(new Date()))
    const [bookings, setBookings] = useState([])
    const [ selected, setSelec ] = useState(null)
    const currDay = useRef(startOfDay(new Date()))
    const maxDay = useRef(addDays(startOfDay(new Date()),7))
    const price = useRef(0)
    // const render = useRef(0)
    console.log(userid)
    console.log(roomid)
    const timeSelected = (time)=>{
        setSelec(setHours(day,time))
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
                                        begin: startOfDay(day).toDateString(), // remove startOfDay (unecessary extra processing, already start of day)
                                        end: addDays(startOfDay(day),1).toDateString() // remove startOfDay (unecessary extra processing, already start of day)
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

    const fetchRoomPrice = useCallback(async()=>{
        try {
            const res = await axios.get(`http://localhost:8080/rooms/${roomid}`)
            const fetchedroom = await res.data

            price.current = fetchedroom.price
        } catch (err) {
            console.log(err)
        }
    }, [roomid])

    useEffect(() => {
        fetchRoomPrice()
    }, [fetchRoomPrice])

    // on day change trigger fetch function to get bookings for the day
    // (useState garantees that )
    useEffect(()=>{
        // console.log("useEffect on day change")
        // console.log("this is render no: " + render.current)
        fetchBookings(day)
        setSelec(null)
    }, [day,fetchBookings])

    const onConfirm = useCallback(async () =>{
        console.log("Confirmed @ "+ selected)
        try {
            const res = await axios.post("http://localhost:8080/book/test/",
                                    {
                                        booking_date: selected,
                                        user_id: userid,
                                        room_id: roomid,
                                        price_at_booking: price.current
                                    })
            fetchBookings(day)
            alert(res.data.message)
        } catch (err) {
            console.log(err)
        }
    },[roomid, selected, userid])

    const onCancel = () =>{
        console.log("Cancelled"+ day)
    }
    console.log(differenceInDays(startOfMonth(addMonths(day,1)),day))
    // render.current = render.current+1
    // console.log(render.current)
    return (
        <Container>
            <Row>
                <Col>
                    {differenceInDays(startOfMonth(maxDay.current),currDay.current) >7 ? 
                    <DayPicker 
                    canChangeMonth={false}
                    selectedDays={day}
                    onDayClick={handleDayClick}
                    disabledDays={{
                        before: currDay.current,
                        after: maxDay.current
                    }}
                    />  
                    :
                    <DayPicker 
                    selectedDays={day}
                    onDayClick={handleDayClick}
                    disabledDays={{
                        before: currDay.current,
                        after: maxDay.current
                    }}
                    fromMonth={currDay.current}
                    toMonth={maxDay.current}
                    fixedWeeks
                    />
                    }
                    
                    {day.toDateString()}
                </Col>
                <Col className="mt-4">
                    {price.current}
                    <TimePicker bookings={bookings} timeSelected={timeSelected}/>
                </Col>
            </Row>

            {!selected ? 
            <Row className="mt-4">
                <Col className="d-grid gap-2">
                    <Button variant="primary" size="lg" disabled>Confirm</Button>
                </Col>
                <Col className="d-grid gap-2">
                    <Button variant="secondary" size="lg" disabled>Cancel</Button>
                </Col>
            </Row>
            :
            <Row className="mt-4">
                <Col className="d-grid gap-2">
                    <Button variant="primary" size="lg" onClick={onConfirm}>Confirm</Button>
                </Col>
                <Col className="d-grid gap-2">
                    <Button variant="secondary" size="lg" onClick={onCancel}>Cancel</Button>
                </Col>
            </Row>
            }
        </Container>
    )
}

export default Scheduler
