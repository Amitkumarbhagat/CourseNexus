import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/common/Navbar";
import Footer from "../../Components/common/Footer";
import { faGraduationCap, faAward, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import bannerImg from "../../assets/images/home-banner.png";

function Home() {
  const navigate = useNavigate();

  const featureData = [
    {
      icon: faGraduationCap,
      title: "Scholarship Facility",
      desc: "Originality is the essence of true scholarship.",
      color: "text-primary"
    },
    {
      icon: faStar,
      title: "Valuable Courses",
      desc: "Online education is like a rising tide—it lifts all boats.",
      color: "text-warning"
    },
    {
      icon: faAward,
      title: "Global Certification",
      desc: "A certificate without knowledge is like a gun without bullets.",
      color: "text-success"
    }
  ];

  return (
    <div className="bg-light min-vh-100">
      <Navbar page="home" />

      {/* Hero Section */}
      <section 
        className="d-flex align-items-center justify-content-center text-center text-white position-relative overflow-hidden vh-100"
      >
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ 
            backgroundImage: `url(${bannerImg})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: 'blur(5px) brightness(40%)',
            zIndex: 0
          }}
        ></div>
        
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <h1 className="display-3 fw-bold mb-4">
            Enhance your future with <br />
            <span className="text-info">CourseNexus Academy</span>
          </h1>
          <p className="lead mb-5 mx-auto" style={{ maxWidth: '600px' }}>
            Unlock your potential with hundreds of courses, certifications, and skills to grow your career.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="warning" size="lg" className="fw-bold px-4" onClick={() => navigate("/courses")}>
              Explore Courses
            </Button>
            <Button variant="light" size="lg" className="fw-bold px-4 text-primary" href="#features">
              Learn More
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 text-center bg-white">
        <Container>
          <h2 className="fw-bold mb-2">Awesome Features</h2>
          <p className="text-muted mb-5">Chance to enhance yourself</p>
          <Row className="g-4 justify-content-center">
            {featureData.map((feature, index) => (
              <Col md={4} key={index}>
                <Card className="h-100 border-0 shadow-sm py-4 hover-shadow transition">
                  <Card.Body>
                    <FontAwesomeIcon icon={feature.icon} className={`fs-1 mb-3 ${feature.color}`} />
                    <Card.Title className="fw-bold">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">{feature.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Simple Stats Section */}
      <section className="py-5 bg-white border-top border-bottom border-light">
        <Container>
          <Row className="g-4 text-center justify-content-center">
            <Col md={3}>
              <h2 className="display-4 fw-bold text-primary mb-1">50+</h2>
              <p className="text-muted fw-semibold">Expert Instructors</p>
            </Col>
            <Col md={3}>
              <h2 className="display-4 fw-bold text-success mb-1">100+</h2>
              <p className="text-muted fw-semibold">Premium Courses</p>
            </Col>
            <Col md={3}>
              <h2 className="display-4 fw-bold text-warning mb-1">10k+</h2>
              <p className="text-muted fw-semibold">Active Students</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Simple CTA Section */}
      <section className="py-5 bg-info bg-opacity-10 text-center">
        <Container>
          <h2 className="fw-bold mb-3">Ready to start learning?</h2>
          <p className="lead mb-4">Join thousands of learners and access our top courses today.</p>
          <Button variant="primary" size="lg" className="px-5 fw-bold" onClick={() => navigate("/register")}>
            Register Now
          </Button>
        </Container>
      </section>

      <Footer />
      
      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
          transform: translateY(-5px);
        }
        .transition {
          transition: all .3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Home;
