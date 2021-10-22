import React from 'react'
import { Container, ToggleButton } from 'react-bootstrap'
import { ACTIONS } from './TimePicker'

const TimeSlot = ({timeslot, dispatch}) => {
    console.log(timeslot)
    return (
        <Container>
            <ToggleButton   id={['btn-',timeslot.id].join('')} 
                            disabled={timeslot.disabled} 
                            variant={timeslot.variant} 
                            active={timeslot.active} 
                            onChange={()=>{
                                dispatch({ type: ACTIONS.TOGGLE, payload:{ id:timeslot.id } })
                            }}
                            size="lg"
                            >
                {[timeslot.id, ':00'].join('')}
            </ToggleButton>
        </Container>
    )
}

export default TimeSlot


