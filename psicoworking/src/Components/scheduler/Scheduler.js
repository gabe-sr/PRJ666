import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import "../../../node_modules/react-calendar/dist/Calendar.css"
import { Button } from "react-bootstrap"
import TimePicker from './TimePicker'
import { startOfDay, addDays } from 'date-fns'

export default function Scheduler() {
    const [date, setDate] = useState(startOfDay(new Date()))

    const [min, setMin] = useState()

    const [max, setMax] = useState()
    // (not necessary)This is to be able to 
    const onChange = (date) =>{
        setDate(date)
        // console.log(date)
    }

    // This will be used to change the time picker (make a get 
    // request for bookings on the new date)
    useEffect(()=>{
        setMax(addDays(date,7))
        setMin(date)
    },[])

    // This will be used to change the time picker (make a get 
    // request for bookings on the new date)
    useEffect(()=>{
        
    },[date])

    return (
        <>
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-6">
                    <Calendar
                        onChange={onChange}
                        value={date}
                        className="react-calendar"
                        maxDate={max}
                        minDate={min}
                        minDetail={"month"}
                    />
                </div>
                <div className="col-sm-6">
                    {/* {date.toDateString} */}
                    <TimePicker date={date}/>
                </div>
            </div>            
        </div>
        </>
    )
}
