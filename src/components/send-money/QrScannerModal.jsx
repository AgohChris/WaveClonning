import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode as ScanQrIcon, Camera, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const QrScannerModal = ({ isOpen, onClose, onScanSuccess, availableRecipients }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer;
    if (isScanning && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isScanning && countdown === 0) {
      handleSimulatedScan();
    }
    return () => clearTimeout(timer);
  }, [isScanning, countdown]);

  const startScanSimulation = () => {
    setIsScanning(true);
    setCountdown(3);
  };

  const handleSimulatedScan = () => {
    setIsScanning(false);
    if (availableRecipients.length > 0) {
      const randomRecipient = availableRecipients[Math.floor(Math.random() * availableRecipients.length)];
      onScanSuccess(randomRecipient.phone);
    } else {
      onScanSuccess(null); // Indicate no recipient found
    }
    onClose();
  };

  const handleModalClose = () => {
    setIsScanning(false);
    setCountdown(3);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[425px] glassmorphic-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ScanQrIcon className="mr-2 h-6 w-6 text-primary" />
            Scanner un QR Code
          </DialogTitle>
          <DialogDescription>
            {isScanning 
              ? "Simulation du scan en cours... Dirigez votre caméra (simulée) vers le QR code."
              : "Préparez-vous à scanner le QR code du destinataire."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-6 flex flex-col items-center justify-center space-y-4">
          {!isScanning ? (
            <>
              <Camera className="h-24 w-24 text-muted-foreground" />
              <p className="text-center text-sm text-muted-foreground">
                Cliquez sur "Démarrer la Simulation" pour simuler le scan d'un QR code.
              </p>
            </>
          ) : (
            <motion.div 
              className="w-60 h-60 border-4 border-dashed border-primary rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-black/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                animate={{ y: [0, 236, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <Zap className="h-16 w-16 text-primary animate-pulse" />
              <p className="text-primary font-bold text-4xl mt-2">{countdown}</p>
              <p className="text-xs text-muted-foreground mt-1">Scan en cours...</p>
            </motion.div>
          )}
        </div>

        <DialogFooter className="sm:justify-center">
          {!isScanning ? (
            <Button onClick={startScanSimulation} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white">
              Démarrer la Simulation de Scan
            </Button>
          ) : (
            <Button variant="outline" onClick={handleSimulatedScan} className="w-full">
              Forcer Scan (Simulé)
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="ghost" className="w-full sm:w-auto mt-2 sm:mt-0">Annuler</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QrScannerModal;