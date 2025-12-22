import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SignaturePad } from '@/components/Signature/SignaturePad';
import { toast } from '@/hooks/use-toast';
import { 
  UserMinus, 
  Package, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Wrench,
  Trash2
} from 'lucide-react';
import { 
  collaboratorProfiles,
  returnRequests,
  addReturnRequest,
  updateReturnRequest,
  addHandoverDocument
} from '@/data/collaboratorData';
import { equipment } from '@/data/mockData';
import { CollaboratorProfile, ReturnRequest, EquipmentReturn } from '@/types/collaborator';

const departureTypes = [
  { value: 'definitive', label: 'Définitif', description: 'Départ de l\'entreprise' },
  { value: 'temporary', label: 'Temporaire', description: 'Mise à pied, congé longue durée' },
  { value: 'transfer', label: 'Transfert', description: 'Mutation vers une autre entité' },
];

const equipmentStatuses = [
  { value: 'ok', label: 'OK', icon: CheckCircle2, className: 'text-success' },
  { value: 'maintenance', label: 'Maintenance', icon: Wrench, className: 'text-warning' },
  { value: 'rebut', label: 'Rebut', icon: Trash2, className: 'text-destructive' },
];

export default function DeparturePage() {
  const [selectedCollaborator, setSelectedCollaborator] = useState<CollaboratorProfile | null>(null);
  const [departureType, setDepartureType] = useState<'definitive' | 'temporary' | 'transfer'>('definitive');
  const [departureDate, setDepartureDate] = useState('');
  const [equipmentReturns, setEquipmentReturns] = useState<EquipmentReturn[]>([]);
  const [signature, setSignature] = useState('');
  const [currentReturn, setCurrentReturn] = useState<ReturnRequest | null>(null);
  const [step, setStep] = useState<'select' | 'equipment' | 'signature' | 'complete'>('select');
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeCollaborators = collaboratorProfiles.filter(c => c.status === 'active');

  const getCollaboratorEquipment = (collaborator: CollaboratorProfile) => {
    return equipment.filter(e => collaborator.equipmentIds.includes(e.id));
  };

  const handleSelectCollaborator = (collaboratorId: string) => {
    const collab = collaboratorProfiles.find(c => c.id === collaboratorId);
    if (collab) {
      setSelectedCollaborator(collab);
      const collabEquipment = getCollaboratorEquipment(collab);
      setEquipmentReturns(collabEquipment.map(eq => ({
        equipmentId: eq.id,
        status: 'ok',
        received: false,
      })));
    }
  };

  const handleStartDeparture = () => {
    if (!selectedCollaborator || !departureDate) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un collaborateur et une date de départ',
        variant: 'destructive',
      });
      return;
    }

    setStep('equipment');
    setDialogOpen(false);
  };

  const handleEquipmentStatusChange = (equipmentId: string, status: 'ok' | 'maintenance' | 'rebut') => {
    setEquipmentReturns(prev => prev.map(er =>
      er.equipmentId === equipmentId ? { ...er, status } : er
    ));
  };

  const handleEquipmentReceivedChange = (equipmentId: string, received: boolean) => {
    setEquipmentReturns(prev => prev.map(er =>
      er.equipmentId === equipmentId ? { ...er, received } : er
    ));
  };

  const handleEquipmentNotesChange = (equipmentId: string, notes: string) => {
    setEquipmentReturns(prev => prev.map(er =>
      er.equipmentId === equipmentId ? { ...er, notes } : er
    ));
  };

  const handleProceedToSignature = () => {
    const allReceived = equipmentReturns.every(er => er.received);
    if (!allReceived) {
      toast({
        title: 'Attention',
        description: 'Tous les matériels n\'ont pas été validés comme reçus',
        variant: 'destructive',
      });
      return;
    }
    setStep('signature');
  };

  const handleSubmitReturn = () => {
    if (!signature) {
      toast({
        title: 'Erreur',
        description: 'La signature est requise',
        variant: 'destructive',
      });
      return;
    }

    const returnRequest = addReturnRequest({
      collaboratorId: selectedCollaborator!.id,
      type: departureType,
      departureDate,
      equipmentReturns,
      signature,
      signedAt: new Date().toISOString(),
    });

    addHandoverDocument({
      type: 'return',
      collaboratorId: selectedCollaborator!.id,
      equipmentIds: equipmentReturns.map(er => er.equipmentId),
      signature,
    });

    setStep('complete');
    toast({
      title: 'Bon de retour généré',
      description: 'Le document a été créé et envoyé aux parties concernées',
    });
  };

  const handleReset = () => {
    setSelectedCollaborator(null);
    setDepartureType('definitive');
    setDepartureDate('');
    setEquipmentReturns([]);
    setSignature('');
    setStep('select');
  };

  if (step === 'complete') {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Bon de retour généré</h2>
          <p className="text-muted-foreground mb-6">
            Le bon de retour pour {selectedCollaborator?.prenom} {selectedCollaborator?.nom} a été créé.
            Un PDF a été envoyé aux parties concernées.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleReset}>
              Nouveau retour
            </Button>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (step === 'signature') {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <div className="page-header">
            <h1 className="page-title">Signature du bon de retour</h1>
            <p className="page-subtitle">
              {selectedCollaborator?.prenom} {selectedCollaborator?.nom}
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Récapitulatif du matériel retourné</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {equipmentReturns.map(er => {
                  const eq = equipment.find(e => e.id === er.equipmentId);
                  const StatusIcon = equipmentStatuses.find(s => s.value === er.status)?.icon || CheckCircle2;
                  return (
                    <div key={er.equipmentId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{eq?.name}</p>
                        <p className="text-sm text-muted-foreground">{eq?.serialNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-5 h-5 ${equipmentStatuses.find(s => s.value === er.status)?.className}`} />
                        <Badge variant={er.status === 'ok' ? 'default' : er.status === 'maintenance' ? 'secondary' : 'destructive'}>
                          {equipmentStatuses.find(s => s.value === er.status)?.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Signature du collaborateur</CardTitle>
            </CardHeader>
            <CardContent>
              <SignaturePad onSave={setSignature} />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('equipment')}>
              Retour
            </Button>
            <Button onClick={handleSubmitReturn} disabled={!signature}>
              Valider et générer le bon
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (step === 'equipment' && selectedCollaborator) {
    const collabEquipment = getCollaboratorEquipment(selectedCollaborator);

    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="page-header flex items-center justify-between">
            <div>
              <h1 className="page-title">Retour de matériel</h1>
              <p className="page-subtitle">
                {selectedCollaborator.prenom} {selectedCollaborator.nom} - {selectedCollaborator.poste}
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              {departureTypes.find(d => d.value === departureType)?.label}
            </Badge>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Liste du matériel à récupérer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collabEquipment.map(eq => {
                  const returnData = equipmentReturns.find(er => er.equipmentId === eq.id);
                  return (
                    <div key={eq.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{eq.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {eq.serialNumber} - {eq.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`received-${eq.id}`}
                            checked={returnData?.received}
                            onCheckedChange={(checked) => handleEquipmentReceivedChange(eq.id, checked as boolean)}
                          />
                          <Label htmlFor={`received-${eq.id}`} className="text-sm font-medium">
                            Reçu
                          </Label>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">État du matériel</Label>
                          <RadioGroup
                            value={returnData?.status}
                            onValueChange={(value) => handleEquipmentStatusChange(eq.id, value as 'ok' | 'maintenance' | 'rebut')}
                            className="flex gap-4 mt-2"
                          >
                            {equipmentStatuses.map(status => (
                              <div key={status.value} className="flex items-center gap-2">
                                <RadioGroupItem value={status.value} id={`${eq.id}-${status.value}`} />
                                <Label htmlFor={`${eq.id}-${status.value}`} className={`flex items-center gap-1 ${status.className}`}>
                                  <status.icon className="w-4 h-4" />
                                  {status.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div>
                          <Label className="text-sm">Notes</Label>
                          <Textarea
                            placeholder="Commentaires sur l'état..."
                            value={returnData?.notes || ''}
                            onChange={(e) => handleEquipmentNotesChange(eq.id, e.target.value)}
                            rows={2}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              Annuler
            </Button>
            <Button onClick={handleProceedToSignature}>
              Continuer vers la signature
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-header">
        <h1 className="page-title">Gestion des départs</h1>
        <p className="page-subtitle">Gérez le retour de matériel des collaborateurs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="w-5 h-5" />
              Nouveau départ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Initiez le processus de départ d'un collaborateur pour gérer le retour de son matériel.
            </p>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <UserMinus className="w-4 h-4 mr-2" />
                  Gérer un départ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Initier un départ</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Collaborateur</Label>
                    <Select onValueChange={handleSelectCollaborator}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {activeCollaborators.map(collab => (
                          <SelectItem key={collab.id} value={collab.id}>
                            {collab.prenom} {collab.nom} - {collab.poste}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Type de départ</Label>
                    <RadioGroup
                      value={departureType}
                      onValueChange={(value) => setDepartureType(value as typeof departureType)}
                      className="mt-2 space-y-2"
                    >
                      {departureTypes.map(type => (
                        <div key={type.value} className="flex items-start gap-3 p-3 border rounded-lg">
                          <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                          <Label htmlFor={type.value} className="cursor-pointer">
                            <p className="font-medium">{type.label}</p>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Date de départ</Label>
                    <input
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>

                  {selectedCollaborator && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Matériel à récupérer :</p>
                      <div className="flex flex-wrap gap-2">
                        {getCollaboratorEquipment(selectedCollaborator).map(eq => (
                          <Badge key={eq.id} variant="secondary">
                            {eq.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleStartDeparture} 
                    className="w-full"
                    disabled={!selectedCollaborator || !departureDate}
                  >
                    Commencer le processus
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Retours en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {returnRequests.filter(r => r.status !== 'completed').length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun retour en cours
              </p>
            ) : (
              <div className="space-y-3">
                {returnRequests.filter(r => r.status !== 'completed').map(req => {
                  const collab = collaboratorProfiles.find(c => c.id === req.collaboratorId);
                  return (
                    <div key={req.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{collab?.prenom} {collab?.nom}</p>
                          <p className="text-sm text-muted-foreground">
                            {req.equipmentReturns.length} matériel(s)
                          </p>
                        </div>
                        <Badge variant="secondary">{req.status}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
