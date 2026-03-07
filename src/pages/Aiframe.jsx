import React, { useState, useRef, useEffect } from 'react';
import './Aiframe.css';
import { Camera, Video, Share2, RefreshCw } from 'lucide-react';
import WayfarerImg from '../assets/glasses/Wayfarer.png';
import AviatorImg from '../assets/glasses/Aviator.png';
import RoundImg from '../assets/glasses/Round.png';
import CateyeImg from '../assets/glasses/Cateye.png';

// Mock Data for Frames
const framesData = [
    { id: 1, name: 'Wayfarer', image: WayfarerImg },
    { id: 2, name: 'Aviator', image: AviatorImg },
    { id: 3, name: 'Round', image: RoundImg },
    { id: 4, name: 'Cat-Eye', image: CateyeImg },
];

const AIFrame = () => {
    const [isCameraOn, setCameraOn] = useState(false);
    const [selectedFrame, setSelectedFrame] = useState(framesData[0]);
    const [detectedFaceShape, setDetectedFaceShape] = useState(null);
    const videoRef = useRef(null); // Ref to access the video DOM element

    // --- Function to start the webcam ---
    const startWebcam = async () => {
        try {
            // Request access to the user's webcam
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            // If we have the videoRef and the stream, attach the stream to the video element
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
            // Handle errors (e.g., user denies permission)
            setCameraOn(false);
        }
    };

    // --- Function to stop the webcam ---
    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            // Get all tracks from the stream
            const tracks = videoRef.current.srcObject.getTracks();
            // Stop each track
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleStartCamera = () => {
        setCameraOn(true);
        // Simulate face detection after a delay
        setTimeout(() => setDetectedFaceShape('Oval'), 2000);
    };

    // --- UseEffect to manage the webcam stream ---
    useEffect(() => {
        if (isCameraOn) {
            startWebcam();
        } else {
            stopWebcam();
        }

        // Cleanup function: this will be called when the component unmounts
        return () => {
            stopWebcam();
        };
    }, [isCameraOn]); // This effect runs whenever `isCameraOn` changes

    const getRecommendation = () => {
        if (!detectedFaceShape) return 'Start the camera to get a recommendation!';
        if (!isCameraOn) return 'Restart the camera to get a new recommendation.';
        switch (detectedFaceShape) {
            case 'Oval': return 'Oval faces suit almost any frame style!';
            case 'Square': return 'Round or oval frames will soften your features.';
            case 'Round': return 'Square or rectangular frames will add definition.';
            default: return 'Explore our wide range of styles.';
        }
    };

    return (
        <div className="aiframe-container">
            <div className="aiframe-header">
                <h1>AI-Powered Virtual Try-On</h1>
                <p>See how our glasses look on you with our live virtual try-on. Simply use your webcam to get started.</p>
            </div>

            <div className="aiframe-content">
                <div className="aiframe-video-container">
                    {!isCameraOn ? (
                        <div className="video-placeholder">
                            <Video size={80} strokeWidth={1} />
                            <p>Your webcam feed will appear here</p>
                            <button className="start-camera-btn" onClick={handleStartCamera}>
                                <Camera size={20} /> Start Camera
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* This is the actual video element for the webcam feed */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: 'scaleX(-1)' // Mirror the video
                                }}
                            />

                            {detectedFaceShape && (
                                <div className="face-shape-overlay">
                                    Face Shape: <strong>{detectedFaceShape}</strong>
                                </div>
                            )}
                            <div className="video-controls">
                                <button className="control-btn" title="Capture Photo"><Camera size={20} /></button>
                                <button className="control-btn" title="Share Look"><Share2 size={20} /></button>
                                <button className="control-btn" title="Switch Camera"><RefreshCw size={20} /></button>
                            </div>
                        </>
                    )}
                </div>

                <div className="aiframe-sidebar">
                    <h3>Choose Your Style</h3>
                    <div className="frames-grid">
                        {framesData.map((frame) => (
                            <div
                                key={frame.id}
                                className={`frame-card ${selectedFrame?.id === frame.id ? 'selected' : ''}`}
                                onClick={() => setSelectedFrame(frame)}
                            >
                                <img src={frame.image} alt={frame.name} />
                                <p>{frame.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className="recommendation-section">
                        <h3>Our Recommendation</h3>
                        <p>{getRecommendation()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIFrame;