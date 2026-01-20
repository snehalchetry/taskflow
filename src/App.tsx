
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';

type Screen = 'login' | 'register' | 'dashboard';

interface RegisteredUser {
  email: string;
  name: string;
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  // Simple mock "database" of registered users
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([
    { email: 'demo@taskflow.io', name: 'Demo User' } // Default demo user
  ]);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);

  const handleLogin = (email: string) => {
    const user = registeredUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setCurrentScreen('dashboard');
      return true;
    }
    return false;
  };

  const handleRegister = (name: string, email: string) => {
    if (registeredUsers.some(u => u.email === email)) return false;
    const newUser = { name, email };
    setRegisteredUsers([...registeredUsers, newUser]);
    setCurrentUser(newUser);
    setCurrentScreen('dashboard');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const goToRegister = () => setCurrentScreen('register');
  const goToLogin = () => setCurrentScreen('login');

  return (
    <div className="min-h-screen">
      {currentScreen === 'login' && (
        <LoginPage 
          onLogin={handleLogin} 
          onGoToRegister={goToRegister} 
        />
      )}
      {currentScreen === 'register' && (
        <RegisterPage 
          onRegister={handleRegister} 
          onGoToLogin={goToLogin} 
        />
      )}
      {currentScreen === 'dashboard' && currentUser && (
        <Dashboard 
          user={currentUser} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

export default App;
