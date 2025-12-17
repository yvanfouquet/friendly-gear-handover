import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { equipment, users, companies, handovers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileDown, Building2, User, Package, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExportsPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const { toast } = useToast();

  const filteredUsers = users.filter(u => !selectedCompany || u.companyId === selectedCompany);

  const getEquipmentByCompany = (companyId: string) => {
    return equipment.filter(e => e.companyId === companyId);
  };

  const getEquipmentByUser = (userId: string) => {
    return equipment.filter(e => e.assignedTo === userId);
  };

  const generateCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({
        title: 'Aucune donnée',
        description: 'Aucun matériel à exporter',
        variant: 'destructive',
      });
      return;
    }

    const headers = Object.keys(data[0]).join(';');
    const rows = data.map(item => Object.values(item).join(';'));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();

    toast({
      title: 'Export réussi',
      description: `${data.length} éléments exportés`,
    });
  };

  const exportByCompany = () => {
    if (!selectedCompany) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une société',
        variant: 'destructive',
      });
      return;
    }

    const company = companies.find(c => c.id === selectedCompany);
    const data = getEquipmentByCompany(selectedCompany).map(e => {
      const user = users.find(u => u.id === e.assignedTo);
      return {
        Nom: e.name,
        'N° Série': e.serialNumber,
        Catégorie: e.category,
        Statut: e.status,
        'Attribué à': user?.name || '-',
        'Date attribution': e.assignedDate || '-',
      };
    });

    generateCSV(data, `materiel_${company?.name.replace(/\s+/g, '_')}`);
  };

  const exportByUser = () => {
    if (!selectedUser) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un utilisateur',
        variant: 'destructive',
      });
      return;
    }

    const user = users.find(u => u.id === selectedUser);
    const company = companies.find(c => c.id === user?.companyId);
    const data = getEquipmentByUser(selectedUser).map(e => ({
      Nom: e.name,
      'N° Série': e.serialNumber,
      Catégorie: e.category,
      'Date attribution': e.assignedDate || '-',
      Société: company?.name || '-',
    }));

    generateCSV(data, `materiel_${user?.name.replace(/\s+/g, '_')}`);
  };

  const exportAll = () => {
    const data = equipment.map(e => {
      const user = users.find(u => u.id === e.assignedTo);
      const company = companies.find(c => c.id === e.companyId);
      return {
        Nom: e.name,
        'N° Série': e.serialNumber,
        Catégorie: e.category,
        Statut: e.status,
        'Attribué à': user?.name || '-',
        Société: company?.name || '-',
        'Date attribution': e.assignedDate || '-',
      };
    });

    generateCSV(data, 'materiel_complet');
  };

  const exportHandovers = () => {
    const data = handovers.map(h => {
      const eq = equipment.find(e => e.id === h.equipmentId);
      const user = users.find(u => u.id === h.userId);
      const company = companies.find(c => c.id === h.companyId);
      return {
        Date: h.date,
        Type: h.type === 'assignment' ? 'Attribution' : 'Retour',
        Matériel: eq?.name || '-',
        'N° Série': eq?.serialNumber || '-',
        Utilisateur: user?.name || '-',
        Société: company?.name || '-',
        Notes: h.notes || '-',
      };
    });

    generateCSV(data, 'historique_remises');
  };

  return (
    <MainLayout>
      <div className="page-header">
        <h1 className="page-title">Exports</h1>
        <p className="page-subtitle">Exportez vos données en CSV</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Export par société
            </CardTitle>
            <CardDescription>
              Exportez tout le matériel attribué à une société
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une société" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name} ({getEquipmentByCompany(company.id).length} matériels)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportByCompany} className="w-full" disabled={!selectedCompany}>
              <FileDown className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Export par utilisateur
            </CardTitle>
            <CardDescription>
              Exportez tout le matériel attribué à un utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un utilisateur" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {filteredUsers.map((user) => {
                  const company = companies.find(c => c.id === user.companyId);
                  return (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {company?.name} ({getEquipmentByUser(user.id).length})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button onClick={exportByUser} className="w-full" disabled={!selectedUser}>
              <FileDown className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Export complet
            </CardTitle>
            <CardDescription>
              Exportez l'intégralité de votre parc matériel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={exportAll} className="w-full">
              <FileDown className="w-4 h-4 mr-2" />
              Exporter tout le matériel ({equipment.length})
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Historique des remises
            </CardTitle>
            <CardDescription>
              Exportez l'historique de toutes les remises de matériel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={exportHandovers} className="w-full">
              <FileDown className="w-4 h-4 mr-2" />
              Exporter l'historique ({handovers.length})
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
