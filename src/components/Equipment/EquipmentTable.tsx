import { Equipment, User, Company } from '@/types/equipment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, FileSignature } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EquipmentTableProps {
  equipment: Equipment[];
  users: User[];
  companies: Company[];
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (equipment: Equipment) => void;
  onAssign?: (equipment: Equipment) => void;
}

const statusConfig = {
  available: { label: 'Disponible', className: 'badge-success' },
  assigned: { label: 'Attribué', className: 'badge-primary' },
  maintenance: { label: 'Maintenance', className: 'badge-warning' },
};

export function EquipmentTable({ equipment, users, companies, onEdit, onDelete, onAssign }: EquipmentTableProps) {
  const getUserName = (userId?: string) => {
    if (!userId) return '-';
    const user = users.find(u => u.id === userId);
    return user?.name || '-';
  };

  const getCompanyName = (companyId?: string) => {
    if (!companyId) return '-';
    const company = companies.find(c => c.id === companyId);
    return company?.name || '-';
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <table className="data-table">
        <thead>
          <tr>
            <th>Matériel</th>
            <th>N° Série</th>
            <th>Catégorie</th>
            <th>Statut</th>
            <th>Attribué à</th>
            <th>Société</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((item) => {
            const status = statusConfig[item.status];
            return (
              <tr key={item.id} className="animate-fade-in">
                <td className="font-medium">{item.name}</td>
                <td className="font-mono text-muted-foreground">{item.serialNumber}</td>
                <td>{item.category}</td>
                <td>
                  <span className={`badge ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td>{getUserName(item.assignedTo)}</td>
                <td>{getCompanyName(item.companyId)}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={() => onEdit?.(item)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      {item.status === 'available' && (
                        <DropdownMenuItem onClick={() => onAssign?.(item)}>
                          <FileSignature className="w-4 h-4 mr-2" />
                          Attribuer
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onDelete?.(item)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {equipment.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          Aucun matériel trouvé
        </div>
      )}
    </div>
  );
}
