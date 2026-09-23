import React, { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { APP_ID, SERVER_SECRET } from './constant';
import { ArrowLeft, Phone, PhoneOff, Mic, MicOff, Video, VideoOff, MessageSquare, Settings, Users, Clock, Heart } from 'lucide-react';

const VideoPage = () => {
    const {id} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const roomID = id;
    const videoContainerRef = useRef(null);
    const zegoInstanceRef = useRef(null);
    const initializationRef = useRef(false);
    
    const [isConnecting, setIsConnecting] = useState(true);
    const [callStarted, setCallStarted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [isEmergency, setIsEmergency] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Get parameters from URL
    const urlParams = new URLSearchParams(location.search);
    const username = urlParams.get('username') || `User_${Math.floor(Math.random() * 1000)}`;
    const language = urlParams.get('language') || 'english';
    const provider = urlParams.get('provider') || '';
    const emergency = urlParams.get('emergency') === 'true';
    
    useEffect(() => {
        setIsEmergency(emergency);
    }, [emergency]);

    // Call duration timer
    useEffect(() => {
        let interval;
        if (callStarted) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callStarted]);

    // Ensure video container is visible when call starts
    useEffect(() => {
        if (callStarted && videoContainerRef.current) {
            videoContainerRef.current.style.zIndex = '10';
            console.log('Ensuring video container is visible - z-index set to 10');
        }
    }, [callStarted]);

    // Initialize ZEGOCLOUD when component mounts (only once)
    useEffect(() => {
        const initializeZego = async () => {
            if (videoContainerRef.current && !initializationRef.current && !zegoInstanceRef.current) {
                initializationRef.current = true;
                setIsInitialized(true);
                
                try {
                    setIsConnecting(true);
                    console.log('Starting ZEGOCLOUD initialization...');
                    console.log('Room ID:', roomID);
                    console.log('Username:', username);
                    console.log('Container element:', videoContainerRef.current);
                    
                    // Check if ZEGOCLOUD SDK is available
                    if (!ZegoUIKitPrebuilt) {
                        throw new Error('ZEGOCLOUD SDK not loaded');
                    }
                    console.log('ZEGOCLOUD SDK is available');
                    
                    // Clear any existing content in the container
                    videoContainerRef.current.innerHTML = '';
                    
                    // Ensure container is visible and ready
                    videoContainerRef.current.style.display = 'block';
                    videoContainerRef.current.style.visibility = 'visible';
                    videoContainerRef.current.style.zIndex = '10';
                    
                    // Generate Kit Token
                    const appID = APP_ID;
                    const serverSecret = SERVER_SECRET;
                    console.log('App ID:', appID);
                    console.log('Server Secret:', serverSecret ? 'Present' : 'Missing');
                    
                    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                        appID, 
                        serverSecret, 
                        roomID, 
                        Date.now().toString(), 
                        username
                    );
                    console.log('Kit Token generated:', kitToken ? 'Success' : 'Failed');
                    
                    // Create instance object from Kit Token
                    const zp = ZegoUIKitPrebuilt.create(kitToken);
                    console.log('ZEGOCLOUD instance created:', zp ? 'Success' : 'Failed');
                    zegoInstanceRef.current = zp; // Store reference for cleanup
                    
                    // Add a small delay to ensure container is ready
                    setTimeout(() => {
                        console.log('Starting ZEGOCLOUD joinRoom...');
                        console.log('Container before join:', videoContainerRef.current);
                        console.log('Container dimensions:', {
                            width: videoContainerRef.current.offsetWidth,
                            height: videoContainerRef.current.offsetHeight
                        });
                        
                        // Start the call
                        zp.joinRoom({
                        container: videoContainerRef.current,
                        sharedLinks: [
                            {
                                name: 'Copy link',
                                url: window.location.protocol + '//' + 
                                     window.location.host + window.location.pathname +
                                     '?roomID=' + roomID,
                            },
                        ],
                        scenario: {
                            mode: ZegoUIKitPrebuilt.OneONoneCall,
                        },
                        // Add more specific configuration
                        turnOnCameraWhenJoining: true,
                        turnOnMicrophoneWhenJoining: true,
                        useSpeakerWhenJoining: true,
                        onJoinRoom: () => {
                            console.log('Successfully joined ZEGOCLOUD room');
                            console.log('Video container after join:', videoContainerRef.current);
                            console.log('Container children:', videoContainerRef.current?.children);
                            setIsConnecting(false);
                            setCallStarted(true);
                            
                            // Immediately ensure the video container is visible
                            if (videoContainerRef.current) {
                                videoContainerRef.current.style.zIndex = '10';
                                console.log('Set video container z-index to 10 immediately');
                                
                                // Add mutation observer to watch for ZEGOCLOUD UI changes
                                const observer = new MutationObserver((mutations) => {
                                    mutations.forEach((mutation) => {
                                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                            console.log('ZEGOCLOUD UI elements detected!', mutation.addedNodes);
                                            console.log('Container children count:', videoContainerRef.current?.children?.length);
                                        }
                                    });
                                });
                                
                                observer.observe(videoContainerRef.current, {
                                    childList: true,
                                    subtree: true
                                });
                                
                                // Store observer for cleanup
                                videoContainerRef.current._observer = observer;
                            }
                            
                            // Check if UI loaded properly after a short delay
                            setTimeout(() => {
                                const hasVideoUI = videoContainerRef.current?.children?.length > 0;
                                console.log('Video UI loaded check:', hasVideoUI);
                                console.log('Container children after timeout:', videoContainerRef.current?.children);
                                
                                if (!hasVideoUI) {
                                    console.warn('ZEGOCLOUD UI may not have loaded properly');
                                    // Try to create a fallback video element
                                    const fallbackDiv = document.createElement('div');
                                    fallbackDiv.innerHTML = `
                                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #1f2937; color: white; text-align: center; padding: 20px;">
                                            <h3>Video Call Interface</h3>
                                            <p>ZEGOCLOUD UI is loading...</p>
                                            <p>Room: ${roomID}</p>
                                            <p>User: ${username}</p>
                                            <button onclick="window.location.reload()" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                                                Refresh Page
                                            </button>
                                        </div>
                                    `;
                                    videoContainerRef.current.appendChild(fallbackDiv);
                                    setConnectionError('Video interface is loading. If this persists, please refresh the page.');
                                } else {
                                    console.log('ZEGOCLOUD UI loaded successfully!');
                                    // Ensure the container is visible
                                    if (videoContainerRef.current) {
                                        videoContainerRef.current.style.zIndex = '10';
                                        console.log('Updated container z-index to 10');
                                    }
                                }
                            }, 5000); // Increased timeout to 5 seconds
                        },
                        onLeaveRoom: () => {
                            console.log('Leaving ZEGOCLOUD room');
                            // Clean up before navigating
                            if (zegoInstanceRef.current) {
                                try {
                                    zegoInstanceRef.current.destroy();
                                } catch (error) {
                                    console.warn('Error destroying ZEGOCLOUD instance:', error);
                                }
                                zegoInstanceRef.current = null;
                            }
                            if (videoContainerRef.current) {
                                videoContainerRef.current.innerHTML = '';
                            }
                            navigate('/');
                        },
                        showPreJoinView: false,
                        showInviteToCohostButton: false,
                        showRemoveCohostButton: false,
                        showNonVideoUser: true,
                        showOnlyAudioUser: true,
                        showAudioVideoSettingsButton: true,
                        showScreenSharingButton: true,
                        showTextChat: true,
                        showUserList: true,
                        showLayoutButton: true,
                        showLeavingView: true,
                    });
                    }, 500); // 500ms delay to ensure container is ready
                } catch (error) {
                    console.error('Error joining room:', error);
                    setIsConnecting(false);
                    setConnectionError(error.message || 'Failed to connect to video call');
                    initializationRef.current = false; // Reset ref on error
                    setIsInitialized(false); // Reset flag on error
                }
            }
        };
        
        // Add a small delay to ensure DOM is ready
        const timeoutId = setTimeout(initializeZego, 100);
        
        return () => {
            clearTimeout(timeoutId);
        };
    }, [roomID, username]); // Add dependencies to prevent unnecessary re-runs

    // Cleanup effect for component unmount
    useEffect(() => {
        return () => {
            // Clean up ZEGOCLOUD instance with timeout
            if (zegoInstanceRef.current) {
                try {
                    // Give ZEGOCLOUD time to clean up its own DOM elements
                    setTimeout(() => {
                        try {
                            if (zegoInstanceRef.current) {
                                zegoInstanceRef.current.destroy();
                            }
                        } catch (error) {
                            console.warn('Error destroying ZEGOCLOUD instance:', error);
                        }
                    }, 100);
                } catch (error) {
                    console.warn('Error in ZEGOCLOUD cleanup:', error);
                }
                zegoInstanceRef.current = null;
            }
            
            // Clear video container after a short delay
            setTimeout(() => {
                if (videoContainerRef.current) {
                    // Clean up mutation observer
                    if (videoContainerRef.current._observer) {
                        videoContainerRef.current._observer.disconnect();
                        delete videoContainerRef.current._observer;
                    }
                    videoContainerRef.current.innerHTML = '';
                }
            }, 200);
        };
    }, []);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getLanguageText = (key) => {
        const translations = {
            english: {
                connecting: 'Connecting to consultation...',
                connected: 'Connected to healthcare provider',
                emergency: 'Emergency Consultation',
                duration: 'Duration',
                leaveCall: 'Leave Call',
                backToHome: 'Back to Home',
                poweredBy: 'Powered by TeleHealth'
            },
            hindi: {
                connecting: 'परामर्श से जुड़ रहे हैं...',
                connected: 'स्वास्थ्य सेवा प्रदाता से जुड़े',
                emergency: 'आपातकालीन परामर्श',
                duration: 'अवधि',
                leaveCall: 'कॉल छोड़ें',
                backToHome: 'होम पर वापस जाएं',
                poweredBy: 'टेलीहेल्थ द्वारा संचालित'
            },
            punjabi: {
                connecting: 'ਸਲਾਹ ਨਾਲ ਜੁੜ ਰਹੇ ਹਾਂ...',
                connected: 'ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਨਾਲ ਜੁੜੇ',
                emergency: 'ਜ਼ਰੂਰੀ ਸਲਾਹ',
                duration: 'ਮਿਆਦ',
                leaveCall: 'ਕਾਲ ਛੱਡੋ',
                backToHome: 'ਹੋਮ ਤੇ ਵਾਪਸ ਜਾਓ',
                poweredBy: 'ਟੈਲੀਹੈਲਥ ਦੁਆਰਾ ਸੰਚਾਲਿਤ'
            }
        };
        return translations[language]?.[key] || translations.english[key];
    };


    const handleLeaveCall = () => {
        navigate('/');
    };

    return (
        <div className="video-container">
            {/* Header */}
            <div className="video-header">
                <div className="video-header-content">
                    <button 
                        onClick={() => navigate('/')}
                        className="back-button"
                    >
                        <ArrowLeft style={{width: '16px', height: '16px'}} />
                        {getLanguageText('backToHome')}
                    </button>
                    
                    <div className="video-status">
                        {/* Emergency Badge */}
                        {isEmergency && (
                            <div className="emergency-badge">
                                <Heart style={{width: '16px', height: '16px'}} />
                                {getLanguageText('emergency')}
                            </div>
                        )}
                        
                        {/* Call Duration */}
                        {callStarted && (
                            <div className="call-duration">
                                <Clock style={{width: '16px', height: '16px'}} />
                                <span>{formatDuration(callDuration)}</span>
                            </div>
                        )}
                        
                        {/* Connection Status */}
                        <div className="connection-status">
                            <div className={`connection-dot ${
                                callStarted ? 'connected' : isConnecting ? 'connecting' : 'disconnected'
                            }`}></div>
                            <span className="connection-text">
                                {callStarted ? getLanguageText('connected') : 
                                 isConnecting ? getLanguageText('connecting') : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                    
                    <div style={{width: '96px'}}></div>
                </div>
            </div>

            {/* Video Container */}
            <div style={{position: 'relative', width: '100%', height: '100vh'}}>
                {/* Loading State */}
                {isConnecting && !connectionError && (
                    <div className="loading-overlay">
                        <div className="loading-content">
                            <div className="loading-spinner"></div>
                            <h3 className="loading-title">{getLanguageText('connecting')}</h3>
                            <p className="loading-subtitle">Please wait while we connect you...</p>
                        </div>
                    </div>
                )}
                
                {/* Error State */}
                {connectionError && (
                    <div className="error-overlay">
                        <div className="error-content">
                            <div className="error-icon">⚠️</div>
                            <h3 className="error-title">Connection Error</h3>
                            <p className="error-message">{connectionError}</p>
                            <div className="error-actions">
                                <button 
                                    onClick={() => {
                                        setConnectionError(null);
                                        initializationRef.current = false;
                                        setIsInitialized(false);
                                        setIsConnecting(true);
                                        // Retry connection
                                        setTimeout(() => {
                                            if (videoContainerRef.current) {
                                                videoContainerRef.current.innerHTML = '';
                                            }
                                        }, 100);
                                    }}
                                    className="retry-button"
                                >
                                    Retry Connection
                                </button>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="retry-button"
                                    style={{marginLeft: '10px', background: '#6b7280'}}
                                >
                                    Refresh Page
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* ZEGOCLOUD Container - React won't manage this directly */}
                <div 
                    ref={videoContainerRef} 
                    style={{
                        width: '100%', 
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: (isConnecting || connectionError) ? 0 : 10
                    }}
                />
            </div>

            {/* Debug Panel - Remove in production */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    zIndex: 9999,
                    maxWidth: '300px'
                }}>
                    <div><strong>Debug Info:</strong></div>
                    <div>Connecting: {isConnecting ? 'Yes' : 'No'}</div>
                    <div>Call Started: {callStarted ? 'Yes' : 'No'}</div>
                    <div>Initialized: {isInitialized ? 'Yes' : 'No'}</div>
                    <div>Error: {connectionError || 'None'}</div>
                    <div>Room ID: {roomID}</div>
                    <div>Username: {username}</div>
                    <div>Container Children: {videoContainerRef.current?.children?.length || 0}</div>
                </div>
            )}

            {/* Footer */}
            <div className="footer-text">
                {getLanguageText('poweredBy')}
            </div>
        </div>
    );
};

export default VideoPage;
