import { Company, User, Equipment, Handover } from '@/types/equipment';

export const companies: Company[] = [
  { id: '1', name: 'TechCorp SAS', address: '15 Rue de la Paix, 75001 Paris' },
  { id: '2', name: 'InnoSolutions', address: '42 Avenue des Champs-Élysées, 75008 Paris' },
  { id: '3', name: 'DataPrime', address: '8 Boulevard Haussmann, 75009 Paris' },
];

export const users: User[] = [
  { id: '1', name: 'Jean Dupont', email: 'jean.dupont@techcorp.fr', companyId: '1' },
  { id: '2', name: 'Marie Martin', email: 'marie.martin@techcorp.fr', companyId: '1' },
  { id: '3', name: 'Pierre Bernard', email: 'pierre.bernard@innosolutions.fr', companyId: '2' },
  { id: '4', name: 'Sophie Leroy', email: 'sophie.leroy@dataprime.fr', companyId: '3' },
  { id: '5', name: 'Thomas Moreau', email: 'thomas.moreau@dataprime.fr', companyId: '3' },
];

export const equipment: Equipment[] = [
  { id: '1', name: 'MacBook Pro 14"', serialNumber: 'MBP-2024-001', category: 'Ordinateur', status: 'assigned', assignedTo: '1', assignedDate: '2024-01-15', companyId: '1' },
  { id: '2', name: 'iPhone 15 Pro', serialNumber: 'IPH-2024-001', category: 'Téléphone', status: 'assigned', assignedTo: '2', assignedDate: '2024-02-01', companyId: '1' },
  { id: '3', name: 'Dell XPS 15', serialNumber: 'XPS-2024-001', category: 'Ordinateur', status: 'available' },
  { id: '4', name: 'iPad Pro 12.9"', serialNumber: 'IPD-2024-001', category: 'Tablette', status: 'assigned', assignedTo: '3', assignedDate: '2024-01-20', companyId: '2' },
  { id: '5', name: 'Écran Dell 27"', serialNumber: 'MON-2024-001', category: 'Écran', status: 'maintenance' },
  { id: '6', name: 'Clavier Magic Keyboard', serialNumber: 'KBD-2024-001', category: 'Accessoire', status: 'available' },
  { id: '7', name: 'Souris MX Master 3', serialNumber: 'MOU-2024-001', category: 'Accessoire', status: 'assigned', assignedTo: '4', assignedDate: '2024-03-01', companyId: '3' },
  { id: '8', name: 'Casque Sony WH-1000XM5', serialNumber: 'AUD-2024-001', category: 'Audio', status: 'available' },
];

export const handovers: Handover[] = [
  { id: '1', equipmentId: '1', userId: '1', companyId: '1', date: '2024-01-15', signature: '', type: 'assignment', notes: 'Nouveau collaborateur' },
  { id: '2', equipmentId: '2', userId: '2', companyId: '1', date: '2024-02-01', signature: '', type: 'assignment' },
  { id: '3', equipmentId: '4', userId: '3', companyId: '2', date: '2024-01-20', signature: '', type: 'assignment', notes: 'Projet client' },
];

export const categories = [
  'Ordinateur',
  'Téléphone',
  'Tablette',
  'Écran',
  'Accessoire',
  'Audio',
  'Réseau',
  'Autre',
];
