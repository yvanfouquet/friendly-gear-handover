import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Equipment } from '@/types/equipment';

interface CSVImportProps {
  onImport: (equipment: Equipment[]) => void;
}

export function CSVImport({ onImport }: CSVImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<Equipment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseCSV = (text: string): Equipment[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(';').map(h => h.trim().toLowerCase());
    const equipment: Equipment[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(';').map(v => v.trim());
      if (values.length < 3) continue;

      const item: Equipment = {
        id: Date.now().toString() + i,
        name: values[headers.indexOf('nom')] || values[headers.indexOf('name')] || values[0] || '',
        serialNumber: values[headers.indexOf('numéro de série')] || values[headers.indexOf('serial')] || values[headers.indexOf('serialnumber')] || values[1] || '',
        category: values[headers.indexOf('catégorie')] || values[headers.indexOf('category')] || values[2] || '',
        description: values[headers.indexOf('description')] || values[3] || '',
        status: 'available',
      };

      if (item.name && item.serialNumber) {
        equipment.push(item);
      }
    }

    return equipment;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        setPreview(parsed);
        
        if (parsed.length === 0) {
          toast({
            title: 'Erreur',
            description: 'Aucun matériel valide trouvé dans le fichier',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de lire le fichier CSV',
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsText(file);
  };

  const handleImport = () => {
    if (preview.length === 0) return;
    
    onImport(preview);
    setPreview([]);
    setIsOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    toast({
      title: 'Import réussi',
      description: `${preview.length} matériel(s) importé(s)`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Importer CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importer depuis un fichier CSV</DialogTitle>
          <DialogDescription>
            Format attendu : Nom;Numéro de série;Catégorie;Description
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Cliquez pour sélectionner un fichier CSV
              </p>
              <p className="text-xs text-muted-foreground">
                Séparateur : point-virgule (;)
              </p>
            </label>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2">Traitement en cours...</span>
            </div>
          )}

          {preview.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Aperçu ({preview.length} éléments)</h4>
              <div className="max-h-48 overflow-y-auto border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2">Nom</th>
                      <th className="text-left p-2">N° Série</th>
                      <th className="text-left p-2">Catégorie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((item, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.serialNumber}</td>
                        <td className="p-2">{item.category}</td>
                      </tr>
                    ))}
                    {preview.length > 5 && (
                      <tr className="border-t border-border">
                        <td colSpan={3} className="p-2 text-center text-muted-foreground">
                          ... et {preview.length - 5} autres
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Button onClick={handleImport} className="w-full">
                Importer {preview.length} matériel(s)
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
