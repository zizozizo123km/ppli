import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sun, Moon, Home, Users, Bell, MessageSquare, Menu, Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Lazy load components
const HomePage = lazy(() => import('./pages/HomePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const MessengerPage = lazy(() => import('./pages/MessengerPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Mock Auth Context
const AuthContext = React.createContext(null);

// Mock User Data
const MOCK_USER = {
  id: 1,
  name: 'John Doe',
  profilePicture: 'https://via.placeholder.com/150/007bff/ffffff?text=JD',
};

// --- Components ---

const NavbarIcon = ({ icon: Icon, to, label, count }) => {
  return (
    <div className="relative p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      {count > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
};

const Header = ({ toggleTheme, theme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = true; // Mock authentication status

  const navItems = [
    { icon: Home, to: '/', label: 'Home' },
    { icon: Users, to: '/friends', label: 'Friends' },
    { icon: Bell, to: '/notifications', label: 'Notifications', count: 5 },
    { icon: MessageSquare, to: '/messenger', label: 'Messenger', count: 3 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-800 dark:shadow-lg">
      <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto">
        {/* Left Section: Logo & Search */}
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-serif">
            facebook
          </h1>
          <div className="hidden lg:block">
            <input
              type="text"
              placeholder="Search Facebook"
              className="p-2 pl-8 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Center Section: Navigation Icons (Desktop/Tablet) */}
        <nav className="hidden md:flex flex-1 justify-center space-x-2 lg:space-x-8">
          {navItems.map((item) => (
            <NavbarIcon key={item.to} {...item} />
          ))}
        </nav>

        {/* Right Section: User & Actions */}
        <div className="flex items-center space-x-2">
          {/* Create Post Button */}
          <button className="hidden md:flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-150">
            <Plus className="w-5 h-5 dark:text-white" />
          </button>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150"
          >
            {theme === 'dark' ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-gray-700" />
            )}
          </button>

          {/* User Profile / Menu */}
          {isAuthenticated ? (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center p-0.5 rounded-full ring-2 ring-transparent hover:ring-blue-500 transition duration-150"
            >
              <img
                src={MOCK_USER.profilePicture}
                alt={MOCK_USER.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          ) : (
            <NavbarIcon icon={Menu} label="Menu" />
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <nav className="flex md:hidden justify-around border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        {navItems.map((item) => (
          <div key={item.to} className="w-1/4 flex justify-center py-2">
            <NavbarIcon {...item} />
          </div>
        ))}
      </nav>
    </header>
  );
};

const Layout = ({ children, toggleTheme, theme }) => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <Header toggleTheme={toggleTheme} theme={theme} />
    <main className="max-w-7xl mx-auto py-4 px-0 lg:px-4">
      {children}
    </main>
  </div>
);

// --- App Component ---

function App() {
  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock Auth State

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  
  const loadingFallback = (
    <div className="flex items-center justify-center h-screen dark:text-white">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user: MOCK_USER }}>
      <Router>
        <AnimatePresence mode="wait">
          {isAuthenticated ? (
            <Layout toggleTheme={toggleTheme} theme={theme}>
              <Suspense fallback={loadingFallback}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="/friends" element={<FriendsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/messenger" element={<MessengerPage />} />
                  {/* Catch all route */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
            </Layout>
          ) : (
            <Routes>
              <Route path="*" element={<Suspense fallback={loadingFallback}><LoginPage /></Suspense>} />
            </Routes>
          )}
        </AnimatePresence>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;