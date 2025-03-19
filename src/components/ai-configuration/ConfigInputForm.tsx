
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ConfigInputFormProps {
  isProcessing: boolean;
  onSendMessage: (message: string) => void;
}

export const ConfigInputForm: React.FC<ConfigInputFormProps> = ({
  isProcessing,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div 
      className="p-3 border-t bg-background"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-2 items-end">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your configuration query..."
          className="resize-none min-h-[60px] bg-gray-100 dark:bg-gray-850 transition-colors duration-200"
          disabled={isProcessing}
        />
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={handleSend} 
            disabled={isProcessing || !message.trim()} 
            className="h-10 w-10 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
