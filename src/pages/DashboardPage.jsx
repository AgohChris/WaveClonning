import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, PlusCircle, Send } from 'lucide-react';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return <p>Chargement des informations utilisateur...</p>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Bonjour, {currentUser.firstName}!
        </h1>
        <p className="text-muted-foreground">Bienvenue sur votre tableau de bord Wave.</p>
      </header>

      <Card className="shadow-lg glassmorphic overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          <CardHeader>
            <CardDescription className="text-primary-foreground/80">Solde Actuel</CardDescription>
            <CardTitle className="text-4xl font-bold">
              {formatCurrency(currentUser.balance)}
            </CardTitle>
          </CardHeader>
        </div>
        <CardContent className="p-6 grid gap-4 md:grid-cols-2">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start text-left h-auto py-4 hover:bg-primary/10 group"
              onClick={() => navigate('/recharge')}
            >
              <PlusCircle className="w-6 h-6 mr-3 text-primary group-hover:text-primary-focus transition-colors" />
              <div>
                <p className="font-semibold text-base">Recharger le compte</p>
                <p className="text-sm text-muted-foreground">Ajouter des fonds à votre compte.</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start text-left h-auto py-4 hover:bg-primary/10 group"
              onClick={() => navigate('/send-money')}
            >
              <Send className="w-6 h-6 mr-3 text-primary group-hover:text-primary-focus transition-colors" />
              <div>
                <p className="font-semibold text-base">Envoyer de l'argent</p>
                <p className="text-sm text-muted-foreground">Transférer des fonds à un autre utilisateur.</p>
              </div>
              <ArrowRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
          <CardDescription>Vos transactions récentes apparaîtront ici.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <img alt="No activity illustration" className="h-32 w-auto mx-auto mb-4 opacity-50" src="https://images.unsplash.com/photo-1679841105770-37278b9bbd35" />
            <p>Aucune activité récente pour le moment.</p>
          </div>
        </CardContent>
      </Card>

    </motion.div>
  );
};

export default DashboardPage;
