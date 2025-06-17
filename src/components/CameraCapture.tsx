
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera as CameraIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Camera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera';

interface CameraCaptureProps {
  onPhotoCapture: (photo: string) => void;
  title: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture, title }) => {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const takePicture = async () => {
    setIsLoading(true);
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 800,
        height: 600
      });

      if (image.dataUrl) {
        setCapturedPhoto(image.dataUrl);
        onPhotoCapture(image.dataUrl);
      }
    } catch (error) {
      console.error('خطأ في التقاط الصورة:', error);
      // Fallback to file input for web
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setCapturedPhoto(result);
            onPhotoCapture(result);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="holo-card">
      <CardHeader>
        <CardTitle className="text-primary glow-text font-['Orbitron'] text-lg flex items-center gap-2">
          <CameraIcon size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!capturedPhoto && (
          <Button 
            onClick={takePicture}
            disabled={isLoading}
            className="neural-btn w-full"
          >
            {isLoading ? 'جاري التحميل...' : t('takePhoto')}
          </Button>
        )}
        
        {capturedPhoto && (
          <div className="space-y-4">
            <img 
              src={capturedPhoto} 
              alt="صورة ملتقطة" 
              className="w-full h-48 object-cover rounded-lg border border-primary/30"
            />
            <Button 
              onClick={() => {
                setCapturedPhoto(null);
                takePicture();
              }}
              variant="outline"
              className="w-full"
            >
              إعادة التقاط الصورة
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
