import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { CountryProvider } from './context/CountryContext';
import CountryModal from './components/CountryModal';

function App() {
  return (
    <AuthProvider>
      <CountryProvider>
        <CountryModal />
        <RouterProvider router={router} />
      </CountryProvider>
    </AuthProvider>
  );
}

export default App;
