import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/body.css';
import SongCard from './SongCard';

const Body = ({ songs, setCurrentSong }) => {
    const [activeSection, setActiveSection] = useState('For You');
    const [displayedSongs, setDisplayedSongs] = useState(songs);

    useEffect(() => {
        if (activeSection === 'For You') {
            setDisplayedSongs(songs);
        } else if (activeSection === 'Top Tracks') {
            const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
            setDisplayedSongs(shuffledSongs);
        }
    }, [activeSection, songs]);


    return (
        <div className="body_container">
            <div className="your_tracks">
                <h2
                    className={activeSection === 'For You' ? 'active' : 'inactive'}
                    onClick={() => setActiveSection('For You')}
                >
                    For You
                </h2>
                <h2
                    className={activeSection === 'Top Tracks' ? 'active' : 'inactive'}
                    onClick={() => setActiveSection('Top Tracks')}
                >
                    Top Tracks
                </h2>
            </div>
            <Navbar />

            {displayedSongs.map((song) => (
                <SongCard
                    key={song.id}
                    cover={`https://cms.samespace.com/assets/${song.cover}`}
                    songName={song.name}
                    songArtist={song.artist}
                    totalTime={song.duration}
                    onClick={() => setCurrentSong(song)} // Set the current song on click
                />
            ))}
        </div>
    );
};

export default Body;
