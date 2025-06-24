
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Signature } from 'lucide-react';

interface SignaturePadProps {
  onSignatureCapture: (signature: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureCapture }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctx.strokeStyle = '#00ff88';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * dpr,
      y: (clientY - rect.top) * dpr
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if ('touches' in e) {
      document.body.style.overflow = 'hidden';
    }
    
    setIsDrawing(true);
    setHasSignature(true);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const pos = getPosition(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.stroke();
    }
  }, [getPosition]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const pos = getPosition(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2.5 * (window.devicePixelRatio || 1);
      ctx.stroke();
    }
  }, [isDrawing, getPosition]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      document.body.style.overflow = '';
      
      const canvas = canvasRef.current;
      if (canvas && hasSignature) {
        const signatureData = canvas.toDataURL('image/png');
        onSignatureCapture(signatureData);
      }
    }
  }, [isDrawing, hasSignature, onSignatureCapture]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
        onSignatureCapture('');
      }
    }
  }, [onSignatureCapture]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventDefault = (e: TouchEvent) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    };

    canvas.addEventListener('touchstart', preventDefault, { passive: false });
    canvas.addEventListener('touchmove', preventDefault, { passive: false });
    
    return () => {
      canvas.removeEventListener('touchstart', preventDefault);
      canvas.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  return (
    <Card className="holo-card">
      <CardHeader>
        <CardTitle className="text-primary glow-text font-['Orbitron'] text-lg flex items-center gap-2">
          <Signature size={20} />
          {t('signature')} *
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="border border-primary/30 rounded-lg p-2 bg-background/50"
          style={{ touchAction: 'none' }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-40 cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
          />
          <p className="text-center text-sm text-muted-foreground mt-2">
            {hasSignature ? 'تم إضافة التوقيع ✓' : t('signHere')}
          </p>
        </div>
        
        {hasSignature && (
          <Button 
            onClick={clearSignature}
            variant="outline"
            className="w-full"
          >
            {t('clearSignature')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SignaturePad;
