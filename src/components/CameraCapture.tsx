
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CameraCaptureProps {
  onPhotoCapture: (photo: string) => void;
  title: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const { t } = useLanguage();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(photoData);
        onPhotoCapture(photoData);
        stopCamera();
      }
    }
  };

  return (
    <Card className="holo-card">
      <CardHeader>
        <CardTitle className="text-primary glow-text font-['Orbitron'] text-lg flex items-center gap-2">
          <Camera size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isStreaming && !capturedPhoto && (
          <Button 
            onClick={startCamera}
            className="neural-btn w-full"
          >
            {t('takePhoto')}
          </Button>
        )}
        
        {isStreaming && (
          <div className="space-y-4">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-48 object-cover rounded-lg border border-primary/30"
            />
            <div className="flex gap-2">
              <Button onClick={capturePhoto} className="neural-btn flex-1">
                Capture
              </Button>
              <Button onClick={stopCamera} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {capturedPhoto && (
          <div className="space-y-4">
            <img 
              src={capturedPhoto} 
              alt="Captured" 
              className="w-full h-48 object-cover rounded-lg border border-primary/30"
            />
            <Button 
              onClick={() => {
                setCapturedPhoto(null);
                startCamera();
              }}
              variant="outline"
              className="w-full"
            >
              Retake Photo
            </Button>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
