import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import WithLoadingSpinner from "../../HOC/loading-spinner/WithLoadingSpinner";
import "./Sidebar.css";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
import * as IoIcons from "react-icons/io5";
import * as FiIcons from "react-icons/fi";
import * as GoIcons from "react-icons/go";

function Sidebar(props) {
  // for redirection after logout
  const history = useHistory();

  // logout handler to destroy session in server
  const handleLogout = async () => {
    props.setLoadingSpinner(true, "Logging out...");
    try {
      const logout = await axios.get("/authentication/logout");
      if (logout.status === 200) {
        history.push("/");
        history.go("/");
        console.log("LOGOUT");
      }
    } catch (err) {
      console.log(err);
    } finally {
      props.setLoadingSpinner(false);
    }
  };

  return (
    <>
      <ul className="nav-menu-items">
        <li className="nav-text">
          <Link to={`/dashboard`}>
            <AiIcons.AiFillHome />
            <span>Home</span>
          </Link>
        </li>
        <li className="nav-text">
          <Link to={`/dashboard/user/${props.id}`}>
            <AiIcons.AiOutlineUser />
            <span>Profile</span>
          </Link>
        </li>
        <li className="nav-text">
          <Link to="/dashboard/scheduler">
            <BsIcons.BsCalendar3 />
            <span>Bookings</span>
          </Link>
        </li>
        <li className="nav-text">
          <Link to="/dashboard">
            <IoIcons.IoDocumentTextOutline />
            <span>Reports</span>
          </Link>
        </li>
        <li className="nav-text">
          <Link to={`/dashboard/user/${props.id}/changePassword`}>
            <MdIcons.MdOutlinePassword />
            <span>Security</span>
          </Link>
        </li>
        {props.isAdmin && (
          <li className="nav-text">
            <Link to={`/dashboard/authorization`}>
              <FiIcons.FiCheckSquare />
              <span>Authorize</span>
            </Link>
          </li>
        )}
        <li className="nav-text">
          <Link to="#" onClick={handleLogout}>
            <GoIcons.GoSignOut />
            <span>Sign Out</span>
          </Link>
        </li>
      </ul>
    </>
  );
}

export default WithLoadingSpinner(Sidebar);
