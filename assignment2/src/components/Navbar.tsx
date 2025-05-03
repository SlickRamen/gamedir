
import logo from '../resources/img/logo-with-text.svg';
import profilePic from '../resources/img/default-profile.png';
import { Link } from 'react-router-dom';


function Navbar() {
  return (
    <>
        <header className="header">
          <img src={logo} className="nav-logo" alt="logo" />
          <ul className="nav-links">
            <li><Link className="nav-link" to={`/`}>hot</Link></li>
            <li><Link className="nav-link" to={`/`}>fresh</Link></li>
            <li><Link className="nav-link" to={`/`}>explore</Link></li>
          </ul>
          <div className="row float-right">
            {/* <input placeholder='Search'></input> */}
            <div className="profile-badge">
              <img src={profilePic}></img>
            </div>
          </div>
        </header>
    </>
  );
}

export default Navbar;