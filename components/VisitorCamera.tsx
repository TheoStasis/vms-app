import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

type VisitorCameraProps = {
  onCapture: (image: string | null) => void;
  resetSignal?: number;
};

export default function VisitorCamera({ onCapture, resetSignal }: VisitorCameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    setImage(null);
  }, [resetSignal]);

  // Mobile-friendly constraints
  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user", // Forces the front camera on phones
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      onCapture(imageSrc); // Passes the image back to main form
    }
  }, [webcamRef, onCapture]);

  const retake = () => {
    setImage(null);
    onCapture(null);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-4">
      {image ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-gray-300">
          <img src={image} alt="Visitor" className="w-full h-auto object-cover" />
          <button
            type="button"
            onClick={retake}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Retake Photo
          </button>
        </div>
      ) : (
        <div className="relative w-full rounded-xl overflow-hidden border border-gray-300">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-auto object-cover"
          />
          <button
            type="button"
            onClick={capture}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md"
          >
            Capture
          </button>
        </div>
      )}
    </div>
  );
}