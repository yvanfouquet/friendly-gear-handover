import { useState, useRef } from 'react';
import { Equipment } from '@/types/equipment';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Camera, Loader2, Plus, Package } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Tesseract from 'tesseract.js';
import { useToast } from '@/hooks/use-toast';

interface EquipmentSearchProps {
  equipment: Equipment[];
  onSelect: (equipment: Equipment) => void;
  selectedIds: string[];
}

export function EquipmentSearch({ equipment, onSelect, selectedIds }: EquipmentSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOCROpen, setIsOCROpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filteredEquipment = equipment.filter((item) => {
    if (!searchQuery) return false;
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.serialNumber.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  const availableResults = filteredEquipment.filter(
    (item) => item.status === 'available' && !selectedIds.includes(item.id)
  );

  const handleOCRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsProcessing(true);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(file, 'eng+fra', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const text = result.data.text.trim();
      const serialPatterns = text.match(/[A-Z0-9][-A-Z0-9]{3,}/gi) || [];
      const cleanedText = serialPatterns[0] || text.replace(/\s+/g, ' ').substring(0, 50);

      if (cleanedText) {
        setSearchQuery(cleanedText);
        setIsOCROpen(false);
        toast({
          title: 'Texte détecté',
          description: `Recherche: ${cleanedText}`,
        });
      } else {
        toast({
          title: 'Aucun texte détecté',
          description: 'Essayez avec une image plus nette',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Erreur OCR',
        description: "Impossible de traiter l'image",
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, référence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isOCROpen} onOpenChange={setIsOCROpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Camera className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Recherche par photo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleOCRUpload}
                  className="hidden"
                  id="ocr-search-upload"
                />
                <label htmlFor="ocr-search-upload" className="cursor-pointer block">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  ) : (
                    <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  )}
                  <p className="text-sm text-muted-foreground">
                    Prenez une photo du numéro de série
                  </p>
                </label>
              </div>
              {isProcessing && (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyse... {progress}%</span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {searchQuery && (
        <Card>
          <CardContent className="p-3">
            {availableResults.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {filteredEquipment.length > 0
                  ? 'Tous les résultats sont déjà sélectionnés ou non disponibles'
                  : 'Aucun matériel trouvé'}
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{item.serialNumber}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => onSelect(item)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
