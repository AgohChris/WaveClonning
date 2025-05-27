import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, UserCheck } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import RecipientSelection from '@/components/send-money/RecipientSelection';
import QrScannerModal from '@/components/send-money/QrScannerModal';

const TRANSACTION_FEE_PERCENTAGE = 0.01; // 1% fee

const SendMoneyForm = () => {
  const navigate = useNavigate();
  const { currentUser, users, updateUserBalance, findUserByPhone } = useAuth();
  const { toast } = useToast();

  const [recipientPhone, setRecipientPhone] = useState('');
  const [manualRecipientPhone, setManualRecipientPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedTab, setSelectedTab] = useState("contacts");
  const [transactionFee, setTransactionFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const availableRecipients = users.filter(user => user.phone !== currentUser.phone);
  const effectiveRecipientPhone = selectedTab === 'manual' ? manualRecipientPhone : recipientPhone;

  useEffect(() => {
    let phoneToSearch = effectiveRecipientPhone;
    if (phoneToSearch) {
      const recipient = findUserByPhone(phoneToSearch);
      setRecipientName(recipient ? `${recipient.firstName} ${recipient.lastName}` : '');
    } else {
      setRecipientName('');
    }
  }, [effectiveRecipientPhone, findUserByPhone]);

  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      const fee = numericAmount * TRANSACTION_FEE_PERCENTAGE;
      setTransactionFee(fee);
      setTotalAmount(numericAmount + fee);
    } else {
      setTransactionFee(0);
      setTotalAmount(0);
    }
  }, [amount]);

  const formatCurrency = (value) => {
    if (isNaN(value) || value === null || value === undefined) return '0 XOF';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value);
  };

  const handleSendMoney = () => {
    setIsLoading(true);
    const recipient = findUserByPhone(effectiveRecipientPhone);
    const numericAmount = parseFloat(amount);

    if (!effectiveRecipientPhone || !recipient) {
      toast({ variant: "destructive", title: "Erreur", description: "Destinataire invalide." });
      setIsLoading(false);
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({ variant: "destructive", title: "Erreur", description: "Montant invalide." });
      setIsLoading(false);
      return;
    }
    if (totalAmount > currentUser.balance) {
      toast({ variant: "destructive", title: "Erreur", description: "Solde insuffisant." });
      setIsLoading(false);
      return;
    }

    updateUserBalance(currentUser.phone, currentUser.balance - totalAmount);
    updateUserBalance(recipient.phone, recipient.balance + numericAmount);

    toast({ title: "Succès", description: `Vous avez envoyé ${formatCurrency(numericAmount)} à ${recipient.firstName} ${recipient.lastName}. Frais: ${formatCurrency(transactionFee)}.` });
    setIsLoading(false);
    setIsConfirming(false);
    navigate('/');
  };
  
  const handleQrScanSuccess = (scannedPhone) => {
    if (availableRecipients.some(r => r.phone === scannedPhone)) {
      setManualRecipientPhone(scannedPhone);
      setSelectedTab("manual");
      toast({
        title: "QR Code Simulé Lu",
        description: `Numéro du destinataire ${scannedPhone} pré-rempli.`
      });
    } else if (scannedPhone === currentUser.phone) {
       toast({
        variant: "destructive",
        title: "Erreur de Scan",
        description: "Vous ne pouvez pas vous envoyer de l'argent à vous-même."
      });
    } else {
       toast({
        variant: "destructive",
        title: "Erreur de Scan",
        description: "Utilisateur du QR code non trouvé ou non disponible."
      });
    }
    setIsQrModalOpen(false);
  };


  return (
    <div className="space-y-6">
      <Button onClick={() => setIsQrModalOpen(true)} variant="outline" className="w-full">
        Scanner un QR Code (Simulation)
      </Button>
      <QrScannerModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onScanSuccess={handleQrScanSuccess}
        availableRecipients={availableRecipients}
      />

      <RecipientSelection
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        recipientPhone={recipientPhone}
        setRecipientPhone={setRecipientPhone}
        manualRecipientPhone={manualRecipientPhone}
        setManualRecipientPhone={setManualRecipientPhone}
        availableRecipients={availableRecipients}
      />

      {recipientName && (
        <p className="mt-2 text-sm text-green-600 flex items-center">
          <UserCheck className="w-4 h-4 mr-1" /> Confirmé: {recipientName} ({effectiveRecipientPhone})
        </p>
      )}
      {!recipientName && effectiveRecipientPhone && (
         <p className="mt-2 text-sm text-orange-600 flex items-center">
            <UserCheck className="w-4 h-4 mr-1" /> Utilisateur non trouvé pour ce numéro.
        </p>
      )}

      <div>
        <Label htmlFor="amount">Montant à envoyer (XOF)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
        />
      </div>
      {parseFloat(amount) > 0 && (
        <div className="text-sm text-muted-foreground space-y-1 mt-2 p-3 bg-accent/50 rounded-md">
            <p>Montant: {formatCurrency(parseFloat(amount))}</p>
            <p>Frais de transaction ({TRANSACTION_FEE_PERCENTAGE*100}%): {formatCurrency(transactionFee)}</p>
            <p className="font-semibold">Total à débiter: {formatCurrency(totalAmount)}</p>
        </div>
      )}
      
      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogTrigger asChild>
          <Button 
            className="w-full" 
            disabled={!effectiveRecipientPhone || !recipientName || !amount || parseFloat(amount) <= 0 || isLoading || totalAmount > currentUser.balance}
          >
            {isLoading && !isConfirming ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Envoyer
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'envoi</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment envoyer <strong>{formatCurrency(parseFloat(amount) || 0)}</strong> à <strong>{recipientName}</strong> ({effectiveRecipientPhone}) ? <br/>
              Des frais de <strong>{formatCurrency(transactionFee)}</strong> s'appliqueront. <br/>
              Montant total débité : <strong>{formatCurrency(totalAmount)}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading && isConfirming}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendMoney} disabled={isLoading && isConfirming}>
              {isLoading && isConfirming ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Confirmer et Envoyer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SendMoneyForm;