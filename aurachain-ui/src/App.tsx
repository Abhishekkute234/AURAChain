// aurachain-ui/src/App.tsx
import { useEffect } from 'react';
import MainLayout from './layout/MainLayout';
import ChatInterface from './components/Chat/ChatInterface';
import { useUIStore } from './store/uiStore';

function App() {
  const { initializeSession } = useUIStore();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  return (
    <MainLayout>
      <ChatInterface />
    </MainLayout>
  );
}

export default App;
