import { CollaboratorRequest, CollaboratorProfile, ReturnRequest, HandoverDocument } from '@/types/collaborator';

export const filiales = [
  'TechCorp SAS',
  'InnoSolutions',
  'DataPrime',
  'CloudFirst',
  'DevFactory',
];

export const directions = [
  'Direction Générale',
  'Direction Technique',
  'Direction Commerciale',
  'Direction RH',
  'Direction Financière',
  'Direction Marketing',
  'DSI',
];

export const groupesMailOptions = [
  'all-company@entreprise.fr',
  'tech-team@entreprise.fr',
  'marketing@entreprise.fr',
  'sales@entreprise.fr',
  'hr@entreprise.fr',
  'finance@entreprise.fr',
  'management@entreprise.fr',
  'devs@entreprise.fr',
];

export const logicielsDisponibles = [
  'Microsoft 365',
  'Slack',
  'Jira',
  'Confluence',
  'GitLab',
  'VS Code',
  'Figma',
  'Adobe Creative Suite',
  'SAP',
  'Salesforce',
  'Zendesk',
  'Teams',
  'Zoom',
];

export const droitsOptions = [
  'Lecture seule',
  'Lecture/Écriture',
  'Administrateur',
  'Super Admin',
];

export let collaboratorRequests: CollaboratorRequest[] = [
  {
    id: 'req-001',
    type: 'new',
    filiale: 'TechCorp SAS',
    direction: 'Direction Technique',
    poste: 'Développeur Full Stack',
    nom: 'Lefevre',
    prenom: 'Antoine',
    groupesMail: ['tech-team@entreprise.fr', 'devs@entreprise.fr'],
    pcType: 'portable',
    ecransSupplementaires: 2,
    telephoneType: 'mobile',
    autresMateriels: 'Casque audio, webcam HD',
    logiciels: [
      { id: '1', name: 'Microsoft 365', rights: 'Lecture/Écriture' },
      { id: '2', name: 'GitLab', rights: 'Lecture/Écriture' },
      { id: '3', name: 'VS Code', rights: 'Administrateur' },
      { id: '4', name: 'Slack', rights: 'Lecture/Écriture' },
    ],
    status: 'pending',
    createdAt: '2024-03-10T09:00:00Z',
  },
  {
    id: 'req-002',
    type: 'replacement',
    replacedEmail: 'jean.dupont@techcorp.fr',
    filiale: 'TechCorp SAS',
    direction: 'Direction Commerciale',
    poste: 'Commercial Senior',
    nom: 'Dubois',
    prenom: 'Claire',
    groupesMail: ['sales@entreprise.fr', 'all-company@entreprise.fr'],
    pcType: 'portable',
    ecransSupplementaires: 1,
    telephoneType: 'both',
    autresMateriels: '',
    logiciels: [
      { id: '1', name: 'Microsoft 365', rights: 'Lecture/Écriture' },
      { id: '2', name: 'Salesforce', rights: 'Lecture/Écriture' },
    ],
    status: 'validated',
    createdAt: '2024-03-08T14:30:00Z',
    validatedAt: '2024-03-09T10:00:00Z',
    validatedBy: 'Admin Support',
  },
];

export let collaboratorProfiles: CollaboratorProfile[] = [
  {
    id: 'collab-001',
    requestId: 'req-old-001',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@techcorp.fr',
    telephone: '+33 6 12 34 56 78',
    filiale: 'TechCorp SAS',
    direction: 'Direction Commerciale',
    poste: 'Commercial Senior',
    groupesMail: ['sales@entreprise.fr', 'all-company@entreprise.fr'],
    logiciels: [
      { id: '1', name: 'Microsoft 365', rights: 'Lecture/Écriture' },
      { id: '2', name: 'Salesforce', rights: 'Lecture/Écriture' },
    ],
    equipmentIds: ['1'],
    createdAt: '2023-06-15T09:00:00Z',
    status: 'active',
  },
  {
    id: 'collab-002',
    requestId: 'req-old-002',
    nom: 'Martin',
    prenom: 'Marie',
    email: 'marie.martin@techcorp.fr',
    telephone: '+33 6 98 76 54 32',
    filiale: 'TechCorp SAS',
    direction: 'Direction Technique',
    poste: 'Chef de projet',
    groupesMail: ['tech-team@entreprise.fr', 'management@entreprise.fr'],
    logiciels: [
      { id: '1', name: 'Microsoft 365', rights: 'Lecture/Écriture' },
      { id: '2', name: 'Jira', rights: 'Administrateur' },
      { id: '3', name: 'Confluence', rights: 'Lecture/Écriture' },
    ],
    equipmentIds: ['2'],
    createdAt: '2023-09-01T09:00:00Z',
    status: 'active',
  },
  {
    id: 'collab-003',
    requestId: 'req-old-003',
    nom: 'Bernard',
    prenom: 'Pierre',
    email: 'pierre.bernard@innosolutions.fr',
    filiale: 'InnoSolutions',
    direction: 'Direction Technique',
    poste: 'Architecte Solutions',
    groupesMail: ['tech-team@entreprise.fr'],
    logiciels: [
      { id: '1', name: 'Microsoft 365', rights: 'Lecture/Écriture' },
      { id: '2', name: 'VS Code', rights: 'Administrateur' },
    ],
    equipmentIds: ['4'],
    createdAt: '2023-11-20T09:00:00Z',
    status: 'active',
  },
];

export let returnRequests: ReturnRequest[] = [];

export let handoverDocuments: HandoverDocument[] = [];

// Helper functions for managing data
export const addCollaboratorRequest = (request: Omit<CollaboratorRequest, 'id' | 'createdAt' | 'status'>) => {
  const newRequest: CollaboratorRequest = {
    ...request,
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  collaboratorRequests = [...collaboratorRequests, newRequest];
  return newRequest;
};

export const updateCollaboratorRequest = (id: string, updates: Partial<CollaboratorRequest>) => {
  collaboratorRequests = collaboratorRequests.map(req =>
    req.id === id ? { ...req, ...updates } : req
  );
};

export const getCollaboratorByEmail = (email: string) => {
  return collaboratorProfiles.find(c => c.email.toLowerCase() === email.toLowerCase());
};

export const addReturnRequest = (request: Omit<ReturnRequest, 'id' | 'createdAt' | 'status'>) => {
  const newRequest: ReturnRequest = {
    ...request,
    id: `return-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  returnRequests = [...returnRequests, newRequest];
  return newRequest;
};

export const updateReturnRequest = (id: string, updates: Partial<ReturnRequest>) => {
  returnRequests = returnRequests.map(req =>
    req.id === id ? { ...req, ...updates } : req
  );
};

export const addHandoverDocument = (doc: Omit<HandoverDocument, 'id' | 'createdAt'>) => {
  const newDoc: HandoverDocument = {
    ...doc,
    id: `doc-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  handoverDocuments = [...handoverDocuments, newDoc];
  return newDoc;
};
