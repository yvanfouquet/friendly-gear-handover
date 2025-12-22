export interface Company {
  id: string;
  name: string;
  address?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  companyId: string;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  type?: string; // PC fixe, portable, tablette, écran, téléphone, etc.
  description?: string;
  status: 'available' | 'assigned' | 'maintenance' | 'rebut';
  assignedTo?: string;
  assignedDate?: string;
  companyId?: string;
  collaboratorId?: string;
  signature?: string;
  purchaseYear?: number;
  amortizationEndDate?: string;
  interventions?: Intervention[];
}

export interface Intervention {
  id: string;
  date: string;
  type: 'maintenance' | 'repair' | 'upgrade';
  description: string;
  technician?: string;
}

export interface Handover {
  id: string;
  equipmentId: string;
  userId: string;
  companyId: string;
  date: string;
  signature: string;
  type: 'assignment' | 'return';
  notes?: string;
}
