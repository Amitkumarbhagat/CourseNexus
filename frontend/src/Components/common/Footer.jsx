import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="text-light pt-5 pb-3 mt-5" style={{ backgroundColor: '#1a1d20' }}>
      <Container>
        <Row className="mb-4 g-5 justify-content-between">
          {/* Brand & About */}
          <Col lg={4}>
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary rounded p-2 me-3 d-flex align-items-center justify-content-center">
                <FontAwesomeIcon icon={faGraduationCap} className="fs-3 text-white" />
              </div>
              <h3 className="text-white fw-bold mb-0">CourseNexus</h3>
            </div>
            <p className="text-light opacity-75" style={{ lineHeight: '1.8' }}>
              Empowering learners worldwide with accessible, high-quality education. Join us to upgrade your skills and boost your career in a dynamic world.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} lg={3}>
            <h5 className="text-white fw-bold mb-4 position-relative pb-2" style={{ borderBottom: '2px solid #0d6efd', display: 'inline-block' }}>Explore</h5>
            <ul className="list-unstyled">
              <li className="mb-3"><a href="/" className="text-light opacity-75 text-decoration-none hover-primary transition d-flex align-items-center"><span className="text-primary me-2">›</span> Home</a></li>
              <li className="mb-3"><a href="/courses" className="text-light opacity-75 text-decoration-none hover-primary transition d-flex align-items-center"><span className="text-primary me-2">›</span> All Courses</a></li>
              <li className="mb-3"><a href="/about" className="text-light opacity-75 text-decoration-none hover-primary transition d-flex align-items-center"><span className="text-primary me-2">›</span> About Us</a></li>
              <li className="mb-3"><a href="/login" className="text-light opacity-75 text-decoration-none hover-primary transition d-flex align-items-center"><span className="text-primary me-2">›</span> Login / Register</a></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={5} lg={4}>
            <h5 className="text-white fw-bold mb-4 position-relative pb-2" style={{ borderBottom: '2px solid #0d6efd', display: 'inline-block' }}>Get In Touch</h5>
            <ul className="list-unstyled text-light opacity-75">
              <li className="mb-3 d-flex align-items-start">
                <span className="text-primary me-3 mt-1"><i className="bi bi-geo-alt-fill"></i></span>
                <div>
                  <strong className="text-white d-block mb-1">Address</strong>
                  CDAC, Sector 7, CBD Belapur, Navi Mumbai
                </div>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <span className="text-primary me-3 mt-1"><i className="bi bi-envelope-fill"></i></span>
                <div>
                  <strong className="text-white d-block mb-1">Email</strong>
                  info@coursenexus.com
                </div>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <span className="text-primary me-3 mt-1"><i className="bi bi-telephone-fill"></i></span>
                <div>
                  <strong className="text-white d-block mb-1">Phone</strong>
                  +91 12345 67890
                </div>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Copyright + Socials */}
        <div className="border-top border-secondary pt-4 mt-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-3 mb-md-0 text-light opacity-75 small">
            © {new Date().getFullYear()} CourseNexus Academy. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <a href="#" className="btn btn-outline-secondary text-light rounded-circle p-2 d-flex align-items-center justify-content-center social-btn transition" style={{width: '40px', height: '40px'}}>
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="btn btn-outline-secondary text-light rounded-circle p-2 d-flex align-items-center justify-content-center social-btn transition" style={{width: '40px', height: '40px'}}>
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" className="btn btn-outline-secondary text-light rounded-circle p-2 d-flex align-items-center justify-content-center social-btn transition" style={{width: '40px', height: '40px'}}>
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
        </div>
      </Container>
      <style>{`
        .hover-primary:hover {
          color: #0d6efd !important;
          transform: translateX(5px);
        }
        .transition {
          transition: all 0.3s ease;
        }
        .social-btn:hover {
          background-color: #0d6efd;
          border-color: #0d6efd;
          transform: translateY(-3px);
        }
      `}</style>
    </footer>
  );
}

export default Footer;