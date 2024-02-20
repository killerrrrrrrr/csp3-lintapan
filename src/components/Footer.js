import React from 'react';
import { Container, Row, Col, Image, Nav} from 'react-bootstrap';
import { useContext } from 'react';
import UserContext from '../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Navbar, NavLink, BrowserRouter} from 'react-router-dom'


const Footer = () => {

  const { user } = useContext(UserContext);


  return (
    <footer className="extravagant-footer" >
      <Container>
        <Row>
          <Col md={4}>
            <h3 className="text-danger">Tensai. 天才</h3>
            <p className="footer-text">
              We've got a poster to please all kinds of anime fans.
            </p>
            <div className="social-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} className="social-icon" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} className="social-icon" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} className="social-icon" />
              </a>
            </div>
          </Col>
          <Col md={4}>
            <h5 className="text-danger">Useful Links</h5>
            <Nav.Link as={NavLink} to="/" exact >Home</Nav.Link>
                  <Nav.Link as={NavLink} to="/products" exact>Products</Nav.Link>

                  {(user.id !== null) 
                  ?
                    user.isAdmin 
                    ?
                    <>
                      <Nav.Link as={NavLink} to="/orders" exact>Orders</Nav.Link>
                      <Nav.Link as={NavLink} to="/logout" exact>Logout</Nav.Link>
                    </> 
                    :

                    <>
                      <Nav.Link as={NavLink} to="/profile" exact>Profile</Nav.Link>
                      <Nav.Link as={NavLink} to="/myorders" exact>Orders</Nav.Link>
                      <Nav.Link as={NavLink} to="/logout" exact>Logout</Nav.Link>
                    </>
                  :
                    <>
                      <Nav.Link as={NavLink} to="/login" exact>Login</Nav.Link>
                      <Nav.Link as={NavLink} to="/register" exact>Register</Nav.Link>

                    </>
                  }
          </Col>
          <Col md={4}>
            <h5 className="text-danger">Contact Us</h5>
            <p className="footer-text">
              Address: 123, Example Street, City <br />
              Phone: +123456789 <br />
              Email: info@example.com
            </p>
          </Col>
        </Row>
        <hr className="footer-divider" />
        <Row>
          <Col className="text-center">
            <p className="footer-bottom-text">
              &copy; {new Date().getFullYear()} Tensai. 天才 All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
