import { Link, Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="container navbar-content">
          <Link to="/" className="logo">
            🍰 Pat's Bakery
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Recipes</Link>
            <Link to="/add" className="nav-link">Add Recipe</Link>
          </div>
        </div>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
};
