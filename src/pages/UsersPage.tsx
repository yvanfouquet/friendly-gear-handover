import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { users as initialUsers, companies, equipment } from '@/data/mockData';
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
import { Plus, Search, Mail, Package } from 'lucide-react';
import { User } from '@/types/equipment';
import { useToast } from '@/hooks/use-toast';

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', companyId: '' });
  const { toast } = useToast();

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = filterCompany === 'all' || user.companyId === filterCompany;
    return matchesSearch && matchesCompany;
  });

  const getUserEquipmentCount = (userId: string) => {
    return equipment.filter(e => e.assignedTo === userId).length;
  };

  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || '-';
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.companyId) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      ...newUser,
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', companyId: '' });
    setIsDialogOpen(false);
    toast({
      title: 'Succès',
      description: 'Utilisateur ajouté avec succès',
    });
  };

  return (
    <MainLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Utilisateurs</h1>
          <p className="page-subtitle">Gérez les utilisateurs de vos sociétés</p>
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
              <DialogTitle>Nouvel utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <Label htmlFor="company">Société *</Label>
                <Select
                  value={newUser.companyId}
                  onValueChange={(value) => setNewUser({ ...newUser, companyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une société" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} className="w-full">
                Ajouter l'utilisateur
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par société" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Toutes les sociétés</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Société</th>
              <th>Matériel attribué</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="animate-fade-in">
                <td className="font-medium">{user.name}</td>
                <td>
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                </td>
                <td>{getCompanyName(user.companyId)}</td>
                <td>
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    {getUserEquipmentCount(user.id)} élément(s)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>
    </MainLayout>
  );
}
