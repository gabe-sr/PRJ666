// import { useReducer, useEffect} from "react";
// import { useHistory } from "react-router";
// import axios from "axios";

/* This hook will check which bookings are already persisted in the DB
    it accepts as the payload either: 
        an empty object
        a beginning date and a ending date, as the range of search;
        a booking object
        a id of a booking
        an id of a reservation/invoice(?)
        the ids of a booking and a reservation and the update fields
    dispatch functions should cover:
        FETCHBOOKINGS (API - /book/GET all)
        FETCHBKNGSRANGE (API - /book/GET query)
        PERSISTBOOKING (API - /book/POST)
        REQUESTCANCEL (API - /book/PATCH id update)
        ACCEPTCACNCEL (API - /book/PATCH id update - /reservation/PATCH id update)
        FETCHRESERVATION (API - /reservation/GET id) ~front end can than extract informations

         */