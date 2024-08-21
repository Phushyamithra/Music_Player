import React from 'react';
import { CiSearch } from "react-icons/ci";
import '../styles/navbar.css';

const Navbar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="navbar_container">
            <div className="search_bar">
                <input
                    type="text"
                    placeholder='Search Song, Artist'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
                />
                <CiSearch size={20} />
            </div>
        </div>
    );
}

export default Navbar;
