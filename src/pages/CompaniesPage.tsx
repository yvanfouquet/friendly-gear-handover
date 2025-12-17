import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { companies as initialCompanies, users, equipment } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Building2, Users, Package } from 'lucide-react';
import { Company } from '@/types/equipment';
import { useToast } from '@/hooks/use-toast';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', address: '' });
  const { toast } = useToast();

  const getCompanyStats = (companyId: string) => {
    const companyUsers = users.filter(u => u.companyId === companyId);
    const companyEquipment = equipment.filter(e => e.companyId === companyId);
    return { users: companyUsers.length, equipment: companyEquipment.length };
  };

  const handleAddCompany = () => {
    if (!newCompany.name) {
      toast({
        title: 'Erreur',
        description: 'Le nom de la société est requis',
        variant: 'destructive',
      });
      return;
    }

    const company: Company = {
      id: Date.now().toString(),
      ...newCompany,
    };

    setCompanies([...companies, company]);
    setNewCompany({ name: '', address: '' });
    setIsDialogOpen(false);
    toast({
      title: 'Succès',
      description: 'Société ajoutée avec succès',
    });
  };

  return (
    <MainLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Sociétés</h1>
          <p className="page-subtitle">Gérez vos sociétés clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Nouvelle société</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="Nom de la société"
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  placeholder="Adresse complète"
                />
              </div>
              <Button onClick={handleAddCompany} className="w-full">
                Ajouter la société
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => {
          const stats = getCompanyStats(company.id);
          return (
            <Card key={company.id} className="animate-slide-up hover:shadow-elevated transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{company.name}</p>
                    {company.address && (
                      <p className="text-sm text-muted-foreground font-normal">{company.address}</p>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>{stats.users}</strong> utilisateurs
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>{stats.equipment}</strong> matériels
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </MainLayout>
  );
}
