import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useState } from 'react';

interface ConnectCalendarsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectCalendarsModal({ open, onOpenChange }: ConnectCalendarsModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);

  // Placeholder handlers for each integration
  const handleConnectGoogle = () => {
    setConnecting('google');
    // TODO: Implement Google OAuth2 flow
    alert('Google Calendar integration coming soon!');
    setConnecting(null);
  };
  const handleConnectApple = () => {
    // TODO: Generate and provide a WebCal/iCal link
    alert('Apple Calendar integration coming soon!');
  };
  const handleConnectClassroom = () => {
    setConnecting('classroom');
    // TODO: Implement Google Classroom OAuth2 flow
    alert('Google Classroom integration coming soon!');
    setConnecting(null);
  };
  const handleConnectSchoology = () => {
    setConnecting('schoology');
    // TODO: Implement Schoology OAuth/API flow
    alert('Schoology integration coming soon!');
    setConnecting(null);
  };
  const handleConnectCanvas = () => {
    setConnecting('canvas');
    // TODO: Implement Canvas OAuth/API flow
    alert('Canvas integration coming soon!');
    setConnecting(null);
  };
  const handleConnectTeamSnap = () => {
    setConnecting('teamsnap');
    // TODO: Implement TeamSnap OAuth/API flow
    alert('TeamSnap integration coming soon!');
    setConnecting(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Connect Calendars & Platforms</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Google Calendar</span>
            <Button onClick={handleConnectGoogle} disabled={connecting === 'google'}>Connect</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Apple Calendar</span>
            <Button onClick={handleConnectApple}>Subscribe</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Google Classroom</span>
            <Button onClick={handleConnectClassroom} disabled={connecting === 'classroom'}>Connect</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Schoology</span>
            <Button onClick={handleConnectSchoology} disabled={connecting === 'schoology'}>Connect</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Canvas</span>
            <Button onClick={handleConnectCanvas} disabled={connecting === 'canvas'}>Connect</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>TeamSnap</span>
            <Button onClick={handleConnectTeamSnap} disabled={connecting === 'teamsnap'}>Connect</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 