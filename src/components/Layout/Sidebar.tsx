import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileSignature, 
  Building2, 
  Users, 
  FileDown,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Matériel', href: '/equipment', icon: Package },
  { name: 'Maintenance', href: '/maintenance', icon: Package },
  { name: 'Remise', href: '/handover', icon: FileSignature },
  { name: 'Collaborateurs équipés', href: '/collaborateurs-equipes', icon: Users },
  { name: 'Validation Support', href: '/support', icon: Users },
  { name: 'Gestion Départs', href: '/depart', icon: FileDown },
  { name: 'Sociétés', href: '/companies', icon: Building2 },
  { name: 'Exports', href: '/exports', icon: FileDown },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col" style={{ background: 'var(--gradient-sidebar)' }}>
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">GestMat</h1>
            <p className="text-xs text-sidebar-foreground/60">Gestion de matériel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Link to="/settings" className="sidebar-link">
          <Settings className="w-5 h-5" />
          <span>Paramètres</span>
        </Link>
      </div>
    </aside>
  );
}
