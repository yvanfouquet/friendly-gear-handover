import { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  width?: number;
  height?: number;
}

export function SignaturePad({ onSave, width = 500, height = 200 }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      return;
    }
    const dataURL = sigCanvas.current?.toDataURL('image/png');
    if (dataURL) {
      onSave(dataURL);
    }
  };

  useEffect(() => {
    // Resize canvas on mount
    const canvas = sigCanvas.current?.getCanvas();
    if (canvas) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.getContext('2d')?.scale(ratio, ratio);
    }
  }, [width, height]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="#1e293b"
          canvasProps={{
            width,
            height,
            className: 'signature-pad w-full',
            style: { width: '100%', height: `${height}px` }
          }}
        />
        <div className="absolute bottom-4 left-4 right-4 border-t border-dashed border-muted-foreground/30" />
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-card px-2">
          Signez ici
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={clear} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          Effacer
        </Button>
        <Button onClick={save} className="flex-1">
          Valider la signature
        </Button>
      </div>
    </div>
  );
}
