import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Body from './Body';
import Player from './Player';
import '../styles/spotify.css';
import axios from 'axios';

const Spotify = () => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get("https://cms.samespace.com/items/songs");
                const songsData = response.data.data;

                const songsWithDuration = await Promise.all(
                    songsData.map(async (song) => {
                        const audio = new Audio(song.url);
                        return new Promise((resolve) => {
                            audio.addEventListener('loadedmetadata', () => {
                                const duration = Math.floor(audio.duration);
                                const minutes = Math.floor(duration / 60);
                                const seconds = duration % 60;
                                const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                                resolve({ ...song, duration: formattedDuration });
                            });
                        });
                    })
                );
                setSongs(songsWithDuration);
                if (songsWithDuration.length > 0) {
                    setCurrentSong(songsWithDuration[0]);
                }
                setLoading(false); // Set loading to false after fetching
            } catch (err) {
                console.error('Error fetching the songs:', err);
            }
        };

        fetchSongs();
    }, []);

    const handleSetCurrentSong = (song) => {
        const index = songs.findIndex((s) => s.id === song.id);
        setCurrentSong(song);
        setCurrentSongIndex(index);
    };

    return (
        <div className="spotify_body">
            {loading ? (
                <div className="loading_spinner"></div>
            ) : (
                <>
                    <Sidebar />
                    {/* <div className="body_contents">
                        <Body songs={songs} setCurrentSong={handleSetCurrentSong} />
                    </div> */}
                    {currentSong && (
                        <Player
                            currentSong={currentSong}
                            playlist={songs}
                            currentSongIndex={currentSongIndex}
                            setCurrentSongIndex={setCurrentSongIndex}
                            setCurrentSong={setCurrentSong}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Spotify;
