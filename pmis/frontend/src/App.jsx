import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <>
      <div className="flagbar top" aria-hidden="true"></div>
      <header className="gov" role="banner">
        <div className="container">
          <div className="row brand">
            <div className="emblem" aria-hidden="true"></div>
            <div>
              <h1 className="site-title">
                <span>Prime Minister's Internship</span>
                <small>Unified Opportunities Portal</small>
              </h1>
            </div>
            <nav className="primary" aria-label="Primary">
              <Link to="/">Internships</Link>
              <Link to="/login" className="btn ghost">Login</Link>
              <Link to="/register" className="btn accent">Register</Link>
            </nav>
          </div>
        </div>
      </header>
      <main id="main" className="main" role="main">
        <Outlet />
      </main>
      <div className="flagbar bottom" aria-hidden="true"></div>
    </>
  )
}

export default App
