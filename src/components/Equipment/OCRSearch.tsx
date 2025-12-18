import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, ScanLine } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Tesseract from 'tesseract.js';

interface OCRSearchProps {
  onSearch: (serialNumber: string) => void;
}

export function OCRSearch({ onSearch }: OCRSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedText, setDetectedText] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsProcessing(true);
    setProgress(0);
    setDetectedText(null);

    try {
      const result = await Tesseract.recognize(file, 'eng+fra', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const text = result.data.text.trim();
      
      // Extract potential serial numbers (alphanumeric patterns)
      const serialPatterns = text.match(/[A-Z0-9][-A-Z0-9]{3,}/gi) || [];
      const cleanedText = serialPatterns.join(' | ') || text.replace(/\s+/g, ' ').substring(0, 100);
      
      setDetectedText(cleanedText);

      if (!cleanedText) {
        toast({
          title: 'Aucun texte détecté',
          description: 'Essayez avec une image plus nette',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur OCR',
        description: 'Impossible de traiter l\'image',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = (text: string) => {
    onSearch(text);
    setIsOpen(false);
    resetState();
  };

  const resetState = () => {
    setDetectedText(null);
    setImagePreview(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetState();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ScanLine className="w-4 h-4 mr-2" />
          Recherche OCR
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Recherche par photo</DialogTitle>
          <DialogDescription>
            Prenez une photo du numéro de série pour le rechercher
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
              id="ocr-upload"
            />
            <label htmlFor="ocr-upload" className="cursor-pointer block">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-48 mx-auto rounded-lg mb-2"
                />
              ) : (
                <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground">
                {imagePreview ? 'Cliquez pour changer d\'image' : 'Cliquez pour prendre une photo ou sélectionner une image'}
              </p>
            </label>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
                <span>Analyse en cours... {progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {detectedText && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Texte détecté :</p>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-mono break-all">{detectedText}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {detectedText.split(' | ').map((serial, i) => (
                  <Button
                    key={i}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSearch(serial)}
                  >
                    Rechercher "{serial}"
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
