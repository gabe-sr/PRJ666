import React from 'react'
import { Link } from 'react-router-dom';
import './Sidebar.css'
import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';
import * as BsIcons from 'react-icons/bs';
import * as IoIcons from 'react-icons/io5';
import * as FiIcons from 'react-icons/fi';
import * as GoIcons from 'react-icons/go';

function Sidebar(props) {
    return (
        <>
            <ul className='nav-menu-items'>
                <li className='nav-text'>
                    <Link to={`/user/${props.id}`}>
                        <AiIcons.AiFillHome/>   
                        <span>Profile</span>
                    </Link>
                </li>
                <li className='nav-text'>
                    <Link to="/">
                        <BsIcons.BsCalendar3/>   
                        <span>Bookings</span>
                    </Link>
                </li>
                <li className='nav-text'>
                    <Link to="/">
                        <IoIcons.IoDocumentTextOutline/>   
                        <span>Reports</span>
                    </Link>
                </li>
                <li className='nav-text'>
                    <Link to="/">
                        <MdIcons.MdOutlinePassword/>   
                        <span>Security</span>
                    </Link>
                </li>
                {props.isAdmin &&
                    <li className='nav-text'>
                        <Link to={`/${props.id}/authorization`}>
                            <FiIcons.FiCheckSquare/>   
                            <span>Validate Users</span>
                        </Link>
                    </li>
                }
                 <li className='nav-text'>
                    <Link to="/">
                        <GoIcons.GoSignOut/>   
                        <span>Sign Out</span>
                    </Link>
                </li>
            </ul>
        </>
    )
}

export default Sidebar
