import { Frown, Home } from 'lucide-react';
import { Button } from '@ethsign/ui';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const NotFound = () => {
  function sendMessageToParent() {
    const parentWindow = window.opener; // 获取父窗口对象
    if (parentWindow) {
      parentWindow.postMessage('Hello from new window', '*');
    }
  }
  useEffect(() => {
    sendMessageToParent();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background text-foreground p-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <Frown className="w-24 h-24 mx-auto text-muted-foreground animate-pulse" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-6xl font-bold text-primary">404</div>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Page not found</h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Sorry, the page you are looking for does not exist or has been removed.
        </p>
        <Button className="mt-8">
          <Link to="/" className={'flex items-center'}>
            <Home className="mr-2 h-4 w-4" />
            Return to home page
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
