import { MainLayout } from '@/components/Layout/MainLayout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { EquipmentTable } from '@/components/Equipment/EquipmentTable';
import { equipment, users, companies, handovers } from '@/data/mockData';
import { Package, CheckCircle, AlertTriangle, Users, Building2, FileSignature } from 'lucide-react';

export default function Dashboard() {
  const availableCount = equipment.filter(e => e.status === 'available').length;
  const assignedCount = equipment.filter(e => e.status === 'assigned').length;
  const maintenanceCount = equipment.filter(e => e.status === 'maintenance').length;
  
  const recentEquipment = equipment.slice(0, 5);

  return (
    <MainLayout>
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-subtitle">Vue d'ensemble de votre parc matériel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <StatCard
          title="Total matériel"
          value={equipment.length}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="Disponible"
          value={availableCount}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Attribué"
          value={assignedCount}
          icon={FileSignature}
          variant="default"
        />
        <StatCard
          title="Maintenance"
          value={maintenanceCount}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Sociétés"
          value={companies.length}
          icon={Building2}
          variant="default"
        />
        <StatCard
          title="Utilisateurs"
          value={users.length}
          icon={Users}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Matériel récent</h2>
          </div>
          <EquipmentTable 
            equipment={recentEquipment} 
            users={users} 
            companies={companies}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Dernières remises</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {handovers.slice(0, 5).map((handover) => {
              const eq = equipment.find(e => e.id === handover.equipmentId);
              const user = users.find(u => u.id === handover.userId);
              const company = companies.find(c => c.id === handover.companyId);
              
              return (
                <div key={handover.id} className="p-4 animate-fade-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{eq?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{company?.name}</p>
                    </div>
                    <span className={`badge ${handover.type === 'assignment' ? 'badge-success' : 'badge-info'}`}>
                      {handover.type === 'assignment' ? 'Attribution' : 'Retour'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(handover.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              );
            })}
            {handovers.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                Aucune remise récente
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
