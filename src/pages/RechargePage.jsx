
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, RefreshCw, QrCode as QrCodeIcon, AlertTriangle } from 'lucide-react';
import QRCode from 'qrcode.react';

const RechargePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [qrValue, setQrValue] = useState('');
  const [showSimulationNote, setShowSimulationNote] = useState(true);

  const generateQrValue = () => {
    if (currentUser) {
      const timestamp = Date.now();
      return JSON.stringify({
        userId: currentUser.phone,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        timestamp: timestamp,
        type: 'RECHARGE_REQUEST'
      });
    }
    return '';
  };

  useEffect(() => {
    setQrValue(generateQrValue());
    const interval = setInterval(() => {
      setQrValue(generateQrValue());
      toast({ title: "QR Code Actualisé", description: "Votre QR code de rechargement a été mis à jour pour plus de sécurité." });
    }, 3 * 60 * 1000); // Actualisation toutes les 3 minutes

    return () => clearInterval(interval);
  }, [currentUser]);

  const handleSimulateRecharge = () => {
    // Dans une vraie appli, l'agent scannerait le QR, et un backend traiterait la recharge.
    // Ici, nous allons juste informer l'utilisateur que l'étape suivante serait gérée par l'agent.
    toast({
      title: "Simulation de Rechargement",
      description: "L'agent scannerait ce QR code et saisirait le montant à recharger. Votre solde serait mis à jour via une notification du système.",
      duration: 9000
    });
    navigate('/');
  };

  if (!currentUser) {
    return <p>Chargement des informations utilisateur...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Button>
      <Card className="shadow-lg glassmorphic">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <QrCodeIcon className="w-8 h-8 mr-3 text-primary" /> Recharger le compte
          </CardTitle>
          <CardDescription>
            Présentez ce QR code à un agent en agence pour recharger votre compte. Le QR code se met à jour automatiquement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center">
          {qrValue ? (
            <motion.div
              key={qrValue}
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-white rounded-lg shadow-md"
            >
              <QRCode value={qrValue} size={256} level="H" includeMargin={true} />
            </motion.div>
          ) : (
            <p>Génération du QR code...</p>
          )}
          <p className="text-sm text-muted-foreground">
            Ce code contient vos informations de rechargement sécurisées.
          </p>
          <Button onClick={() => setQrValue(generateQrValue())} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Actualiser le QR Code Manuellement
          </Button>

          {showSimulationNote && (
            <div className="mt-4 p-4 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-700 rounded-md">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span className="font-semibold">Note de Simulation</span>
              </div>
              <p className="text-sm mt-1">
                Ceci est une simulation. Dans une application réelle, l'agent scannerait ce code.
                Pour continuer la démonstration, cliquez sur "Simuler Dépôt par Agent" pour retourner au tableau de bord.
                Le rechargement effectif du solde se ferait via le système de l'agent après scan.
              </p>
               <Button variant="link" className="text-xs p-0 h-auto mt-1 text-yellow-700 hover:text-yellow-800" onClick={() => setShowSimulationNote(false)}>Ne plus afficher cette note</Button>
            </div>
          )}

          <Button className="w-full mt-4" onClick={handleSimulateRecharge}>
            J'ai présenté mon QR Code (Simuler Dépôt par Agent)
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RechargePage;
