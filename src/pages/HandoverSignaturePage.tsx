import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SignaturePad } from '@/components/Signature/SignaturePad';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, FileText, Package, User, Building2, Calendar } from 'lucide-react';
import { collaboratorProfiles, addHandoverDocument } from '@/data/collaboratorData';
import { equipment } from '@/data/mockData';

export default function HandoverSignaturePage() {
  const [searchParams] = useSearchParams();
  const collaboratorId = searchParams.get('collaborator');
  const [signature, setSignature] = useState('');
  const [isSigned, setIsSigned] = useState(false);

  const collaborator = collaboratorProfiles.find(c => c.id === collaboratorId);
  const collaboratorEquipment = collaborator 
    ? equipment.filter(e => collaborator.equipmentIds.includes(e.id))
    : [];

  const handleSign = () => {
    if (!signature) {
      toast({
        title: 'Erreur',
        description: 'Veuillez signer avant de valider',
        variant: 'destructive',
      });
      return;
    }

    if (collaborator) {
      addHandoverDocument({
        type: 'handover',
        collaboratorId: collaborator.id,
        equipmentIds: collaborator.equipmentIds,
        signature,
      });
    }

    setIsSigned(true);
    toast({
      title: 'Signature enregistrée',
      description: 'Le bon de remise a été validé et envoyé par email',
    });
  };

  if (!collaborator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-8">
            <p className="text-muted-foreground">Collaborateur non trouvé</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSigned) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="py-8">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Bon de remise signé</h2>
            <p className="text-muted-foreground mb-6">
              Le bon de remise a été enregistré. Vous recevrez une copie par email.
            </p>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Télécharger le PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Bon de remise de matériel</h1>
          <p className="text-muted-foreground">Veuillez vérifier les informations et signer</p>
        </div>

        {/* Collaborator info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              Collaborateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-medium">{collaborator.prenom} {collaborator.nom}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{collaborator.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Poste</p>
                <p className="font-medium">{collaborator.poste}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Direction</p>
                <p className="font-medium">{collaborator.direction}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5" />
              Matériel remis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {collaboratorEquipment.map(eq => (
                <div key={eq.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{eq.name}</p>
                    <p className="text-sm text-muted-foreground">N° série: {eq.serialNumber}</p>
                  </div>
                  <Badge variant="secondary">{eq.category}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Software */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Logiciels et accès</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {collaborator.logiciels.map(log => (
                <Badge key={log.id} variant="outline">
                  {log.name} - {log.rights}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Signature */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Signature</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              En signant ce document, je reconnais avoir reçu le matériel listé ci-dessus 
              et m'engage à en prendre soin conformément aux règles de l'entreprise.
            </p>
            <SignaturePad onSave={setSignature} />
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button size="lg" onClick={handleSign} disabled={!signature}>
            Valider et signer
          </Button>
        </div>
      </div>
    </div>
  );
}
