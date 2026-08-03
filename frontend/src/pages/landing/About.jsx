import React from "react";
import Navbar from "../../Components/common/Navbar";
import Footer from "../../Components/common/Footer";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

function About() {
  const teamMembers = [
    {
      id: 1,
      name: "Pragyaraj Solanki",
      role: "Lead Developer",
      desc: "Architects the entire learning management system and ensures smooth operations.",
      img: "https://picsum.photos/id/10/150/150"
    },
    {
      id: 2,
      name: "Amit Bhagat",
      role: "Backend Specialist",
      desc: "Manages database optimization and robust API integrations.",
      img: "https://picsum.photos/id/13/150/150"
    },
    {
      id: 3,
      name: "Sreekar",
      role: "UI/UX Designer",
      desc: "Creates intuitive and beautiful interfaces that users love to interact with.",
      img: "https://picsum.photos/id/28/150/150"
    },
    {
      id: 4,
      name: "Sunil",
      role: "Frontend Engineer",
      desc: "Brings designs to life with responsive and modern web components.",
      img: "https://picsum.photos/id/29/150/150"
    },
    {
      id: 5,
      name: "Vaishali",
      role: "Content Strategist",
      desc: "Curates the best courses and ensures high-quality content delivery.",
      img: "https://picsum.photos/id/15/150/150"
    },
    {
      id: 6,
      name: "Aruna",
      role: "Quality Assurance",
      desc: "Ensures every release is bug-free and meets our high standards.",
      img: "https://picsum.photos/id/17/150/150"
    }
  ];

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar page="about" />

      <Container className="py-5 flex-grow-1">
        {/* Team Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-dark mb-3">Meet Our Team</h1>
          <p className="text-muted lead mx-auto" style={{ maxWidth: "600px" }}>
            We are a group of passionate individuals dedicated to providing the best learning experience.
          </p>
        </div>

        <Row className="g-4 justify-content-center mb-5">
          {teamMembers.map((member) => (
            <Col md={4} key={member.id}>
              <Card className="h-100 border-0 shadow-sm text-center py-4 rounded-4 hover-shadow transition">
                <div className="mx-auto mt-3 mb-2 rounded-circle overflow-hidden shadow-sm" style={{ width: "120px", height: "120px" }}>
                  <img src={member.img} alt={member.name} className="w-100 h-100 object-fit-cover" />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold fs-4 mb-1">{member.name}</Card.Title>
                  <Card.Subtitle className="text-primary fw-medium mb-3">{member.role}</Card.Subtitle>
                  <Card.Text className="text-muted px-3">
                    {member.desc}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Location Section */}
        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4">
          <Row className="align-items-center g-4">
            <Col lg={5}>
              <h2 className="fw-bold mb-4">Our Location</h2>
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "45px", height: "45px" }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="fs-5" />
                </div>
                <div>
                  <h5 className="fw-bold mb-1">CDAC Kharghar</h5>
                  <p className="text-muted mb-0">
                    Raintree Marg, Near Bharati Vidyapeeth, <br />
                    Sector 7, CBD Belapur, <br />
                    Navi Mumbai, Maharashtra 400614
                  </p>
                </div>
              </div>
              <p className="text-muted">
                Come visit us at our headquarters! We are always open to collaborating with bright minds and passionate learners.
              </p>
            </Col>
            <Col lg={7}>
              <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: "350px" }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.44265721832!2d73.0543621!3d19.0252877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c24cce39457b%3A0x8bd69eab297890b0!2sCentre%20for%20Development%20of%20Advanced%20Computing%20(CDAC)!5e0!3m2!1sen!2sin!4v1684123456789!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CDAC Kharghar Map"
                ></iframe>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

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

export default About;
