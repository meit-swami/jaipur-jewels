"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { ARManager } from "@/lib/ar-manager";

interface ARTryOnViewerProps {
  productId: string;
  productName: string;
  productCategory: string;
  threeDModel?: string | null;
  onClose: () => void;
}

export default function ARTryOnViewer({
  productId,
  productName,
  productCategory,
  threeDModel,
  onClose,
}: ARTryOnViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const arManagerRef = useRef<ARManager | null>(null);
  const initializeARRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let arManager: ARManager | null = null;

    const initializeAR = async () => {
      try {
        // Check for camera support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera access not supported on this device. Please use a modern browser with camera support.");
        }

        // Check if we're on HTTPS or localhost (required for camera access)
        if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
          throw new Error("Camera access requires HTTPS. Please access this page over a secure connection.");
        }

        // Try to enumerate devices first to check availability
        let hasCamera = false;
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          hasCamera = devices.some(device => device.kind === "videoinput");
        } catch (e) {
          // If enumeration fails, we'll still try to get the camera
          console.warn("Could not enumerate devices:", e);
        }

        // Request camera access with fallback options
        let cameraConstraints: MediaTrackConstraints = {
          facingMode: "user", // Front camera for selfie view
          width: { ideal: 1280 },
          height: { ideal: 720 },
        };

        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: cameraConstraints,
          });
        } catch (firstError: any) {
          // If front camera fails, try any available camera
          console.warn("Front camera not available, trying any camera:", firstError);
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
            });
          } catch (secondError: any) {
            // If that also fails, try basic video
            console.warn("Camera with constraints failed, trying basic video:", secondError);
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
            });
          }
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Initialize AR Manager
        if (canvasRef.current && videoRef.current) {
          arManager = new ARManager(
            canvasRef.current,
            videoRef.current,
            productCategory,
            threeDModel || undefined
          );
          await arManager.initialize();
          arManagerRef.current = arManager;
          setStatus("ready");
        }
      } catch (error: any) {
        console.error("AR initialization error:", error);
        
        // Provide user-friendly error messages
        let userMessage = "Failed to initialize AR. ";
        
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          userMessage += "Camera permission was denied. Please allow camera access in your browser settings and try again.";
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError" || error.message?.includes("device not found")) {
          userMessage += "No camera found on this device. Please use a device with a camera.";
        } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
          userMessage += "Camera is already in use by another application. Please close other apps using the camera and try again.";
        } else if (error.name === "OverconstrainedError" || error.name === "ConstraintNotSatisfiedError") {
          userMessage += "Camera doesn&apos;t support the required settings. Trying with basic settings...";
          // Could retry here, but for now just show error
        } else if (error.message) {
          userMessage += error.message;
        } else {
          userMessage += "Please check camera permissions and try again.";
        }
        
        setErrorMessage(userMessage);
        setStatus("error");
      }
    };

    // Store reference for retry functionality
    initializeARRef.current = initializeAR;

    initializeAR();

    // Cleanup
    return () => {
      if (arManager) {
        arManager.dispose();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [productCategory, threeDModel]);

  const handleClose = () => {
    if (arManagerRef.current) {
      arManagerRef.current.dispose();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white font-bold text-lg">{productName}</h2>
            <p className="text-white/70 text-sm capitalize">{productCategory}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* AR View */}
      <div ref={containerRef} className="flex-1 relative">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ transform: "scaleX(-1)" }} // Mirror effect
        />

        {/* Status Overlay */}
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
              <p>Initializing AR experience...</p>
              <p className="text-sm text-white/70 mt-2">
                Please allow camera access
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-white max-w-md px-6">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-bold mb-2">AR Not Available</h3>
              <p className="text-white/70 mb-4 text-sm leading-relaxed">{errorMessage}</p>
              
              {/* Helpful tips */}
              <div className="bg-white/10 rounded-lg p-4 mb-4 text-left text-sm">
                <p className="font-semibold mb-2">Troubleshooting tips:</p>
                <ul className="space-y-1 text-white/80">
                  <li>• Make sure your device has a camera</li>
                  <li>• Allow camera permissions in browser settings</li>
                  <li>• Close other apps using the camera</li>
                  <li>• Try refreshing the page</li>
                  <li>• Use a modern browser (Chrome, Safari, Firefox)</li>
                </ul>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setStatus("loading");
                    setErrorMessage("");
                    if (initializeARRef.current) {
                      initializeARRef.current();
                    }
                  }}
                  className="px-6 py-3 bg-luxury-gold text-white rounded-full font-medium hover:bg-luxury-gold-dark transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {status === "ready" && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>AR Active - Position yourself in frame</span>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {status === "ready" && (
        <div className="absolute bottom-20 left-4 right-4 z-10">
          <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 text-white text-sm">
            <p className="font-semibold mb-2">Instructions:</p>
            <ul className="space-y-1 text-white/80">
              {productCategory.toLowerCase().includes("ring") && (
                <li>• Show your hand with fingers spread</li>
              )}
              {productCategory.toLowerCase().includes("necklace") && (
                <li>• Face the camera directly</li>
              )}
              {productCategory.toLowerCase().includes("earring") && (
                <li>• Face the camera, show your ear</li>
              )}
              {productCategory.toLowerCase().includes("bracelet") && (
                <li>• Show your wrist to the camera</li>
              )}
              {productCategory.toLowerCase().includes("anklet") && (
                <li>• Show your ankle to the camera</li>
              )}
              {(productCategory.toLowerCase().includes("tiara") ||
                productCategory.toLowerCase().includes("crown")) && (
                <li>• Face the camera directly, keep head still</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
