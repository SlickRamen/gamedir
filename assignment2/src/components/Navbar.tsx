
import logo from '../resources/img/logo-with-text.svg';
import profilePic from '../resources/img/profile-picture.png';

const profileBadgeStyle = {
    marginLeft: "auto",
 }

function Navbar() {
  return (
    <>
        <header className="header">
          <img src={logo} className="nav-logo" alt="logo" />
          <ul className="nav-links">
            <li><a className="nav-link" href="#">hot</a></li>
            <li><a className="nav-link" href="#">fresh</a></li>
            <li><a className="nav-link" href="#">explore</a></li>
          </ul>
          <div className="profile-badge" style={profileBadgeStyle}>
            <img src={profilePic}></img>
          </div>
        </header>
    </>
  );
}

export default Navbar;