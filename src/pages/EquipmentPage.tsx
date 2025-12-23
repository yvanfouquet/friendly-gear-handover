import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { EquipmentTable } from '@/components/Equipment/EquipmentTable';
import { EquipmentEditDialog } from '@/components/Equipment/EquipmentEditDialog';
import { CSVImport } from '@/components/Equipment/CSVImport';
import { OCRSearch } from '@/components/Equipment/OCRSearch';
import { equipment as initialEquipment, users, companies, categories } from '@/data/mockData';
import { collaboratorProfiles } from '@/data/collaboratorData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { Equipment } from '@/types/equipment';
import { useToast } from '@/hooks/use-toast';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState(initialEquipment);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    serialNumber: '',
    category: '',
    description: '',
  });
  const { toast } = useToast();

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = filterCompany === 'all' || item.companyId === filterCompany;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesCompany && matchesStatus;
  });

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.serialNumber || !newEquipment.category) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    const newItem: Equipment = {
      id: Date.now().toString(),
      ...newEquipment,
      status: 'available',
    };

    setEquipment([...equipment, newItem]);
    setNewEquipment({ name: '', serialNumber: '', category: '', description: '' });
    setIsDialogOpen(false);
    toast({
      title: 'Succès',
      description: 'Matériel ajouté avec succès',
    });
  };

  const handleDelete = (item: Equipment) => {
    setEquipment(equipment.filter(e => e.id !== item.id));
    toast({
      title: 'Supprimé',
      description: `${item.name} a été supprimé`,
    });
  };

  const handleCSVImport = (imported: Equipment[]) => {
    setEquipment([...equipment, ...imported]);
  };

  const handleOCRSearch = (serialNumber: string) => {
    setSearchQuery(serialNumber);
  };

  const handleEdit = (item: Equipment) => {
    setEditingEquipment(item);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedEquipment: Equipment) => {
    setEquipment(equipment.map(e => e.id === updatedEquipment.id ? updatedEquipment : e));
    toast({
      title: 'Modifié',
      description: `${updatedEquipment.name} a été mis à jour`,
    });
  };

  return (
    <MainLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Matériel</h1>
          <p className="page-subtitle">Gérez votre parc matériel</p>
        </div>
        <div className="flex gap-2">
          <CSVImport onImport={handleCSVImport} />
          <OCRSearch onSearch={handleOCRSearch} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Nouveau matériel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                  placeholder="MacBook Pro 14&quot;"
                />
              </div>
              <div>
                <Label htmlFor="serial">Numéro de série *</Label>
                <Input
                  id="serial"
                  value={newEquipment.serialNumber}
                  onChange={(e) => setNewEquipment({ ...newEquipment, serialNumber: e.target.value })}
                  placeholder="MBP-2024-001"
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={newEquipment.category}
                  onValueChange={(value) => setNewEquipment({ ...newEquipment, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newEquipment.description}
                  onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                  placeholder="Description optionnelle"
                />
              </div>
              <Button onClick={handleAddEquipment} className="w-full">
                Ajouter le matériel
              </Button>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Société" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Toutes les sociétés</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="assigned">Attribué</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <EquipmentTable
        equipment={filteredEquipment}
        users={users}
        companies={companies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EquipmentEditDialog
        equipment={editingEquipment}
        companies={companies}
        collaborators={collaboratorProfiles}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveEdit}
      />
    </MainLayout>
  );
}
