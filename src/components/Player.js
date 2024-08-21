import React, { useEffect, useState, useRef } from 'react';
import '../styles/player.css';
import ColorThief from 'colorthief';
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";
import { IoPlayBack, IoPlayForward } from "react-icons/io5";
import { IoIosVolumeMute } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import cover from '../assets/cover.png';

const Player = ({ currentSong, playlist, currentSongIndex, setCurrentSongIndex, setCurrentSong }) => {
    const [backgroundStyle, setBackgroundStyle] = useState({});
    const [volume, setVolume] = useState(50); // Volume state (0-100)
    const [showVolumeBar, setShowVolumeBar] = useState(false); // Toggle volume bar visibility
    const [isPlaying, setIsPlaying] = useState(false); // Track playback state
    const audioRef = useRef(null); // Reference to the audio element

    useEffect(() => {
        if (currentSong) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = `https://cms.samespace.com/assets/${currentSong.cover}` || cover;
            img.onload = () => {
                const colorThief = new ColorThief();
                const dominantColor = colorThief.getColor(img);
                const gradientBackground = `linear-gradient(135deg, rgb(${dominantColor.join(',')}), #000)`;

                setBackgroundStyle({
                    background: gradientBackground,
                });

                // Apply the background to the entire body
                document.body.style.background = gradientBackground;
            };
        }
    }, [currentSong]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = currentSong.url;
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentSong, isPlaying]);



    // Update the progress bar as the song plays
    // useEffect(() => {
    //     const updateProgress = () => {
    //         if (audioRef.current) {
    //             setCurrentTime(audioRef.current.currentTime);
    //             setProgress((audioRef.current.currentTime / duration) * 100);
    //         }
    //     };

    //     const interval = setInterval(updateProgress, 1000); // Update progress every second
    //     return () => clearInterval(interval); // Clean up interval on component unmount
    // }, [duration, isPlaying]);

    // const handleProgressClick = (event) => {
    //     if (audioRef.current && progressBarRef.current) {
    //         const rect = progressBarRef.current.getBoundingClientRect();
    //         const offsetX = event.clientX - rect.left;
    //         const newProgress = (offsetX / rect.width) * 100;
    //         setProgress(newProgress);
    //         audioRef.current.currentTime = (newProgress / 100) * duration;
    //     }
    // };

    const handleVolumeChange = (event) => {
        setVolume(event.target.value);
        if (audioRef.current) {
            audioRef.current.volume = event.target.value / 100;
        }
    };

    const handleMouseUp = () => {
        setShowVolumeBar(false);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const toggleVolumeBar = () => {
        setShowVolumeBar(!showVolumeBar);
        if (!showVolumeBar) {
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mouseup', handleMouseUp);
        }
    };

    const togglePlayback = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((error) => {
                console.error('Playback error:', error);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const playNextSong = () => {
        const nextIndex = (currentSongIndex + 1) % playlist.length;
        setCurrentSongIndex(nextIndex);
        setCurrentSong(playlist[nextIndex]);
    };

    const playPreviousSong = () => {
        const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        setCurrentSongIndex(prevIndex);
        setCurrentSong(playlist[prevIndex]);
    };

    if (!currentSong) return null;

    return (
        <div className='player_container' >
            <div className="song_info">
                <h2 className='song_Name'>{currentSong.name}</h2>
                <h4 className='artistName'>{currentSong.artist}</h4>
            </div>
            <img className='cover_Image' src={`https://cms.samespace.com/assets/${currentSong.cover}`} alt="cover" />
            <div className="music_bar">
                <div className="progress_bar"></div>
            </div>
            <div className="music_control">
                <div className="dots_bg">
                    <BsThreeDots size={18} />
                </div>
                <div className="player_controls">
                    <IoPlayBack onClick={playPreviousSong} />
                    {isPlaying ? (
                        <FaPause onClick={togglePlayback} />
                    ) : (
                        <FaPlay onClick={togglePlayback} />
                    )}
                    <IoPlayForward onClick={playNextSong} />
                </div>
                <div className="volume_control">
                    {!showVolumeBar && (<div className="dots_bg" onClick={toggleVolumeBar}>
                        <FaVolumeUp size={18} />
                    </div>)}

                    {showVolumeBar && (
                        <div className="volume_bar">
                            <div className="dots_bg">
                                <IoIosVolumeMute size={18} />
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="volume_slider"
                            />
                            <div className="dots_bg">
                                <FaVolumeUp size={18} />
                            </div>
                        </div>
                    )}
                </div>
                {/* Audio Element */}
                <audio ref={audioRef} />
            </div>
        </div>
    );
};

export default Player;
