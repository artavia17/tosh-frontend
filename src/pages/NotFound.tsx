import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page-container" style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', margin: '0' }}>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/" className="link">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
