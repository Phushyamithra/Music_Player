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
    const progressRef = useRef(null); // Reference to the progress bar element
    const progressBarRef = useRef(null); // Reference to the entire progress bar

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

    useEffect(() => {
        const updateProgress = () => {
            if (audioRef.current && progressRef.current) {
                const currentTime = audioRef.current.currentTime;
                const duration = audioRef.current.duration;
                const progressPercent = (currentTime / duration) * 100;
                progressRef.current.style.width = `${progressPercent}%`;
            }
        };

        const interval = setInterval(updateProgress, 1000); // Update progress every second
        return () => clearInterval(interval); // Clean up interval on component unmount
    }, [isPlaying]);

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
        setIsPlaying(false);
        setTimeout(() => {
            const nextIndex = (currentSongIndex + 1) % playlist.length;
            setCurrentSongIndex(nextIndex);
            setCurrentSong(playlist[nextIndex]);
            setIsPlaying(true);
        }, 300); // 300ms delay to allow fade-out
    };

    const playPreviousSong = () => {
        setIsPlaying(false);
        setTimeout(() => {
            const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
            setCurrentSongIndex(prevIndex);
            setCurrentSong(playlist[prevIndex]);
            setIsPlaying(true);
        }, 300); // 300ms delay to allow fade-out
    };

    const handleProgressClick = (e) => {
        if (audioRef.current && progressBarRef.current) {
            const rect = progressBarRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickRatio = clickX / width;
            const newTime = clickRatio * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
        }
    };

    if (!currentSong) return null;

    return (
        <div className='player_container'>
            <div className="song_info">
                <h2 className='song_Name'>{currentSong.name}</h2>
                <h4 className='artistName'>{currentSong.artist}</h4>
            </div>
            <img className='cover_Image' src={`https://cms.samespace.com/assets/${currentSong.cover}`} alt="cover" />
            <div className="music_bar" ref={progressBarRef} onClick={handleProgressClick}>
                <div className="progress_bar">
                    <div className="progress_filled" ref={progressRef}></div>
                </div>
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
                    {!showVolumeBar && (
                        <div className="dots_bg" onClick={toggleVolumeBar}>
                            <FaVolumeUp size={18} />
                        </div>
                    )}

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
