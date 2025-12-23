import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { equipment as allEquipment, companies } from '@/data/mockData';
import { collaboratorProfiles } from '@/data/collaboratorData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, User, Building2, Package, Edit, Check, X, ChevronsUpDown } from 'lucide-react';
import { Equipment } from '@/types/equipment';
import { CollaboratorProfile } from '@/types/collaborator';
import { EquipmentSearch } from '@/components/Equipment/EquipmentSearch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function CollaboratorEquipmentPage() {
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCollaborator, setSelectedCollaborator] = useState<CollaboratorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [equipment, setEquipment] = useState(allEquipment);
  const [collaboratorEquipment, setCollaboratorEquipment] = useState<Equipment[]>([]);
  const { toast } = useToast();

  // Filter collaborators who have equipment
  const collaboratorsWithEquipment = useMemo(() => {
    return collaboratorProfiles.filter((collab) => {
      const hasEquipment = equipment.some(
        (e) => e.collaboratorId === collab.id || collab.equipmentIds.includes(e.id)
      );
      const matchesCompany = filterCompany === 'all' || collab.filiale === companies.find(c => c.id === filterCompany)?.name;
      return hasEquipment && matchesCompany && collab.status === 'active';
    });
  }, [filterCompany, equipment]);

  // All active collaborators for search
  const allActiveCollaborators = useMemo(() => {
    return collaboratorProfiles.filter((collab) => {
      const matchesCompany = filterCompany === 'all' || collab.filiale === companies.find(c => c.id === filterCompany)?.name;
      return matchesCompany && collab.status === 'active';
    });
  }, [filterCompany]);

  const handleSelectCollaborator = (collab: CollaboratorProfile) => {
    setSelectedCollaborator(collab);
    setSearchOpen(false);
    setSearchValue(`${collab.prenom} ${collab.nom}`);
    
    const collabEquip = equipment.filter(
      (e) => e.collaboratorId === collab.id || collab.equipmentIds.includes(e.id)
    );
    setCollaboratorEquipment(collabEquip);
    setIsEditing(false);
  };

  const handleAddEquipment = (item: Equipment) => {
    if (!selectedCollaborator) return;
    
    const updatedEquipment = equipment.map((e) =>
      e.id === item.id
        ? {
            ...e,
            status: 'assigned' as const,
            collaboratorId: selectedCollaborator.id,
            companyId: companies.find((c) => c.name === selectedCollaborator.filiale)?.id,
            assignedDate: new Date().toISOString().split('T')[0],
          }
        : e
    );
    
    setEquipment(updatedEquipment);
    setCollaboratorEquipment([...collaboratorEquipment, { ...item, status: 'assigned', collaboratorId: selectedCollaborator.id }]);
    
    toast({
      title: 'Matériel ajouté',
      description: `${item.name} attribué à ${selectedCollaborator.prenom} ${selectedCollaborator.nom}`,
    });
  };

  const handleRemoveEquipment = (item: Equipment) => {
    const updatedEquipment = equipment.map((e) =>
      e.id === item.id
        ? {
            ...e,
            status: 'available' as const,
            collaboratorId: undefined,
            companyId: undefined,
            assignedDate: undefined,
          }
        : e
    );
    
    setEquipment(updatedEquipment);
    setCollaboratorEquipment(collaboratorEquipment.filter((e) => e.id !== item.id));
    
    toast({
      title: 'Matériel retiré',
      description: `${item.name} est maintenant disponible`,
    });
  };

  const availableEquipment = equipment.filter((e) => e.status === 'available');

  return (
    <MainLayout>
      <div className="page-header">
        <h1 className="page-title">Collaborateurs équipés</h1>
        <p className="page-subtitle">Consultez et modifiez le matériel attribué aux collaborateurs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel - Search and filters */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Société</label>
                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les sociétés" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">Toutes les sociétés</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Rechercher un collaborateur</label>
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={searchOpen}
                      className="w-full justify-between"
                    >
                      {searchValue || "Sélectionner..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 bg-popover">
                    <Command>
                      <CommandInput placeholder="Rechercher..." />
                      <CommandList>
                        <CommandEmpty>Aucun collaborateur trouvé.</CommandEmpty>
                        <CommandGroup>
                          {allActiveCollaborators.map((collab) => (
                            <CommandItem
                              key={collab.id}
                              value={`${collab.prenom} ${collab.nom}`}
                              onSelect={() => handleSelectCollaborator(collab)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCollaborator?.id === collab.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{collab.prenom} {collab.nom}</span>
                                <span className="text-xs text-muted-foreground">{collab.filiale}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Collaborateurs avec matériel
                <Badge variant="secondary" className="ml-auto">
                  {collaboratorsWithEquipment.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {collaboratorsWithEquipment.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun collaborateur trouvé
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {collaboratorsWithEquipment.map((collab) => {
                    const collabEquipCount = equipment.filter(
                      (e) => e.collaboratorId === collab.id
                    ).length;
                    return (
                      <div
                        key={collab.id}
                        onClick={() => handleSelectCollaborator(collab)}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-colors",
                          selectedCollaborator?.id === collab.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{collab.prenom} {collab.nom}</p>
                            <p className="text-sm text-muted-foreground">{collab.filiale}</p>
                          </div>
                          <Badge variant="outline">
                            <Package className="w-3 h-3 mr-1" />
                            {collabEquipCount}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right panel - Collaborator details */}
        <div className="lg:col-span-2">
          {selectedCollaborator ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {selectedCollaborator.prenom} {selectedCollaborator.nom}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedCollaborator.poste} - {selectedCollaborator.filiale}
                  </p>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Terminer
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedCollaborator.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Direction</p>
                    <p className="font-medium">{selectedCollaborator.direction}</p>
                  </div>
                </div>

                {isEditing && (
                  <div>
                    <h4 className="font-medium mb-3">Ajouter du matériel</h4>
                    <EquipmentSearch
                      equipment={availableEquipment}
                      onSelect={handleAddEquipment}
                      selectedIds={collaboratorEquipment.map((e) => e.id)}
                    />
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Matériel attribué
                    <Badge variant="secondary">{collaboratorEquipment.length}</Badge>
                  </h4>
                  
                  {collaboratorEquipment.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
                      Aucun matériel attribué
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {collaboratorEquipment.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="font-mono">{item.serialNumber}</span>
                                <span>•</span>
                                <span>{item.category}</span>
                              </div>
                            </div>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveEquipment(item)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Sélectionnez un collaborateur</h3>
                <p className="text-sm text-muted-foreground">
                  Utilisez la recherche ou cliquez sur un collaborateur dans la liste
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
