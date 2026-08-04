import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Badge, Alert } from "react-bootstrap";
import { Rate, message, Modal } from "antd";
import Navbar from "../../Components/common/Navbar";
import { courseService } from "../../api/course.service";
import { learningService } from "../../api/learning.service";
import { paymentService } from "../../api/payment.service";

function CourseInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  
  const userId = localStorage.getItem("id");
  const authToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCourseById(id);
        if (res.success) {
          setCourse(res.data);
        } else {
          setError(true);
        }

        const reviewRes = await courseService.getFeedbacks(id);
        if (reviewRes.success) {
          setReviews(reviewRes.data);
        }

        if (userId) {
          const enrollmentsRes = await learningService.getEnrollments(userId);
          if (enrollmentsRes.success) {
            const enrolledCourseIds = enrollmentsRes.data.map((item) => item.course_id.toString());
            setIsEnrolled(enrolledCourseIds.includes(id.toString()));
          }
        }
      } catch (err) {
        console.error("Error fetching course info:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, userId]);

  const initiateEnrollment = () => {
    if (!authToken) {
      message.info("Please login to enroll in this course.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const priceStr = course.price ? course.price.toString() : "0";
    const numericPrice = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;

    if (numericPrice > 0 && priceStr.toLowerCase() !== "free") {
      setPaymentModalVisible(true);
    } else {
      processEnrollment();
    }
  };

  const processEnrollment = async () => {
    try {
      const priceStr = course.price ? course.price.toString() : "0";
      const numericPrice = parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;

      if (numericPrice > 0 && priceStr.toLowerCase() !== "free") {
        // Razorpay Payment Flow
        const amount = parseInt(course.price.toString().replace(/[^0-9]/g, ''), 10);
        const orderRes = await paymentService.createOrder({ courseId: course.course_id, userId, amount });
        
        if (!orderRes.success) {
          message.error("Failed to initiate payment");
          return;
        }

        const options = {
          key: "rzp_test_TLlt7rOJu3XzOF", // Razorpay Test Key
          amount: amount * 100,
          currency: "INR",
          name: "CourseNexus Academy",
          description: course.course_name,
          order_id: typeof orderRes.data === 'string' ? JSON.parse(orderRes.data).id : orderRes.data.id,
          handler: async function (response) {
            const verifyRes = await paymentService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              courseId: course.course_id,
              userId,
              amount
            });

            if (verifyRes.success) {
              message.success("Payment successful! Course Enrolled.");
              setPaymentModalVisible(false);
              setTimeout(() => navigate(`/course/${course.course_id}`), 2000);
            } else {
              message.error("Payment verification failed");
            }
          },
          prefill: {
            name: "Student",
            email: "student@coursenexus.com",
            contact: "9999999999"
          },
          theme: {
            color: "#0d6efd"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          message.error(response.error.description || "Payment Failed");
        });
        rzp.open();
        
      } else {
        // Free Course Flow
        const res = await learningService.enrollCourse(userId, course.course_id);
        if (res.success && res.data === "Enrolled successfully") {
          message.success("Course Enrolled successfully");
          setPaymentModalVisible(false);
          setTimeout(() => navigate(`/course/${course.course_id}`), 2000);
        } else if (res.success && res.data === "Course already enrolled") {
          message.info("You are already enrolled in this course");
          setPaymentModalVisible(false);
          setIsEnrolled(true);
        } else {
          message.error("Failed to enroll");
        }
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to process enrollment");
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex flex-column">
        <Navbar />
        <Container className="flex-grow-1 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </Container>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-vh-100 bg-light d-flex flex-column">
        <Navbar />
        <Container className="flex-grow-1 py-5">
          <Alert variant="danger">Failed to load course details. Please try again later.</Alert>
          <Button variant="outline-primary" onClick={() => navigate("/courses")}>Back to Courses</Button>
        </Container>
      </div>
    );
  }

  const priceDisplay = course.price == 0 || course.price.toString().toLowerCase() === 'free' 
    ? 'Free' 
    : `₹${course.price.toString().replace(/[^0-9.]/g, '')}`;

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-dark text-white py-5 mb-5 shadow">
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="mb-4 mb-lg-0">
              <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill shadow-sm">
                Development
              </Badge>
              <h1 className="display-4 fw-bold mb-4">{course.course_name}</h1>
              <div className="d-flex align-items-center mb-4">
                <span className="text-warning fw-bold fs-5 me-2">⭐ {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "New"}</span>
                <span className="text-light opacity-75">({reviews.length} reviews)</span>
                <span className="mx-3 text-light opacity-50">|</span>
                <span className="text-light opacity-75"><i className="bi bi-person-fill me-2"></i>Created by <strong>{course.instructor}</strong></span>
              </div>
            </Col>
            
            {/* Action Card Overlapping Hero */}
            <Col lg={4} className="offset-lg-1 position-relative">
              <Card className="shadow-lg border-0 rounded-4" style={{ top: '30px' }}>
                <Card.Img 
                  variant="top" 
                  src={course.p_link} 
                  className="rounded-top-4" 
                  style={{ height: '220px', objectFit: 'cover' }}
                />
                <Card.Body className="p-4">
                  <h2 className="fw-bold mb-4 d-flex align-items-center text-dark">
                    <i className="bi bi-tag-fill text-success me-2 fs-3"></i> {priceDisplay}
                  </h2>
                  
                  {isEnrolled ? (
                    <Button 
                      variant="success" 
                      className="w-100 py-3 fw-bold fs-5 rounded-3 mb-3"
                      onClick={() => navigate(`/course/${course.course_id}`)}
                    >
                      <i className="bi bi-play-circle-fill me-2"></i> Go to Course
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      className="w-100 py-3 fw-bold fs-5 rounded-3 mb-3"
                      onClick={initiateEnrollment}
                    >
                      Enroll Now
                    </Button>
                  )}
                  
                  <div className="text-center small text-muted">
                    <p className="mb-0"><i className="bi bi-shield-check text-success me-1"></i> Full lifetime access</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="pb-5">
        <Row>
          <Col lg={7}>
            {/* Description Section */}
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body className="p-4 p-md-5">
                <h3 className="fw-bold mb-4 border-bottom pb-3">Course Description</h3>
                <p className="text-muted" style={{ lineHeight: '1.8' }}>
                  {course.description || "This course is designed to provide you with a comprehensive understanding of the core concepts. You will start with the absolute basics and gradually build up your skills through hands-on exercises, real-world projects, and theoretical explanations."}
                </p>
                <h5 className="fw-bold mt-4 mb-3">What you'll learn:</h5>
                <Row className="g-3">
                  <Col sm={6}>
                    <div className="d-flex text-muted"><i className="bi bi-check-circle-fill text-success me-2 mt-1"></i> Build a strong foundation</div>
                  </Col>
                  <Col sm={6}>
                    <div className="d-flex text-muted"><i className="bi bi-check-circle-fill text-success me-2 mt-1"></i> Master advanced techniques</div>
                  </Col>
                  <Col sm={6}>
                    <div className="d-flex text-muted"><i className="bi bi-check-circle-fill text-success me-2 mt-1"></i> Apply concepts to real projects</div>
                  </Col>
                  <Col sm={6}>
                    <div className="d-flex text-muted"><i className="bi bi-check-circle-fill text-success me-2 mt-1"></i> Best practices and design patterns</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Reviews Section */}
            <h3 className="fw-bold mb-4 mt-5"><i className="bi bi-star-fill text-warning me-2"></i> Student Feedback</h3>
            
            {reviews.length > 0 ? (
              <Row className="g-4">
                {reviews.map((review, idx) => (
                  <Col md={12} key={idx}>
                    <Card className="border-0 shadow-sm rounded-4">
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '45px', height: '45px' }}>
                              {(review.userName || "S")[0].toUpperCase()}
                            </div>
                            <div>
                              <h6 className="fw-bold mb-0">{review.userName || "Student"}</h6>
                              <Rate disabled defaultValue={review.rating} className="text-warning small" style={{ fontSize: '14px' }} />
                            </div>
                          </div>
                        </div>
                        <p className="text-muted fst-italic mb-0" style={{ lineHeight: '1.6' }}>"{review.comment}"</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="border-0 shadow-sm rounded-4 bg-white text-center py-5">
                <Card.Body>
                  <i className="bi bi-chat-square-text text-muted fs-1 mb-3"></i>
                  <h5 className="text-muted fw-bold">No reviews yet</h5>
                  <p className="text-muted small">Be the first to review this course after enrolling!</p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      {/* Payment Modal */}
      <Modal
        title="Payment Confirmation"
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
        width={400}
        centered
      >
        <div className="text-center py-4">
          <div className="text-success mb-3">
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h5 className="fw-bold mb-2">{course?.course_name}</h5>
          <p className="text-muted mb-4">Total Amount to Pay:</p>
          <div className="display-6 fw-bold mb-4 text-success">{priceDisplay}</div>
          
          <Button
            variant="success"
            className="w-100 py-3 fw-bold fs-5 mb-3 d-flex align-items-center justify-content-center gap-2"
            onClick={processEnrollment}
          >
            <i className="bi bi-credit-card"></i> Proceed to Pay
          </Button>
          <p className="text-muted small d-flex justify-content-center align-items-center gap-1">
            <i className="bi bi-shield-lock-fill"></i> Secure payment via Razorpay
          </p>
        </div>
      </Modal>

    </div>
  );
}

export default CourseInfo;
