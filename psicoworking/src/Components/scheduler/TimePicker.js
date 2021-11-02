import React, { useReducer, useEffect } from 'react'
import { Container, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'

// available hours
const HOURS = [ 8,9,10,11,13,14,15,16,17,18,19]

// These are the actions that can be executed upon a timeslot
export const ACTIONS = {
    TOGGLE: 'toggle',
    SELECT: 'select',
    OCCUPY: 'occupy',
    SELF: 'self'
}

// this reducer function acts upon the timeslot array
const reducer = (timeslots, action)=>{
    switch(action.type){
        case ACTIONS.TOGGLE:
            //toggle radio button if selected, only one at a time
            console.log('toggle executed')
            return timeslots.map( ts =>{
                if(ts.id === action.payload.id){
                    return {...ts, active: !ts.active}
                }
                else if(ts.disabled === false){
                    return {...ts, active: false}
                }
                return ts;
            })
        case ACTIONS.OCCUPY:
            //make timeslots received from scheduler active and disabled
            let idx =0;
            console.log('occupy executed')
            return timeslots.map( ts =>{
                if( ts.id == action.payload.id[idx]){
                    // console.log(ts)
                    idx++
                    return {...ts, disabled: true, active: true, variant:"secondary"}
                }
                else {
                    return {...ts, disabled: false, active: false, variant:"outline-primary"}
                }
                // console.log(ts)
            })

        default:
            console.log("default reduce")
            return timeslots;
    }
}

// this function uses the HOURS array to map an initialize an array of objects (timeslots)
const createTs = ()=>{
    let ts = []
    HOURS.forEach((t,idx) => {
        // if(idx%2 === 0){ ts.push({ id:t, disabled:false, variant:"outline-info", active:false, value:t }) }
        // else{ ts.push({ id:t, disabled:false, variant:"outline-primary", active:false, value:t }) }
        ts.push({ id:t, disabled:"false", variant:"outline-primary", active:"false" })
    });
    return ts
}
const TimePicker = ({bookings, timeSelected}) => {
    const [timeslots, dispatch] = useReducer(reducer, createTs())
    useEffect(() => {
        // console.log(timeslots)
    }, [])
    useEffect(() => {
        const b = bookings.map(b=>{return b.booking_date.substring(11,13)})
        dispatch({type: ACTIONS.OCCUPY, payload: { id: b}})
        // console.log(timeslots)
        return () => {
            
        }
    }, [bookings])

    return (
        <Container>
            <Row>{bookings.map((b)=>{return b.booking_date.substring(11,13)})} </Row>
            <ToggleButtonGroup type={'radio'} name={'hourselect'} vertical>
                {timeslots.map(timeslot=>{    
                    return  <ToggleButton   key={timeslot.id}
                                            id={`btn-${timeslot.id}`} 
                                            disabled={timeslot.disabled} 
                                            variant={timeslot.variant} 
                                            active={timeslot.active} 
                                            onChange={()=>{
                                                dispatch({ type: ACTIONS.TOGGLE, payload:{ id:timeslot.id } })
                                                timeSelected(timeslot.id)
                                            }}
                                            size="lg"
                            >
                                {`${timeslot.id}:00`}
                            </ToggleButton>
                    })}
            </ToggleButtonGroup>

            {/* <div className="btn-group-vertical">
                {timeslots.map(timeslot=>{
                    return <div>
                        {!timeslot.disabled ?  
                            <input  type="radio" className="btn-check" 
                                    name={`radio-${timeslot.id}`} 
                                    id={`btn-${timeslot.id}`} 
                                    autocomplete="off"
                                    />
                            :
                            <input  type="radio" className="btn-check" 
                                    name={`radio-${timeslot.id}`} 
                                    id={`btn-${timeslot.id}`} 
                                    autocomplete="off"
                                    disabled
                                    />
                        }
                            <lable  className={`btn ${timeslot.variant}`}
                                    for={`btn-${timeslot.id}`}>
                                        {`${timeslot.id}`}
                            </lable>
                            </div>
                })}

            </div> */}
            {/* with timeslots component(logic may become more convoluted)
            <Col>
                {timeslots.map(timeslot=>{
                    // console.log(`timeslot ${timeslot.id} is disabled= ${timeslot.disabled}`)

                    return <TimeSlot key={timeslot.id} timeslot={timeslot} dispatch={dispatch}/>
                    
                    
                })}
            </Col> */}
            
            {/* <ToggleButtonGroup type={'radio'} name={'hourselect'} vertical>
                <ToggleButton   id={['btn-',timeslot.id].join('')} 
                                            // disabled={timeslot.disabled} 
                                            variant={timeslot.variant} 
                                            active={timeslot.active} 
                                            onChange={()=>{
                                                dispatch({ type: ACTIONS.TOGGLE, payload:{ id:timeslot.id } })
                                            }}
                            >
                                {[timeslot.id, ':00'].join('')}
                            </ToggleButton>
                </ToggleButtonGroup> */}
        {/* {JSON.stringify(bookings)} */}

        </Container>
    )
}

export default TimePicker
