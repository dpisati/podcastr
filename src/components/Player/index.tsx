
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import { converDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    
    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        toggleShuffle,
        isShuffling,
        clearPlayerstate
    } = usePlayer();

    useEffect(() => {
        if(!audioRef.current) {
            return;
        }

        if(isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }

    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if(hasNext) {
            playNext();
        } else {
            clearPlayerstate();
        }
    }


    const episode = episodeList[currentEpisodeIndex];

    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Playing now" />
                <strong>Playing now</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Select an episode to listen.</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{converDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider 
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{backgroundColor: '#04d361'}}
                                railStyle={{ backgroundColor: '#9f75ff'}}
                                handleStyle={{backgroundColor: '#04d361', borderWidth: 4}}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{converDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio 
                        src={episode.url} 
                        ref={audioRef}
                        loop={isLooping}
                        onPlay={() => setPlayingState(true)} 
                        onPause={() => setPlayingState(false)} 
                        onLoadedData={setupProgressListener}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                    />
                )}

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!episode || episodeList.length === 1} 
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Shuffle" />
                    </button>
                    <button 
                        type="button" 
                        disabled={!episode || !hasPrevious} 
                        onClick={playPrevious}
                    >
                        <img src="/play-previous.svg" alt="Play Previous" />
                    </button>

                    <button 
                        type="button" 
                        disabled={!episode} 
                        className={styles.playButton}
                        onClick={togglePlay}
                    >
                        {isPlaying ? (
                            <img src="/pause.svg" alt="Pause" />
                            ) : (
                            <img src="/play.svg" alt="Play" />
                        )}

                    </button>

                    <button 
                        type="button" 
                        disabled={!episode || !hasNext}  
                        onClick={playNext}
                    >
                        <img src="/play-next.svg" alt="Play Next" />
                    </button>
                    <button 
                        type="button" 
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repeat" />
                    </button>
                </div>
            </footer>
        </div>
    );
}