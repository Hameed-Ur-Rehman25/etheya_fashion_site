import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
}

export const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose }) => {
  const router = useRouter();

  const handleContinueShopping = () => {
    onClose();
    router.push('/products');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="mb-4"
        >
          <CheckCircle className="w-16 h-16 text-green-500" />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-green-700 mb-2 text-center"
        >
          {message}
        </motion.h2>
        <p className="text-gray-600 mb-6 text-center">Thank you for your purchase! 🎉</p>
        <Button 
          onClick={handleContinueShopping} 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Button>
      </motion.div>
    </div>
  );
};
