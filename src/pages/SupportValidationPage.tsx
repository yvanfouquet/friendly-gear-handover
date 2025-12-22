import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  CheckCircle2, 
  Clock, 
  User, 
  Package, 
  Settings, 
  Eye,
  Link,
  FileSignature
} from 'lucide-react';
import { 
  collaboratorRequests, 
  updateCollaboratorRequest,
  collaboratorProfiles
} from '@/data/collaboratorData';
import { equipment } from '@/data/mockData';
import { CollaboratorRequest } from '@/types/collaborator';
import { Equipment } from '@/types/equipment';

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'badge-warning' },
  validated: { label: 'Validé', className: 'badge-info' },
  equipment_assigned: { label: 'Matériel assigné', className: 'badge-primary' },
  ready: { label: 'Prêt', className: 'badge-success' },
  completed: { label: 'Terminé', className: 'badge-success' },
};

export default function SupportValidationPage() {
  const [requests, setRequests] = useState<CollaboratorRequest[]>(collaboratorRequests);
  const [selectedRequest, setSelectedRequest] = useState<CollaboratorRequest | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [equipmentValidation, setEquipmentValidation] = useState<Record<string, boolean>>({});

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const validatedRequests = requests.filter(r => r.status === 'validated');
  const inProgressRequests = requests.filter(r => ['equipment_assigned', 'ready'].includes(r.status));
  const completedRequests = requests.filter(r => r.status === 'completed');

  const availableEquipment = equipment.filter(e => e.status === 'available');

  const getEquipmentForType = (type: string): Equipment[] => {
    const categoryMap: Record<string, string[]> = {
      'fixe': ['Ordinateur'],
      'portable': ['Ordinateur'],
      'tablette': ['Tablette'],
      'ecran': ['Écran'],
      'telephone': ['Téléphone'],
    };
    return availableEquipment.filter(e => categoryMap[type]?.includes(e.category));
  };

  const handleValidateRequest = (request: CollaboratorRequest) => {
    updateCollaboratorRequest(request.id, {
      status: 'validated',
      validatedAt: new Date().toISOString(),
      validatedBy: 'Admin Support',
    });
    setRequests(prev => prev.map(r => 
      r.id === request.id 
        ? { ...r, status: 'validated', validatedAt: new Date().toISOString(), validatedBy: 'Admin Support' }
        : r
    ));
    toast({
      title: 'Demande validée',
      description: `La demande pour ${request.prenom} ${request.nom} a été validée`,
    });
  };

  const handleAssignEquipment = () => {
    if (!selectedRequest || selectedEquipment.length === 0) return;

    updateCollaboratorRequest(selectedRequest.id, { status: 'equipment_assigned' });
    setRequests(prev => prev.map(r => 
      r.id === selectedRequest.id 
        ? { ...r, status: 'equipment_assigned' }
        : r
    ));
    
    setAssignDialogOpen(false);
    setSelectedEquipment([]);
    toast({
      title: 'Matériel assigné',
      description: `${selectedEquipment.length} matériel(s) assigné(s) à ${selectedRequest.prenom} ${selectedRequest.nom}`,
    });
  };

  const handleValidateEquipment = (equipmentId: string, validated: boolean) => {
    setEquipmentValidation(prev => ({ ...prev, [equipmentId]: validated }));
  };

  const handleGenerateHandover = (request: CollaboratorRequest) => {
    updateCollaboratorRequest(request.id, { status: 'ready' });
    setRequests(prev => prev.map(r => 
      r.id === request.id 
        ? { ...r, status: 'ready' }
        : r
    ));
    toast({
      title: 'Fiche de remise générée',
      description: 'Le lien de signature a été envoyé au collaborateur',
    });
    // Navigate to handover page would happen here
  };

  const toggleEquipmentSelection = (id: string) => {
    setSelectedEquipment(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const RequestCard = ({ request }: { request: CollaboratorRequest }) => (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">{request.prenom} {request.nom}</h3>
              <Badge className={statusConfig[request.status].className}>
                {statusConfig[request.status].label}
              </Badge>
              {request.type === 'replacement' && (
                <Badge variant="outline">Remplacement</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{request.poste} - {request.direction}</p>
            <p className="text-sm text-muted-foreground">{request.filiale}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="secondary">{request.pcType}</Badge>
              <Badge variant="secondary">{request.ecransSupplementaires} écran(s)</Badge>
              <Badge variant="secondary">{request.telephoneType}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Détails
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Demande de {request.prenom} {request.nom}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Filiale</p>
                      <p className="font-medium">{request.filiale}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Direction</p>
                      <p className="font-medium">{request.direction}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Poste</p>
                      <p className="font-medium">{request.poste}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{request.type}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Groupes mail</p>
                    <div className="flex flex-wrap gap-1">
                      {request.groupesMail.map(g => (
                        <Badge key={g} variant="outline">{g}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Matériel demandé</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge>PC {request.pcType}</Badge>
                      <Badge>{request.ecransSupplementaires} écran(s) supplémentaire(s)</Badge>
                      <Badge>Téléphone: {request.telephoneType}</Badge>
                    </div>
                    {request.autresMateriels && (
                      <p className="text-sm mt-2">{request.autresMateriels}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Logiciels</p>
                    <div className="space-y-1">
                      {request.logiciels.map(log => (
                        <div key={log.id} className="flex items-center gap-2">
                          <span>{log.name}</span>
                          <Badge variant="secondary" className="text-xs">{log.rights}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {request.status === 'pending' && (
              <Button size="sm" onClick={() => handleValidateRequest(request)}>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Valider
              </Button>
            )}

            {request.status === 'validated' && (
              <Button size="sm" onClick={() => {
                setSelectedRequest(request);
                setAssignDialogOpen(true);
              }}>
                <Link className="w-4 h-4 mr-1" />
                Assigner matériel
              </Button>
            )}

            {request.status === 'equipment_assigned' && (
              <Button size="sm" onClick={() => handleGenerateHandover(request)}>
                <FileSignature className="w-4 h-4 mr-1" />
                Générer remise
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="page-header">
        <h1 className="page-title">Validation Support</h1>
        <p className="page-subtitle">Gérez les demandes d'onboarding des collaborateurs</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{validatedRequests.length}</p>
                <p className="text-sm text-muted-foreground">Validées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressRequests.length}</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <User className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedRequests.length}</p>
                <p className="text-sm text-muted-foreground">Terminées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            En attente ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="validated" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Validées ({validatedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="gap-2">
            <Settings className="w-4 h-4" />
            En cours ({inProgressRequests.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <User className="w-4 h-4" />
            Terminées ({completedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune demande en attente
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map(req => <RequestCard key={req.id} request={req} />)
          )}
        </TabsContent>

        <TabsContent value="validated">
          {validatedRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune demande validée en attente d'assignation
              </CardContent>
            </Card>
          ) : (
            validatedRequests.map(req => <RequestCard key={req.id} request={req} />)
          )}
        </TabsContent>

        <TabsContent value="in_progress">
          {inProgressRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune demande en cours de traitement
              </CardContent>
            </Card>
          ) : (
            inProgressRequests.map(req => <RequestCard key={req.id} request={req} />)
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune demande terminée
              </CardContent>
            </Card>
          ) : (
            completedRequests.map(req => <RequestCard key={req.id} request={req} />)
          )}
        </TabsContent>
      </Tabs>

      {/* Equipment Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Assigner du matériel à {selectedRequest?.prenom} {selectedRequest?.nom}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Besoins exprimés :</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>PC {selectedRequest.pcType}</Badge>
                  <Badge>{selectedRequest.ecransSupplementaires} écran(s)</Badge>
                  <Badge>Tél: {selectedRequest.telephoneType}</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Matériel disponible</h4>
                <div className="space-y-2">
                  {availableEquipment.map(eq => (
                    <div 
                      key={eq.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedEquipment.includes(eq.id) ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => toggleEquipmentSelection(eq.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedEquipment.includes(eq.id)}
                          onCheckedChange={() => toggleEquipmentSelection(eq.id)}
                        />
                        <div>
                          <p className="font-medium">{eq.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {eq.serialNumber} - {eq.category}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{eq.category}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleAssignEquipment}
                  disabled={selectedEquipment.length === 0}
                >
                  Assigner ({selectedEquipment.length})
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
