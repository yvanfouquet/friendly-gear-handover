import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { SignaturePad } from '@/components/Signature/SignaturePad';
import { equipment as initialEquipment, users, companies } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Package, User, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HandoverPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [signature, setSignature] = useState<string>('');
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const filteredUsers = users.filter(u => !selectedCompany || u.companyId === selectedCompany);
  const availableEquipment = initialEquipment.filter(e => e.status === 'available');

  const handleSubmit = () => {
    if (!selectedCompany || !selectedUser || !selectedEquipment || !signature) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs et signer',
        variant: 'destructive',
      });
      return;
    }

    // In a real app, this would save to database
    setIsComplete(true);
    toast({
      title: 'Succès',
      description: 'Remise de matériel enregistrée',
    });
  };

  const handleReset = () => {
    setSelectedCompany('');
    setSelectedUser('');
    setSelectedEquipment('');
    setNotes('');
    setSignature('');
    setIsComplete(false);
  };

  const selectedEquipmentData = initialEquipment.find(e => e.id === selectedEquipment);
  const selectedUserData = users.find(u => u.id === selectedUser);
  const selectedCompanyData = companies.find(c => c.id === selectedCompany);

  if (isComplete) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-success/20">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h1 className="text-2xl font-semibold mb-2">Remise enregistrée</h1>
              <p className="text-muted-foreground mb-8">
                Le matériel a été attribué avec succès
              </p>
              
              <div className="bg-muted/30 rounded-xl p-6 mb-8 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Matériel</p>
                    <p className="font-medium">{selectedEquipmentData?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">N° Série</p>
                    <p className="font-mono">{selectedEquipmentData?.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Attribué à</p>
                    <p className="font-medium">{selectedUserData?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Société</p>
                    <p className="font-medium">{selectedCompanyData?.name}</p>
                  </div>
                </div>
                {signature && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Signature</p>
                    <img src={signature} alt="Signature" className="h-20 bg-card rounded border border-border p-2" />
                  </div>
                )}
              </div>

              <Button onClick={handleReset} size="lg">
                Nouvelle remise
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-header">
        <h1 className="page-title">Remise de matériel</h1>
        <p className="page-subtitle">Attribuez du matériel avec signature électronique</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Société
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCompany} onValueChange={(value) => {
                setSelectedCompany(value);
                setSelectedUser('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une société" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={selectedUser} 
                onValueChange={setSelectedUser}
                disabled={!selectedCompany}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedCompany ? "Sélectionner un utilisateur" : "Sélectionnez d'abord une société"} />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Matériel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le matériel" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {availableEquipment.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - {item.serialNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableEquipment.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Aucun matériel disponible
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes optionnelles sur cette remise..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Signature</CardTitle>
            </CardHeader>
            <CardContent>
              <SignaturePad onSave={setSignature} />
              {signature && (
                <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-sm text-success font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Signature enregistrée
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button 
            onClick={handleSubmit} 
            className="w-full mt-6" 
            size="lg"
            disabled={!selectedCompany || !selectedUser || !selectedEquipment || !signature}
          >
            Valider la remise
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
