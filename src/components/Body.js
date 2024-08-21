import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/body.css';
import SongCard from './SongCard';

const Body = ({ songs, setCurrentSong }) => {
    const [activeSection, setActiveSection] = useState('For You');
    const [displayedSongs, setDisplayedSongs] = useState(songs);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        let filteredSongs = songs;

        if (activeSection === 'Top Tracks') {
            filteredSongs = [...songs].sort(() => Math.random() - 0.5);
        }

        if (searchQuery) {
            filteredSongs = filteredSongs.filter(song =>
                song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                song.artist.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setDisplayedSongs(filteredSongs);
    }, [activeSection, songs, searchQuery]);

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
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
