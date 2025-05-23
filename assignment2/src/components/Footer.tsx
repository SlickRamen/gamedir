import logo from '../resources/img/logo-with-text.svg';

function Footer() {
  return (
    <div className="footer">
        <img className="footer-logo" src={logo} alt="Logo"/>
        <div className="footer-grid">
          <div className="footer-grid-item">
            A dayly product.
          </div>
          <div className="footer-grid-item">
            {/* Info
            <hr/>
            About<br/>
            Blog<br/>
            FAQ<br/> */}
          </div>
          <div className="footer-grid-item">
            {/* Support
            <hr/>
            Help<br/>
            Bug report<br/> */}
          </div>
          <div className="footer-grid-item">
            {/* Business
            <hr/>
            Monetization<br/>
            Billing<br/> */}
          </div>
        </div>
    </div>
  );
}

export default Footer;