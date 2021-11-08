import React, { useReducer, useEffect } from "react";
import { Container, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

// available hours
const HOURS = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19];

// These are the actions that can be executed upon a timeslot
export const ACTIONS = {
  TOGGLE: "toggle",
  SELECT: "select",
  OCCUPY: "occupy",
  SELF: "self",
};

// this reducer function acts upon the timeslot array
const reducer = (timeslots, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE:
      //toggle radio button if selected, only one at a time
      return timeslots.map((ts) => {
        if (ts.id === action.payload.id) {
          return { ...ts, active: !ts.active };
        } else if (ts.disabled === false) {
          return { ...ts, active: false };
        }
        return ts;
      });
    case ACTIONS.OCCUPY:
      //make timeslots received from scheduler active and disabled
      let idx = 0;
      return timeslots.map((ts) => {
        if ( ts.id === parseInt(action.payload.id[idx]) ) {
          idx++;
          return { ...ts, disabled: true, active: true, variant: "secondary" };
        } else {
          return {
            ...ts,
            disabled: false,
            active: false,
            variant: "outline-primary",
          };
        }
      });

    default:
      return timeslots;
  }
};

// this function uses the HOURS array to map an initialize an array of objects (timeslots)
const createTs = () => {
  let ts = [];
  HOURS.forEach((t, idx) => {
    ts.push({
      id: t,
      disabled: "false",
      variant: "outline-primary",
      active: "false",
    });
  });
  return ts;
};
const TimePicker = ({ bookings, timeSelected }) => {
  const [timeslots, dispatch] = useReducer(reducer, createTs());
  useEffect(() => {
  }, []);
  useEffect(() => {
    const b = bookings.map((b) => {
      return b.booking_date.substring(11, 13);
    });
    dispatch({ type: ACTIONS.OCCUPY, payload: { id: b } });
    return () => {};
  }, [bookings]);

  return (
    <Container>
      <ToggleButtonGroup type={"radio"} name={"hourselect"} vertical>
        {timeslots.map((timeslot) => {
          return (
            <ToggleButton
              key={timeslot.id}
              id={`btn-${timeslot.id}`}
              disabled={timeslot.disabled}
              variant={timeslot.variant}
              active={timeslot.active}
              onChange={() => {
                dispatch({
                  type: ACTIONS.TOGGLE,
                  payload: { id: timeslot.id },
                });
                timeSelected(timeslot.id);
              }}
              size="lg"
            >
              {`${timeslot.id}:00`}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Container>
  );
};

export default TimePicker;
