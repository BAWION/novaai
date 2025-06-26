import React, { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Button } from "@/components/ui/button";

interface AdaptiveVideoPlayerProps {
  src: string;
  title: string;
  allowDownload?: boolean;
  allowPictureInPicture?: boolean;
  onTimeUpdate?: (currentTime: number) => void;
  initialTime?: number;
  width?: string | number;
  height?: string | number;
}

export function AdaptiveVideoPlayer({
  src,
  title,
  allowDownload = true,
  allowPictureInPicture = true,
  onTimeUpdate,
  initialTime = 0,
  width = "100%",
  height = "auto",
}: AdaptiveVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);
  const [canPip, setCanPip] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = initialTime;
      
      // Проверка поддержки Picture-in-Picture
      setCanPip(document.pictureInPictureEnabled);
      
      // События для мобильных устройств
      if (videoRef.current) {
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'hidden' && isPlaying && allowPictureInPicture && canPip) {
            try {
              if (document.pictureInPictureElement !== videoRef.current) {
                videoRef.current?.requestPictureInPicture();
              }
            } catch (error) {
              console.error('Failed to enter Picture-in-Picture mode', error);
            }
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }
    }
  }, [initialTime, allowPictureInPicture, isPlaying, canPip]);
  
  // Управление воспроизведением
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Управление звуком
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Изменение громкости
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  // Перемотка видео
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  // Форматирование времени
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  
  // Полноэкранный режим
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Picture-in-Picture режим
  const togglePictureInPicture = async () => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      setIsPipActive(false);
    } else if (videoRef.current) {
      try {
        await videoRef.current.requestPictureInPicture();
        setIsPipActive(true);
      } catch (error) {
        console.error('Failed to enter Picture-in-Picture mode', error);
      }
    }
  };
  
  // Скачивание видео
  const handleDownload = () => {
    if (src) {
      const link = document.createElement("a");
      link.href = src;
      link.download = title || "video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Обработчики событий видео
  useEffect(() => {
    const videoElement = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (videoElement) {
        const current = videoElement.currentTime;
        setCurrentTime(current);
        onTimeUpdate && onTimeUpdate(current);
      }
    };
    
    const handleDurationChange = () => {
      if (videoElement) {
        setDuration(videoElement.duration);
      }
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    
    const handlePipChange = () => {
      setIsPipActive(document.pictureInPictureElement === videoElement);
    };
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('durationchange', handleDurationChange);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('ended', handleEnded);
      videoElement.addEventListener('loadstart', handleLoadStart);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('enterpictureinpicture', handlePipChange);
      videoElement.addEventListener('leavepictureinpicture', handlePipChange);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('durationchange', handleDurationChange);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.removeEventListener('loadstart', handleLoadStart);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('enterpictureinpicture', handlePipChange);
        videoElement.removeEventListener('leavepictureinpicture', handlePipChange);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      }
    };
  }, [onTimeUpdate]);
  
  return (
    <Glassmorphism className="w-full bg-space-800/80 rounded-xl overflow-hidden">
      <div className="relative group">
        {/* Видео */}
        <div className="relative aspect-video overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-space-900/50">
              <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
          )}
          
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={src}
            onClick={togglePlay}
            playsInline
            style={{ width, height }}
          />
          
          {/* Большая кнопка воспроизведения по центру (для мобильных) */}
          {isMobile && !isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300"
              >
                <i className="fas fa-play text-white text-2xl"></i>
              </button>
            </div>
          )}
        </div>
        
        {/* Элементы управления */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 ${isMobile ? 'pb-4' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-200'}`}>
          {/* Прогресс видео */}
          <div className="relative w-full">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className={`w-full appearance-none bg-white/20 h-1 rounded-full outline-none ${isMobile ? 'mb-4' : 'mb-2'}`}
              style={{
                backgroundImage: `linear-gradient(to right, #6E3AFF ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) 0)`,
              }}
            />
            <div className="flex justify-between text-xs text-white/70 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Кнопки управления */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePlay}
                className="text-white hover:text-white/80 transition-colors"
              >
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} ${isMobile ? 'text-xl' : ''}`}></i>
              </button>
              
              {!isMobile && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-white/80 transition-colors"
                  >
                    <i className={`fas ${isMuted ? 'fa-volume-mute' : volume > 0.5 ? 'fa-volume-up' : 'fa-volume-down'}`}></i>
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 appearance-none bg-white/20 h-1 rounded-full outline-none"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {allowPictureInPicture && canPip && (
                <button
                  onClick={togglePictureInPicture}
                  className={`text-white hover:text-white/80 transition-colors ${isPipActive ? 'text-primary' : ''}`}
                  title="Картинка в картинке"
                >
                  <i className="fas fa-external-link-alt"></i>
                </button>
              )}
              
              {allowDownload && (
                <button
                  onClick={handleDownload}
                  className="text-white hover:text-white/80 transition-colors"
                  title="Скачать видео"
                >
                  <i className="fas fa-download"></i>
                </button>
              )}
              
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-white/80 transition-colors"
                title="Полноэкранный режим"
              >
                <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Заголовок видео */}
      <div className="p-3 pb-2">
        <h3 className="font-medium text-lg text-white">{title}</h3>
      </div>
    </Glassmorphism>
  );
}