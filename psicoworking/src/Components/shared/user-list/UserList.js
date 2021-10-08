// Use this component to render a table containing user data
// Accepts the following props:
//
// headers: an array of strings with the column titles
// columns: an array of strings with the DB entities, eg: "crp_no", "zip", "phone" etc..
//    - special condition for "fullname", which will automatically join first_name,last_name

import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Dropdown,
  DropdownButton,
  Tab,
  Tabs,
} from "react-bootstrap";
import axios from "axios";
import SpinnerLoading from "../spinner/SpinnerLoading";
import ModalMessage from "./modal-message/ModalMessage";
import "./UserList.css";

const UserList = (props) => {
  // ------------- FETCH DATA ------------- //

  // check if data was already loaded or not (for loading spinner....)
  const [isLoaded, setIsLoaded] = useState(false);

  // ------------- FETCH DATA ------------- //
  // to store all user data fetched from DB
  const [values, setValues] = useState();
  const [pendingCount, setPendingCount] = useState();

  // (3) get all user data from database
  const fetchData = async (key) => {
    setIsLoaded(false);
    try {
      const data = await axios.get("http://localhost:8080/users");
      let sortedData = data.data.sort((a, b) =>
        a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : -1
      );
      if (key === "authorized") {
        setValues(sortedData.filter((user) => user.active === true));
      } else if (key === "pending") {
        setValues(sortedData.filter((user) => user.active === false));
      } else {
        setValues(sortedData);
      }
      setIsLoaded(true);

      // count number of pending values
      let countPending = sortedData.filter(
        (user) => user.active === false
      ).length;
      setPendingCount(countPending);
    } catch (err) {
      console.log(err);
    }
  };

  // will trigger the fetchData() when loading for the first time
  useEffect(() => {
    fetchData();
  }, []);

  // ------------- TABS COMPONENT ------------- //
  // key is the name of each tab: all users, authorized, pending
  const [key, setKey] = useState("all");

  // re-fetch data each time we change to a different tab, except during initialization
  // because this will be done by the first fetchData call
  useEffect(() => {
    if (key) {
      fetchData(key);
    }
  }, [key]);

  // -------------  AUTHORIZATION/ACTIVE BUTTON  ------------- //
  // this will handle the logic for updating the active status

  // initial state for a user object.
  // changeFlag is used as a flag/toggler to track if change to userToActivate was requested
  const initialState = { user: {}, active: null, changeFlag: true };

  // this represent the state of a user object (one row from the table)
  const [userToActivate, setUserToActivate] = useState(initialState);

  // this is to store the state for showing a modal message after updating a user
  const [showModalMessage, setShowModalMessage] = useState(false);

  // this is to close the modal after clicking
  const closeModalMessage = () => {
    setShowModalMessage(false);
  };

  // this will change the userToActivate object
  // and as a consequence, it will trigger the useEffect to perform the PATCH request
  const updateActiveOnDB = (user, activeStatus) => {
    setUserToActivate({ user: user, active: activeStatus, changeFlag: false });
  };

  // when there is any change to userToActivate, this useEffect will perform the PATCH request
  // it checks if user was changed (changeFlag), then send a patch request to the DB
  // then set to true to show the modal message (eg: user <xxx> is authorized...)
  // then fetch the data again to display the updated table
  useEffect(() => {
    if (!userToActivate.changeFlag) {
      const patchUser = async () => {
        await axios.patch(
          `http://localhost:8080/users/update_authorize/${userToActivate.user._id}`,
          { active: userToActivate.active }
        );
        setShowModalMessage(true);
        await fetchData(key);
      };
      patchUser();
      setUserToActivate({ ...userToActivate, changeFlag: true });
    }
  }, [userToActivate, key]);

  // This is to handle the GREEN/RED button and DROPDOWN for the Active column
  // it returns a single <td>
  const handleActive = (user, index) => {
    return (
      <td key={index}>
        <Dropdown className="btn-active-dropdown-container">
          <DropdownButton
            className={
              user.active
                ? "btn-active-dropdown-green"
                : "btn-active-dropdown-red"
            }
            title={<i className="fas fa-circle"></i>}
            drop="end"
            size="sm"
            variant="secondary"
          >
            <Dropdown.Item onClick={() => updateActiveOnDB(user, true)}>
              Authorize
            </Dropdown.Item>
            <Dropdown.Item onClick={() => updateActiveOnDB(user, false)}>
              Deny
            </Dropdown.Item>
          </DropdownButton>
        </Dropdown>
      </td>
    );
  };

  // rendering the component...
  // (1) - Check if isLoaded=true (if not show the loading spinner),
  //       then check if showModalMessage=true (show message "user xxx was authorized....")
  // (2) - This component is a modal with the message ("user xxx authorized...")
  //       it passes as props the user in the row that was clicked (userToActivate)
  //       and also a callback to let this component know that the modal was closed
  // (3) - Uses react-bootstrap Tabs components. Key is used to track if Tab was changed
  //       with useEffect(), to fetch and filter data accordingly
  // (4) - Table from react-bootstrap.
  // (5) - Maps the props to get the column headers and names
  // (6) - If isLoaded=False, it renders the ModalSpinner component
  //

  return (
    <Container className="m-4 w-75">
      {/* (1) */}
      {isLoaded ? (
        showModalMessage ? (
          /* (2) */
          <ModalMessage
            user={userToActivate}
            closeModalMessage={closeModalMessage}
          />
        ) : (
          /* (3) */
          <>
            <Tabs
              className="users-filter-tab mb-4"
              activeKey={key}
              onSelect={(e) => setKey(e)}
            >
              <Tab eventKey="all" title="All users"></Tab>
              <Tab eventKey="authorized" title="Authorized"></Tab>
              <Tab
                eventKey="pending"
                title={
                  pendingCount > 0 ? (
                    <span>
                      Pending
                      <span
                        style={{
                          color: "red",
                          fontSize: "0.80rem",
                          verticalAlign: "super",
                        }}
                      >{` (${pendingCount})`}</span>
                    </span>
                  ) : (
                    `Pending`
                  )
                }
              ></Tab>
            </Tabs>

            {/* (4) */}
            <div>
              <Table bordered hover size="sm" responsive="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    {props.headers.map((head, index) => (
                      <th key={index}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {values.map((user, index) => (
                    <tr style={{ cursor: "pointer" }} key={user._id}>
                      <td onClick={() => alert("CLICKED!")}>{index + 1}</td>

                      {/* (5) */}
                      {props.columns.map((colName, index) => {
                        if (colName === "fullname") {
                          return (
                            <td
                              onClick={() => alert("CLICKED!")}
                              key={index}
                            >{`${user.first_name} ${user.last_name}`}</td>
                          );
                        } else if (colName === "active") {
                          return handleActive(user, index);
                        }
                        return (
                          <td onClick={() => alert("CLICKED!")} key={index}>
                            {user[colName]}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        )
      ) : (
        /* (6) */
        <SpinnerLoading />
      )}
    </Container>
  );
};

export default UserList;
