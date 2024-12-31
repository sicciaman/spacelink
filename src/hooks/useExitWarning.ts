import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useExitWarning(shouldWarn: boolean, onExit?: () => void) {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle browser back/forward buttons and tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldWarn) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldWarn]);

  // Custom navigation handler
  const handleNavigation = useCallback((path: string) => {
    if (shouldWarn) {
      setPendingPath(path);
      setShowExitDialog(true);
      return false;
    }
    return true;
  }, [shouldWarn]);

  const handleConfirmExit = () => {
    if (onExit) onExit();
    setShowExitDialog(false);
    if (pendingPath) {
      navigate(pendingPath);
    }
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);
    setPendingPath(null);
  };

  return {
    showExitDialog,
    handleConfirmExit,
    handleCancelExit,
    handleNavigation
  };
}