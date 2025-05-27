import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TextCursorInput as PhoneInputIcon } from 'lucide-react';

const RecipientSelection = ({
  selectedTab,
  setSelectedTab,
  recipientPhone,
  setRecipientPhone,
  manualRecipientPhone,
  setManualRecipientPhone,
  availableRecipients
}) => {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="contacts">
          <Users className="w-4 h-4 mr-2" />
          Mes Contacts
        </TabsTrigger>
        <TabsTrigger value="manual">
          <PhoneInputIcon className="w-4 h-4 mr-2" />
          Saisir Numéro
        </TabsTrigger>
      </TabsList>
      <TabsContent value="contacts" className="pt-4">
        <Label htmlFor="recipient-select">Destinataire via contacts</Label>
        <Select onValueChange={(value) => { setRecipientPhone(value); setManualRecipientPhone(''); }} value={recipientPhone}>
          <SelectTrigger id="recipient-select" className="w-full">
            <SelectValue placeholder="Sélectionner un contact" />
          </SelectTrigger>
          <SelectContent>
            {availableRecipients.map(user => (
              <SelectItem key={user.phone} value={user.phone}>
                {user.firstName} {user.lastName} ({user.phone})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TabsContent>
      <TabsContent value="manual" className="pt-4">
        <Label htmlFor="recipient-manual">Numéro de téléphone du destinataire</Label>
        <Input
          id="recipient-manual"
          type="tel"
          placeholder="Ex: 771234567"
          value={manualRecipientPhone}
          onChange={(e) => {setManualRecipientPhone(e.target.value); setRecipientPhone('');}}
        />
      </TabsContent>
    </Tabs>
  );
};

export default RecipientSelection;