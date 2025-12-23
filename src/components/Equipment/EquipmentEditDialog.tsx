import { useState, useEffect } from 'react';
import { Equipment, Company } from '@/types/equipment';
import { CollaboratorProfile } from '@/types/collaborator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/data/mockData';

interface EquipmentEditDialogProps {
  equipment: Equipment | null;
  companies: Company[];
  collaborators: CollaboratorProfile[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (equipment: Equipment) => void;
}

const equipmentTypes = [
  'PC fixe',
  'Portable',
  'Tablette',
  'Écran',
  'Téléphone fixe',
  'Téléphone mobile',
  'Accessoire',
  'Autre',
];

const statusOptions = [
  { value: 'available', label: 'Disponible' },
  { value: 'assigned', label: 'Attribué' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'rebut', label: 'Rebut' },
];

export function EquipmentEditDialog({
  equipment,
  companies,
  collaborators,
  open,
  onOpenChange,
  onSave,
}: EquipmentEditDialogProps) {
  const [formData, setFormData] = useState<Partial<Equipment>>({});

  useEffect(() => {
    if (equipment) {
      setFormData({ ...equipment });
    }
  }, [equipment]);

  const handleSave = () => {
    if (!formData.name || !formData.serialNumber || !formData.category) {
      return;
    }

    onSave({
      ...equipment!,
      ...formData,
      assignedDate: formData.collaboratorId && formData.status === 'assigned' 
        ? formData.assignedDate || new Date().toISOString().split('T')[0]
        : undefined,
    } as Equipment);
    onOpenChange(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le matériel</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Numéro de série *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber || ''}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Catégorie *</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type || ''}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Année d'achat</Label>
              <Select
                value={formData.purchaseYear?.toString() || ''}
                onValueChange={(value) => setFormData({ ...formData, purchaseYear: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amortizationEndDate">Fin d'amortissement</Label>
              <Input
                id="amortizationEndDate"
                type="date"
                value={formData.amortizationEndDate || ''}
                onChange={(e) => setFormData({ ...formData, amortizationEndDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="border-t border-border pt-4 mt-2">
            <h4 className="font-medium mb-4">Affectation</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Statut *</Label>
                <Select
                  value={formData.status || 'available'}
                  onValueChange={(value) => {
                    const newStatus = value as Equipment['status'];
                    setFormData({ 
                      ...formData, 
                      status: newStatus,
                      collaboratorId: newStatus !== 'assigned' ? undefined : formData.collaboratorId,
                      companyId: newStatus !== 'assigned' ? undefined : formData.companyId,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Société</Label>
                <Select
                  value={formData.companyId || ''}
                  onValueChange={(value) => setFormData({ ...formData, companyId: value, collaboratorId: undefined })}
                  disabled={formData.status !== 'assigned'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label>Collaborateur</Label>
              <Select
                value={formData.collaboratorId || ''}
                onValueChange={(value) => {
                  const collab = collaborators.find(c => c.id === value);
                  setFormData({ 
                    ...formData, 
                    collaboratorId: value,
                    companyId: collab ? companies.find(co => co.name === collab.filiale)?.id : formData.companyId,
                  });
                }}
                disabled={formData.status !== 'assigned'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un collaborateur" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {collaborators
                    .filter(c => c.status === 'active')
                    .filter(c => !formData.companyId || companies.find(co => co.id === formData.companyId)?.name === c.filiale)
                    .map((collab) => (
                      <SelectItem key={collab.id} value={collab.id}>
                        {collab.prenom} {collab.nom} - {collab.filiale}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
