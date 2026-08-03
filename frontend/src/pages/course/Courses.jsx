import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../../Components/common/Navbar";
import { useNavigate } from "react-router-dom";
import { message, Modal, Rate } from "antd";
import { courseService } from "../../api/course.service";
import { learningService } from "../../api/learning.service";
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Badge } from "react-bootstrap";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [displayCount, setDisplayCount] = useState(6);
  
  const userId = localStorage.getItem("id");
  const authToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [currentCourseReviews, setCurrentCourseReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState("");

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState(null);

  const openReviews = async (courseId, courseName) => {
    setSelectedCourseName(courseName);
    setReviewsModalVisible(true);
    setReviewsLoading(true);
    try {
      const res = await courseService.getFeedbacks(courseId);
      if (res.success) {
        setCurrentCourseReviews(res.data);
      } else {
        setCurrentCourseReviews([]);
      }
    } catch (err) {
      console.error(err);
      setCurrentCourseReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await courseService.getAllCourses();
        if (coursesRes.success) setCourses(coursesRes.data);

        if (userId) {
          const enrollmentsRes = await learningService.getEnrollments(userId);
          if (enrollmentsRes.success) {
            setEnrolled(enrollmentsRes.data.map((item) => item.course_id));
          }
        }
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterBy === "enrolled") return matchesSearch && enrolled.includes(course.course_id);
      if (filterBy === "available") return matchesSearch && !enrolled.includes(course.course_id);
      return matchesSearch;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.course_name.localeCompare(b.course_name);
        case "instructor":
          return a.instructor.localeCompare(b.instructor);
        case "price":
          const priceA = Number(a.price) || 0;
          const priceB = Number(b.price) || 0;
          return priceA - priceB;
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchTerm, sortBy, filterBy, enrolled]);

  const displayedCourses = filteredAndSortedCourses.slice(0, displayCount);

  const initiateEnrollment = (course) => {
    if (!authToken) {
      message.error("You need to login to continue");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (course.price > 0) {
      setSelectedCourseForPayment(course);
      setPaymentModalVisible(true);
    } else {
      processEnrollment(course.course_id);
    }
  };

  const processEnrollment = async (courseId) => {
    const res = await learningService.enrollCourse(userId, courseId);
    if (res.success && res.data === "Enrolled successfully") {
      message.success("Course Enrolled successfully");
      setPaymentModalVisible(false);
      setTimeout(() => navigate(`/course/${courseId}`), 2000);
    } else if (res.success && res.data === "Course already enrolled") {
      message.info("You are already enrolled in this course");
      setPaymentModalVisible(false);
    } else {
      message.error("Failed to enroll");
    }
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar page="courses" />

      <Container className="py-5">
        <div className="mb-5">
          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search courses or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 shadow-sm border-0"
              />
            </Col>
            
            <Col md={3}>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-3 shadow-sm border-0"
              >
                <option value="name">Sort by Name</option>
                <option value="instructor">Sort by Instructor</option>
                <option value="price">Sort by Price</option>
              </Form.Select>
            </Col>
            
            <Col md={3}>
              <Form.Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="py-3 shadow-sm border-0"
              >
                <option value="all">All Courses</option>
                <option value="available">Available</option>
                <option value="enrolled">Enrolled</option>
              </Form.Select>
            </Col>
          </Row>

          <div className="d-flex justify-content-between align-items-center text-muted small">
            <span>Showing {displayedCourses.length} of {filteredAndSortedCourses.length} courses</span>
            {searchTerm && (
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : filteredAndSortedCourses.length === 0 ? (
          <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ height: '300px' }}>
            <div className="text-muted mb-3">
              <svg className="mx-auto" width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h5 className="text-muted">No courses found</h5>
            <p className="text-muted small">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <Row className="g-4 mb-5">
              {displayedCourses.map((course) => (
                <Col sm={6} lg={4} key={course.course_id}>
                  <Card className="h-100 shadow-sm border-0 hover-shadow transition">
                    <div className="position-relative overflow-hidden" onClick={() => navigate(`/course-info/${course.course_id}`)} style={{ cursor: 'pointer' }}>
                      <Card.Img 
                        variant="top" 
                        src={course.p_link} 
                        style={{ height: '200px', objectFit: 'cover' }}
                        className="transition-transform hover-scale"
                      />
                      <Badge bg="success" text="white" className="position-absolute top-0 end-0 m-3 px-3 py-2 shadow-lg fs-6 rounded-pill border border-white border-2">
                        <i className="bi bi-tag-fill me-1"></i> {course.price == 0 || course.price.toString().toLowerCase() === 'free' ? 'Free' : `₹${course.price.toString().replace(/[^0-9.]/g, '')}`}
                      </Badge>
                    </div>
                    
                    <Card.Body className="d-flex flex-column">
                      <Card.Title 
                        className="fw-bold mb-3 text-truncate-2 text-primary" 
                        title={course.course_name}
                        onClick={() => navigate(`/course-info/${course.course_id}`)} 
                        style={{ cursor: 'pointer' }}
                      >
                        {course.course_name.length < 8 ? `${course.course_name} Tutorial` : course.course_name}
                      </Card.Title>
                      
                      <Card.Text className="text-muted small mb-4 flex-grow-1">
                        <span className="d-inline-block bg-primary rounded-circle me-2" style={{ width: '8px', height: '8px' }}></span>
                        by {course.instructor}
                      </Card.Text>
                      
                      <div className="mb-4">
                        <Button 
                          variant="link" 
                          className="p-0 text-decoration-none fw-semibold"
                          onClick={() => openReviews(course.course_id, course.course_name)}
                        >
                          ⭐ View Reviews
                        </Button>
                      </div>

                      {enrolled.includes(course.course_id) ? (
                        <Button
                          variant="outline-success"
                          className="w-100 fw-bold py-2"
                          onClick={() => navigate("/learnings")}
                        >
                          ✓ Enrolled
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          className="w-100 fw-bold py-2"
                          onClick={() => initiateEnrollment(course)}
                        >
                          Enroll Now
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {displayedCourses.length < filteredAndSortedCourses.length && (
              <div className="text-center">
                <Button
                  variant="outline-secondary"
                  className="px-5 py-2 fw-bold"
                  onClick={loadMore}
                >
                  Load More Courses
                </Button>
              </div>
            )}
          </>
        )}
      </Container>

      <Modal
        title={`Reviews for ${selectedCourseName}`}
        open={reviewsModalVisible}
        onCancel={() => setReviewsModalVisible(false)}
        footer={null}
        width={600}
      >
        {reviewsLoading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : currentCourseReviews.length > 0 ? (
          <div className="pe-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {currentCourseReviews.map((review, idx) => (
              <div key={idx} className="bg-light p-3 rounded-3 mb-3 border">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold">{review.userName || "Student"}</span>
                  <Rate disabled defaultValue={review.rating} className="text-warning small" />
                </div>
                <p className="text-muted small mb-0">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 text-muted">
            <span className="display-4 d-block mb-3">⭐</span>
            No reviews yet for this course. Be the first to review after enrolling!
          </div>
        )}
      </Modal>

      <Modal
        title="Payment Confirmation"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
        width={400}
        centered
      >
        {selectedCourseForPayment && (
          <div className="text-center py-4">
            <div className="text-success mb-3">
              <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h5 className="fw-bold mb-2">{selectedCourseForPayment.course_name}</h5>
            <p className="text-muted mb-4">Total Amount to Pay:</p>
            <div className="display-6 fw-bold mb-4">₹{selectedCourseForPayment.price}</div>
            
            <Button
              variant="success"
              className="w-100 py-3 fw-bold fs-5 mb-3 d-flex align-items-center justify-content-center gap-2"
              onClick={() => processEnrollment(selectedCourseForPayment.course_id)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pay & Enroll
            </Button>
            <p className="text-muted small d-flex justify-content-center align-items-center gap-1">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure simulated payment
            </p>
          </div>
        )}
      </Modal>

      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
          transform: translateY(-5px);
        }
        .transition {
          transition: all .3s ease-in-out;
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }
        .transition-transform {
          transition: transform .3s ease;
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Courses;