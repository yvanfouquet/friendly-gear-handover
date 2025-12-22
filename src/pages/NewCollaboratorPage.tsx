import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Monitor, 
  Laptop, 
  Tablet, 
  Phone,
  CheckCircle2,
  Search
} from 'lucide-react';
import { 
  filiales, 
  directions, 
  groupesMailOptions, 
  logicielsDisponibles, 
  droitsOptions,
  addCollaboratorRequest,
  getCollaboratorByEmail,
  collaboratorProfiles
} from '@/data/collaboratorData';
import { equipment } from '@/data/mockData';
import { Software, CollaboratorProfile } from '@/types/collaborator';

export default function NewCollaboratorPage() {
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState<'new' | 'replacement' | null>(null);
  const [replacedEmail, setReplacedEmail] = useState('');
  const [replacedCollaborator, setReplacedCollaborator] = useState<CollaboratorProfile | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form fields
  const [filiale, setFiliale] = useState('');
  const [direction, setDirection] = useState('');
  const [poste, setPoste] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [selectedGroupesMail, setSelectedGroupesMail] = useState<string[]>([]);
  const [pcType, setPcType] = useState<'fixe' | 'portable' | 'tablette'>('portable');
  const [ecransSupplementaires, setEcransSupplementaires] = useState<0 | 1 | 2 | 3>(0);
  const [telephoneType, setTelephoneType] = useState<'fixe' | 'mobile' | 'both' | 'none'>('mobile');
  const [autresMateriels, setAutresMateriels] = useState('');
  const [logiciels, setLogiciels] = useState<Software[]>([]);
  const [newLogicielName, setNewLogicielName] = useState('');
  const [newLogicielDroit, setNewLogicielDroit] = useState('Lecture/Écriture');

  const handleSearchReplacedEmail = () => {
    const found = getCollaboratorByEmail(replacedEmail);
    if (found) {
      setReplacedCollaborator(found);
      // Pre-fill form with replaced collaborator data
      setFiliale(found.filiale);
      setDirection(found.direction);
      setPoste(found.poste);
      setSelectedGroupesMail(found.groupesMail);
      setLogiciels(found.logiciels);
      toast({
        title: 'Collaborateur trouvé',
        description: `${found.prenom} ${found.nom} - ${found.poste}`,
      });
    } else {
      toast({
        title: 'Collaborateur non trouvé',
        description: 'Aucun collaborateur avec cette adresse email',
        variant: 'destructive',
      });
    }
  };

  const getReplacedEquipment = () => {
    if (!replacedCollaborator) return [];
    return equipment.filter(e => replacedCollaborator.equipmentIds.includes(e.id));
  };

  const toggleGroupeMail = (groupe: string) => {
    setSelectedGroupesMail(prev =>
      prev.includes(groupe)
        ? prev.filter(g => g !== groupe)
        : [...prev, groupe]
    );
  };

  const addLogiciel = () => {
    if (newLogicielName) {
      setLogiciels(prev => [
        ...prev,
        { id: `log-${Date.now()}`, name: newLogicielName, rights: newLogicielDroit }
      ]);
      setNewLogicielName('');
      setNewLogicielDroit('Lecture/Écriture');
    }
  };

  const removeLogiciel = (id: string) => {
    setLogiciels(prev => prev.filter(l => l.id !== id));
  };

  const handleSubmit = () => {
    if (!filiale || !direction || !poste || !nom || !prenom) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    addCollaboratorRequest({
      type: requestType!,
      replacedEmail: requestType === 'replacement' ? replacedEmail : undefined,
      filiale,
      direction,
      poste,
      nom,
      prenom,
      groupesMail: selectedGroupesMail,
      pcType,
      ecransSupplementaires,
      telephoneType,
      autresMateriels,
      logiciels,
    });

    setIsSubmitted(true);
    toast({
      title: 'Demande envoyée',
      description: 'Votre demande a été transmise à l\'équipe support',
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Demande envoyée avec succès</h2>
            <p className="text-muted-foreground mb-6">
              Votre demande d'onboarding pour {prenom} {nom} a été transmise à l'équipe support DSI.
              Vous recevrez une notification par email lorsque le compte sera créé.
            </p>
            <Button onClick={() => {
              setIsSubmitted(false);
              setRequestType(null);
              setNom('');
              setPrenom('');
              setFiliale('');
              setDirection('');
              setPoste('');
              setSelectedGroupesMail([]);
              setLogiciels([]);
              setReplacedCollaborator(null);
              setReplacedEmail('');
            }}>
              Nouvelle demande
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 1: Choose type
  if (!requestType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Demande d'onboarding</h1>
            <p className="text-muted-foreground">Créez une demande pour un nouveau collaborateur</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setRequestType('replacement')}
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center mx-auto mb-2">
                  <RefreshCw className="w-6 h-6 text-info" />
                </div>
                <CardTitle>Remplacement</CardTitle>
                <CardDescription>
                  Reprendre le poste et les accès d'un ancien collaborateur
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setRequestType('new')}
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                  <UserPlus className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Nouveau poste</CardTitle>
                <CardDescription>
                  Créer un nouveau profil à partir de zéro
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {requestType === 'replacement' ? 'Remplacement' : 'Nouveau poste'}
            </h1>
            <p className="text-muted-foreground">Remplissez les informations du collaborateur</p>
          </div>
          <Button variant="outline" onClick={() => setRequestType(null)}>
            Retour
          </Button>
        </div>

        {/* Replacement search */}
        {requestType === 'replacement' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rechercher l'ancien collaborateur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Email de l'ancien collaborateur"
                  value={replacedEmail}
                  onChange={(e) => setReplacedEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearchReplacedEmail}>
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
              </div>

              {replacedCollaborator && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Collaborateur trouvé</h4>
                  <p className="text-sm text-muted-foreground">
                    {replacedCollaborator.prenom} {replacedCollaborator.nom} - {replacedCollaborator.poste}
                  </p>
                  
                  {getReplacedEquipment().length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Matériel associé :</p>
                      <div className="flex flex-wrap gap-2">
                        {getReplacedEquipment().map(eq => (
                          <Badge key={eq.id} variant="secondary">
                            {eq.name} ({eq.serialNumber})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {replacedCollaborator.logiciels.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Logiciels et droits :</p>
                      <div className="flex flex-wrap gap-2">
                        {replacedCollaborator.logiciels.map(log => (
                          <Badge key={log.id} variant="outline">
                            {log.name} - {log.rights}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations du collaborateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Identity */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom"
                />
              </div>
            </div>

            {/* Organization */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Filiale *</Label>
                <Select value={filiale} onValueChange={setFiliale}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filiales.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Direction *</Label>
                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent>
                    {directions.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="poste">Poste *</Label>
                <Input
                  id="poste"
                  value={poste}
                  onChange={(e) => setPoste(e.target.value)}
                  placeholder="Intitulé du poste"
                />
              </div>
            </div>

            <Separator />

            {/* Mail groups */}
            <div className="space-y-3">
              <Label>Groupes mail</Label>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {groupesMailOptions.map(groupe => (
                  <div key={groupe} className="flex items-center space-x-2">
                    <Checkbox
                      id={groupe}
                      checked={selectedGroupesMail.includes(groupe)}
                      onCheckedChange={() => toggleGroupeMail(groupe)}
                    />
                    <label htmlFor={groupe} className="text-sm cursor-pointer">
                      {groupe}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Equipment */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Matériel informatique</Label>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de poste</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={pcType === 'fixe' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setPcType('fixe')}
                    >
                      <Monitor className="w-4 h-4 mr-2" />
                      Fixe
                    </Button>
                    <Button
                      type="button"
                      variant={pcType === 'portable' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setPcType('portable')}
                    >
                      <Laptop className="w-4 h-4 mr-2" />
                      Portable
                    </Button>
                    <Button
                      type="button"
                      variant={pcType === 'tablette' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setPcType('tablette')}
                    >
                      <Tablet className="w-4 h-4 mr-2" />
                      Tablette
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Écrans supplémentaires</Label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map(n => (
                      <Button
                        key={n}
                        type="button"
                        variant={ecransSupplementaires === n ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => setEcransSupplementaires(n as 0 | 1 | 2 | 3)}
                      >
                        {n}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Téléphone</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={telephoneType === 'none' ? 'default' : 'outline'}
                    onClick={() => setTelephoneType('none')}
                  >
                    Aucun
                  </Button>
                  <Button
                    type="button"
                    variant={telephoneType === 'fixe' ? 'default' : 'outline'}
                    onClick={() => setTelephoneType('fixe')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Fixe
                  </Button>
                  <Button
                    type="button"
                    variant={telephoneType === 'mobile' ? 'default' : 'outline'}
                    onClick={() => setTelephoneType('mobile')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Mobile
                  </Button>
                  <Button
                    type="button"
                    variant={telephoneType === 'both' ? 'default' : 'outline'}
                    onClick={() => setTelephoneType('both')}
                  >
                    Les deux
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="autres">Autres matériels</Label>
                <Textarea
                  id="autres"
                  value={autresMateriels}
                  onChange={(e) => setAutresMateriels(e.target.value)}
                  placeholder="Casque audio, webcam, station d'accueil..."
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            {/* Software */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Logiciels et droits</Label>

              {logiciels.length > 0 && (
                <div className="space-y-2">
                  {logiciels.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <span className="font-medium">{log.name}</span>
                        <Badge variant="outline" className="ml-2">{log.rights}</Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLogiciel(log.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Select value={newLogicielName} onValueChange={setNewLogicielName}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choisir un logiciel..." />
                  </SelectTrigger>
                  <SelectContent>
                    {logicielsDisponibles
                      .filter(l => !logiciels.some(log => log.name === l))
                      .map(l => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Select value={newLogicielDroit} onValueChange={setNewLogicielDroit}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {droitsOptions.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addLogiciel} disabled={!newLogicielName}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setRequestType(null)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Envoyer la demande
          </Button>
        </div>
      </div>
    </div>
  );
}
