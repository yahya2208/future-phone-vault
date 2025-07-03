
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordVisibilityToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

const PasswordVisibilityToggle = ({ isVisible, onToggle }: PasswordVisibilityToggleProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute left-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
      onClick={onToggle}
    >
      {isVisible ? (
        <EyeOff className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Eye className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
};

export default PasswordVisibilityToggle;
