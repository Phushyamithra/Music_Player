import React from 'react';
import { CiSearch } from "react-icons/ci";
import '../styles/navbar.css'
const Navbar = () => {
    return (
        <div className="navbar_container">
            <div className="search_bar">
                <input type="text" placeholder='Search Song, Artist' />
                <CiSearch size={20} />
            </div>
        </div>
    )
}

export default Navbar