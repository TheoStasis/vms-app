import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

type VisitorCameraProps = {
  onCapture: (image: string | null) => void;
  resetSignal?: number;
};

export default function VisitorCamera({ onCapture, resetSignal }: VisitorCameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    setImage(null);
    setIsCameraOpen(false);
  }, [resetSignal]);

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user", 
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      onCapture(imageSrc); 
      setIsCameraOpen(false); 
    }
  }, [webcamRef, onCapture]);

  const retake = () => {
    setImage(null);
    onCapture(null);
    setIsCameraOpen(true); 
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-4">
      {image ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-slate-300">
          <img src={image} alt="Visitor" className="w-full h-auto object-cover" />
          <button
            type="button"
            onClick={retake}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition hover:bg-red-700"
          >
            Retake Photo
          </button>
        </div>
      ) : isCameraOpen ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-slate-300 bg-black">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-auto object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsCameraOpen(false)}
              className="bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={capture}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md transition hover:bg-blue-700"
            >
              Capture
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50 gap-3">
          <div className="text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
          <span className="text-sm text-slate-500">No photo taken</span>
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition hover:bg-slate-800"
          >
            Open Camera
          </button>
        </div>
      )}
    </div>
  );
}