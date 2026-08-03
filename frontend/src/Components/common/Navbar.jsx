import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChalkboardUser, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { authService } from "../../api/auth.service";
import { Navbar as BsNavbar, Nav, Container, Button } from "react-bootstrap";

function Navbar(props) {
  const value = props.page;
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isUserAuthenticated());

  const handleLogOut = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <BsNavbar bg="white" expand="lg" className="shadow-sm py-2 sticky-top">
      <Container fluid className="px-4">
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <img src={logo} alt="CourseNexus Logo" style={{ height: "45px" }} className="d-inline-block align-top" />
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`fw-bold mx-2 ${value === "home" ? "text-primary border-bottom border-primary border-2" : "text-dark hover-primary"}`}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/courses" 
              className={`fw-bold mx-2 ${value === "courses" ? "text-primary border-bottom border-primary border-2" : "text-dark hover-primary"}`}
            >
              All Courses
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/about" 
              className={`fw-bold mx-2 ${value === "about" ? "text-primary border-bottom border-primary border-2" : "text-dark hover-primary"}`}
            >
              About Us
            </Nav.Link>

            {isAuthenticated && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/profile" 
                  className={`fw-bold mx-2 ${value === "profile" ? "text-primary border-bottom border-primary border-2" : "text-dark hover-primary"}`}
                >
                  Profile <FontAwesomeIcon icon={faUser} className="ms-1" />
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/learnings" 
                  className={`fw-bold mx-2 ${value === "learnings" ? "text-primary border-bottom border-primary border-2" : "text-dark hover-primary"}`}
                >
                  Learnings <FontAwesomeIcon icon={faChalkboardUser} className="ms-1" />
                </Nav.Link>
              </>
            )}
            
            <div className="ms-3 mt-2 mt-lg-0">
              {isAuthenticated ? (
                <Button variant="primary" className="fw-bold px-4 rounded-pill d-flex align-items-center gap-2 shadow-sm" onClick={handleLogOut}>
                  Sign Out
                </Button>
              ) : (
                <Button variant="primary" className="fw-bold px-4 rounded-pill d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate("/login")}>
                  <FontAwesomeIcon icon={faGraduationCap} /> Login/SignUp
                </Button>
              )}
            </div>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
      <style>{`
        .hover-primary:hover {
          color: #0d6efd !important;
        }
      `}</style>
    </BsNavbar>
  );
}

export default Navbar;