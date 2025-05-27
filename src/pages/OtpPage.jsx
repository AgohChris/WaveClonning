import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const OtpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tempAuthData, setTempAuthData } = useAuth();
  const [otpInput, setOtpInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!tempAuthData || !tempAuthData.otp) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Données d\'inscription manquantes. Veuillez recommencer.' });
      navigate('/auth');
    }
     if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempAuthData, navigate, toast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (otpInput === tempAuthData.otp) {
      setTempAuthData(prev => ({ ...prev, otpVerified: true }));
      toast({ title: 'OTP Vérifié', description: 'Veuillez maintenant définir votre mot de passe.' });
      navigate('/set-password');
    } else {
      toast({ variant: 'destructive', title: 'OTP Incorrect', description: 'Le code OTP saisi est incorrect. Veuillez réessayer.' });
    }
    setIsLoading(false);
  };

  const handleResendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setTempAuthData(prev => ({ ...prev, otp: newOtp }));
    toast({
      title: 'Nouveau Code OTP (simulation)',
      description: `Un nouveau code OTP a été "envoyé". Le code est : ${newOtp}`,
      duration: 9000,
    });
  };

  if (!tempAuthData) return null;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl glassmorphic">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Vérification OTP</CardTitle>
            <CardDescription>
              Un code à 6 chiffres a été envoyé à {tempAuthData.phone}. <br />
              Veuillez le saisir ci-dessous.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp">Code OTP</Label>
                <Input
                  id="otp"
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength="6"
                  placeholder="______"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  required
                  className="text-center tracking-[0.5em] text-lg"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Vérifier le code OTP
              </Button>
              <Button type="button" variant="link" onClick={handleResendOtp} className="w-full">
                Renvoyer le code OTP
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OtpPage;