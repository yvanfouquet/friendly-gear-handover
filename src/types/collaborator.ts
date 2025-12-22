export interface Software {
  id: string;
  name: string;
  rights: string;
}

export interface CollaboratorRequest {
  id: string;
  type: 'replacement' | 'new';
  replacedEmail?: string;
  filiale: string;
  direction: string;
  poste: string;
  nom: string;
  prenom: string;
  email?: string;
  groupesMail: string[];
  pcType: 'fixe' | 'portable' | 'tablette';
  ecransSupplementaires: 0 | 1 | 2 | 3;
  telephoneType: 'fixe' | 'mobile' | 'both' | 'none';
  autresMateriels: string;
  logiciels: Software[];
  status: 'pending' | 'validated' | 'equipment_assigned' | 'ready' | 'completed';
  createdAt: string;
  validatedAt?: string;
  validatedBy?: string;
}

export interface CollaboratorProfile {
  id: string;
  requestId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  filiale: string;
  direction: string;
  poste: string;
  groupesMail: string[];
  logiciels: Software[];
  equipmentIds: string[];
  photo?: string;
  createdAt: string;
  status: 'active' | 'leaving' | 'departed';
}

export interface EquipmentAssignment {
  equipmentId: string;
  collaboratorId: string;
  assignedAt: string;
  validated: boolean;
  validatedAt?: string;
}

export interface ReturnRequest {
  id: string;
  collaboratorId: string;
  type: 'definitive' | 'temporary' | 'transfer';
  departureDate: string;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'completed';
  equipmentReturns: EquipmentReturn[];
  signature?: string;
  signedAt?: string;
}

export interface EquipmentReturn {
  equipmentId: string;
  status: 'ok' | 'maintenance' | 'rebut';
  received: boolean;
  notes?: string;
  photo?: string;
}

export interface HandoverDocument {
  id: string;
  type: 'handover' | 'return';
  collaboratorId: string;
  equipmentIds: string[];
  signature: string;
  createdAt: string;
  pdfUrl?: string;
}
