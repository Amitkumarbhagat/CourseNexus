import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Components/common/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { learningService } from "../../api/learning.service";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";

function Learnings() {
  const userId = localStorage.getItem("id");
  const [courses, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await learningService.getEnrollments(userId);
        setCourse(response.data);        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex flex-column">
        <Navbar page="learnings" />
        <Container className="flex-grow-1 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem', borderWidth: '0.25rem' }} />
        </Container>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-vh-100 bg-light d-flex flex-column">
        <Navbar page="learnings" />
        <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center py-5 mt-5">
          <h1 className="display-6 fw-bold mb-4 text-dark">
            You haven’t enrolled in any courses yet 🚀
          </h1>
          <p className="lead text-muted mb-5">
            Explore our collection of courses and begin your learning journey today.
          </p>
          <Button
            size="lg"
            variant="primary"
            className="px-5 shadow"
            onClick={() => navigate("/courses")}
          >
            Explore Courses
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar page="learnings" />

      <Container className="py-5 flex-grow-1">
        <Row className="justify-content-center g-4">
          {courses.map((course) => (
            <Col md={10} lg={6} key={course.id}>
              <Card className="flex-row align-items-center border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-shadow transition p-2">
                <Card.Img
                  src={course.p_link}
                  alt={course.course_name}
                  className="rounded-3 shadow-sm object-fit-cover m-2"
                  style={{ width: '150px', height: '110px' }}
                />
                <Card.Body className="d-flex flex-column justify-content-center py-2 pe-3">
                  <h5 className="fw-bold text-dark mb-1 text-truncate" title={course.course_name}>
                    {course.course_name.length < 15
                      ? `${course.course_name} Tutorial`
                      : course.course_name}
                  </h5>
                  <p className="small text-muted mb-3">
                    by {course.instructor}
                  </p>
                  <div className="mt-auto text-end">
                    <Link to={`/course/${course.course_id}`} className="text-decoration-none">
                      <Button variant="primary" size="sm" className="px-3 fw-semibold shadow-sm">
                        Start Learning
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
          transform: translateY(-2px);
        }
        .transition {
          transition: all .3s ease-in-out;
        }
        .object-fit-cover {
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}

export default Learnings;
