import React from 'react';
import './Navbar.scss';

class Navbar extends React.Component {
  render() {
    return (
      <header className="navbar">
        <div>
          <a className="btn shadow" href="#">
            Nihongo Trainer
          </a>
        </div>
        <div>
          <a className="btn shadow" href="#">
            Login
          </a>
          <a className="btn shadow" href="#">
            Register
          </a>
        </div>
      </header>
    );
  }
}

export default Navbar;
