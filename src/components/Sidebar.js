import React from 'react';
import '../styles/sidebar.css'
import spot from '../assets/spot_logo.png';
import dp from '../assets/profile_img.png';

const Sidebar = () => {
    return (
        <div className="sidebar_container">
            <div className="logo">
                <img src={spot} alt="Spotify Logo" />
            </div>
            <img className='profile_icon' src={dp} alt="image_icon" />
        </div>
    )
}

export default Sidebar