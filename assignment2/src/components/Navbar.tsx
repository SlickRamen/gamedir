
import logo from '../resources/img/logo-with-text.svg';
import profilePic from '../resources/img/profile-picture.png';

const floatRight = {
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
          <div className="row" style={floatRight}>
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