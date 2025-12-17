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
  description?: string;
  status: 'available' | 'assigned' | 'maintenance';
  assignedTo?: string;
  assignedDate?: string;
  companyId?: string;
  signature?: string;
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
