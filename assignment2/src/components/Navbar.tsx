
import logo from '../resources/img/logo-with-text.svg';

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useAuthStore } from '../authStore';
import ProfilePicture from './ProfilePicture';
import ProfileDropdown from './ProfileDropdown';
import React from 'react';

function Navbar() {
  const token = useAuthStore((state) => state.token);

  return (
    <>
        <header className="header">
          <img src={logo} className="nav-logo" alt="logo" />
          <ul className="nav-links">
            {/* <li><Link className="nav-link" to={`/`}>hot</Link></li>
            <li><Link className="nav-link" to={`/`}>fresh</Link></li> */}
            <li><Link className="nav-link" to={`/`}>explore</Link></li>
            { token ? (
              <>
                <li><Link className="nav-link" to={`/my-games`}>my games</Link></li>
                <li><Link className="nav-link" to={`/game/create`}>create game</Link></li>
              </>
              ) : <></> }
          </ul>
          <div className="row float-right">
            { token ? (
              <>
                <ProfileDropdown/>
              </>
            ) : (<>
              <Link className="button" to={`/register`}>Register</Link>
              <Link className="button" to={`/signin`}>Sign In</Link>
            </>)}
          </div>
        </header>
    </>
  );
}

export default React.memo(Navbar);