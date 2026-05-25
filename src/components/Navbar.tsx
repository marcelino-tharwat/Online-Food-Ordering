import { Link } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Electro Pi</Link>
        <div className="flex space-x-4">
          <Link to="/menu" className="hover:underline">Menu</Link>
          {token ? (
            <>
              <Link to="/cart" className="hover:underline">Cart</Link>
              <Link to="/orders" className="hover:underline">Orders</Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/';
                }}
                className="hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
