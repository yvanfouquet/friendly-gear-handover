import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { equipment as allEquipment, companies, users } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Wrench, Search, Package, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Equipment } from '@/types/equipment';

type MaintenanceStatus = 'en_attente' | 'en_cours' | 'ok' | 'rebut';

interface MaintenanceEquipment extends Equipment {
  maintenanceStatus?: MaintenanceStatus;
}

const maintenanceStatusConfig: Record<MaintenanceStatus, { label: string; className: string; icon: React.ReactNode }> = {
  en_attente: { label: 'En attente', className: 'badge-warning', icon: <AlertTriangle className="w-3 h-3" /> },
  en_cours: { label: 'En cours', className: 'badge-info', icon: <Wrench className="w-3 h-3" /> },
  ok: { label: 'OK', className: 'badge-success', icon: <CheckCircle2 className="w-3 h-3" /> },
  rebut: { label: 'Rebut', className: 'badge-destructive', icon: <XCircle className="w-3 h-3" /> },
};

export default function MaintenancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCompany, setFilterCompany] = useState<string>('all');

  // Simulate maintenance equipment with status
  const maintenanceEquipment: MaintenanceEquipment[] = useMemo(() => {
    return allEquipment
      .filter(e => e.status === 'maintenance')
      .map((e, index) => ({
        ...e,
        maintenanceStatus: (['en_attente', 'en_cours', 'ok', 'rebut'] as MaintenanceStatus[])[index % 4],
      }));
  }, []);

  const filteredEquipment = useMemo(() => {
    return maintenanceEquipment.filter(eq => {
      const matchesSearch = 
        eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || eq.maintenanceStatus === filterStatus;
      const matchesCompany = filterCompany === 'all' || eq.companyId === filterCompany;
      return matchesSearch && matchesStatus && matchesCompany;
    });
  }, [maintenanceEquipment, searchTerm, filterStatus, filterCompany]);

  const getUser = (userId?: string) => {
    if (!userId) return null;
    return users.find(u => u.id === userId);
  };

  const getCompany = (companyId?: string) => {
    if (!companyId) return null;
    return companies.find(c => c.id === companyId);
  };

  const statusCounts = useMemo(() => {
    return {
      en_attente: maintenanceEquipment.filter(e => e.maintenanceStatus === 'en_attente').length,
      en_cours: maintenanceEquipment.filter(e => e.maintenanceStatus === 'en_cours').length,
      ok: maintenanceEquipment.filter(e => e.maintenanceStatus === 'ok').length,
      rebut: maintenanceEquipment.filter(e => e.maintenanceStatus === 'rebut').length,
    };
  }, [maintenanceEquipment]);

  return (
    <MainLayout>
      <div className="page-header">
        <h1 className="page-title">Maintenance</h1>
        <p className="page-subtitle">Gérez les matériels en maintenance</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts.en_attente}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts.en_cours}</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts.ok}</p>
                <p className="text-sm text-muted-foreground">Réparé</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statusCounts.rebut}</p>
                <p className="text-sm text-muted-foreground">Rebut</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Nom ou référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Statut</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="ok">OK</SelectItem>
                  <SelectItem value="rebut">Rebut</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Filiale</label>
              <Select value={filterCompany} onValueChange={setFilterCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les filiales" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">Toutes les filiales</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Matériels en maintenance
            <Badge variant="secondary" className="ml-auto">
              {filteredEquipment.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEquipment.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun matériel en maintenance</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Filiale</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((eq) => {
                  const user = getUser(eq.assignedTo);
                  const company = getCompany(eq.companyId);
                  const statusConfig = maintenanceStatusConfig[eq.maintenanceStatus || 'en_attente'];
                  
                  return (
                    <TableRow key={eq.id}>
                      <TableCell className="font-medium">{eq.name}</TableCell>
                      <TableCell className="font-mono text-sm">{eq.serialNumber}</TableCell>
                      <TableCell>{company?.name || '-'}</TableCell>
                      <TableCell>{user?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig.className} flex items-center gap-1 w-fit`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
