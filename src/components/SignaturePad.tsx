
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface SignaturePadProps {
  onSignatureCapture: (signature: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureCapture }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const { t } = useLanguage();

  // إعداد لوحة الرسم
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        // ضبط حجم الكانفاس مع مراعاة نسبة البكسل
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // تطبيق عامل القياس لضمان الجودة العالية
          ctx.scale(dpr, dpr);
          
          // تعيين خصائص الرسم
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

  // الحصول على إحداثيات المؤشر
  // الحصول على إحداثيات المؤشر مع مراعاة نسبة البكسل
  const getPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    let clientX, clientY;
    
    if ('touches' in e) {
      // حدث لمس
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // حدث فأرة
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // حساب الموضع النسبي مع مراعاة نسبة البكسل
    return {
      x: (clientX - rect.left) * dpr,
      y: (clientY - rect.top) * dpr
    };
  }, []);

  // بدء الرسم
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // منع التمرير على الأجهزة المحمولة
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
      ctx.stroke(); // التأكد من بدء الرسم مباشرة
    }
  }, [getPosition]);

  // الرسم
  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const pos = getPosition(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = '#00ff88'; // تعيين لون الخط في كل مرة للتأكد من ظهوره
      ctx.lineWidth = 2.5 * (window.devicePixelRatio || 1); // ضبط سمك الخط
      ctx.stroke();
    }
  }, [isDrawing, getPosition]);

  // إيقاف الرسم
  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      document.body.style.overflow = ''; // إعادة تفعيل التمرير
      
      const canvas = canvasRef.current;
      if (canvas) {
        const signatureData = canvas.toDataURL('image/png');
        onSignatureCapture(signatureData);
      }
    }
  }, [isDrawing, onSignatureCapture]);

  // مسح التوقيع
  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
      }
    }
  }, []);

  // إضافة مستمعات الأحداث للشاشات التي تعمل باللمس
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // منع التمرير عند اللمس
    const preventDefault = (e: TouchEvent) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    };

    // إضافة مستمعات الأحداث للشاشات التي تعمل باللمس
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
        <CardTitle className="text-primary glow-text font-['Orbitron'] text-lg">
          {t('signature')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="border border-primary/30 rounded-lg p-2 bg-background/50"
          style={{ touchAction: 'none' }} // منع التكبير/التصغير على الأجهزة المحمولة
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
            {t('signHere')}
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
