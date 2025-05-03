
import logo from '../resources/img/logo-with-text.svg';
import profilePic from '../resources/img/default-profile.png';


function Navbar() {
  return (
    <>
        <div className="filter-options">
          <a className="filter" href="#">Price +</a>
          <a className="filter" href="#">Genre +</a>
          <a className="filter" href="#">Platforms +</a>
        </div>
    </>
  );
}

export default Navbar;