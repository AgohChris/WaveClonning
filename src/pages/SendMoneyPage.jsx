import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import SendMoneyForm from '@/components/send-money/SendMoneyForm';

const TRANSACTION_FEE_PERCENTAGE = 0.01; // 1% fee, kept for description consistency

const SendMoneyPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 md:p-6 max-w-2xl mx-auto"
    >
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Button>

      <Card className="shadow-lg glassmorphic">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Envoyer de l'argent
          </CardTitle>
          <CardDescription className="text-base">
            Transférez des fonds rapidement et en toute sécurité. Des frais de {TRANSACTION_FEE_PERCENTAGE * 100}% s'appliquent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SendMoneyForm />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SendMoneyPage;