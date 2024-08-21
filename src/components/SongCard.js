import React from 'react';
import '../styles/songcard.css';

const SongCard = ({ cover, songName, songArtist, totalTime, onClick }) => {
    return (
        <div className="song_container" onClick={onClick}>
            <img className="coverImage" src={cover} alt="cover" />
            <div className="song_details">
                <h4 className='songName'>{songName}</h4>
                <p className='artist'>{songArtist}</p>
            </div>
            <p className='time'>{totalTime}</p>
        </div>
    );
}

export default SongCard;
