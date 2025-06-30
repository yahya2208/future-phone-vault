
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eraser, Trash2, Palette } from 'lucide-react';

interface SimpleDrawingPadProps {
  onDrawingCapture: (drawing: string) => void;
}

const SimpleDrawingPad: React.FC<SimpleDrawingPadProps> = ({ onDrawingCapture }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;
    
    // Set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set drawing properties
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [strokeColor]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    captureDrawing();
  };

  const captureDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    onDrawingCapture(dataURL);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    onDrawingCapture('');
  };

  const colors = ['#000000', '#FF0000', '#0000FF', '#008000', '#800080'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-primary text-sm font-semibold flex items-center gap-2">
          <Palette size={16} />
          رسم بسيط (اختياري - للتذكر فقط)
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          ملاحظة: هذا رسم بسيط للتذكر الشخصي وليس توقيعاً قانونياً
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">اللون:</span>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setStrokeColor(color)}
              className={`w-6 h-6 rounded-full border-2 ${
                strokeColor === color ? 'border-primary' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            مسح
          </Button>
        </div>
        
        {hasDrawing && (
          <p className="text-xs text-green-600">
            ✓ تم حفظ الرسم
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleDrawingPad;
