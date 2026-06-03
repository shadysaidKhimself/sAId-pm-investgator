import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChatPage } from './pages/ChatPage';
import { HistoryPage } from './pages/HistoryPage';

function App() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDark = () => setIsDark((d) => !d);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage isDark={isDark} onToggleDark={toggleDark} />} />
        <Route path="/history" element={<HistoryPage isDark={isDark} onToggleDark={toggleDark} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
