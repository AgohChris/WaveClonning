
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const SignupForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setTempAuthData } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate OTP generation and sending
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    setTempAuthData({
      firstName,
      lastName,
      phone,
      otp: generatedOtp, // Store OTP for verification on next page
      otpVerified: false
    });

    toast({
      title: 'Code OTP envoyé (simulation)',
      description: `Un code OTP a été "envoyé" à ${phone}. Le code est : ${generatedOtp}`,
      duration: 9000, 
    });
    
    // Navigate to OTP verification page
    navigate('/otp');
    setIsLoading(false); 
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            placeholder="Votre prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            placeholder="Votre nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone-signup">Numéro de téléphone</Label>
        <Input
          id="phone-signup"
          type="tel"
          placeholder="Votre numéro de téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoComplete="tel"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Continuer
      </Button>
    </motion.form>
  );
};

export default SignupForm;
