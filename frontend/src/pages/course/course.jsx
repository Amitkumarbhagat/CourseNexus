import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { Progress, Modal } from "antd";
import { Play, Lock, MessageSquare, ArrowLeft, BookOpen, Users, Clock, Award } from "lucide-react";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import Feedback from "./Feedback";
import Forum from "./forum";
import { courseService } from "../../api/course.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { videoService } from "../../api/video.service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Container, Row, Col, Card, Button, Spinner, Alert, ListGroup } from "react-bootstrap";

const Course = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [course, setCourse] = useState({});
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressLoading, setProgressLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];
  const playerRef = useRef(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await courseService.getCourseById(courseId);
        setCourse(response.data);
        
        const videoRes = await videoService.getVideosByCourse(courseId);
        if (videoRes.success && videoRes.data.length > 0) {
          setVideos(videoRes.data);
          setCurrentVideo(videoRes.data[0]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    setVideoError(false);
  }, [currentVideo, course]);

  const downloadCertificate = async () => {
    const certificateElement = document.getElementById("certificate-template");
    if (!certificateElement) return;

    certificateElement.style.display = "block"; // Show it temporarily
    
    try {
      const canvas = await html2canvas(certificateElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`${course.course_name}_Certificate.pdf`);
    } finally {
      certificateElement.style.display = "none";
    }
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setProgressLoading(true);
        const res = await courseService.getLearningProgress(userId, courseId);
        if (res.success) {
          setProgressPercent(res.data);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setProgressLoading(false);
      }
    };

    if (userId && courseId) {
      fetchProgress();
    }
  }, [userId, courseId]);

  const updateProgressByClick = async (index) => {
    if (videos.length === 0) return;
    const calculatedPercent = Math.min(100, Math.ceil(((index + 1) / videos.length) * 100));
    
    if (calculatedPercent > progressPercent) {
      setProgressPercent(calculatedPercent);
      await courseService.updateLearningProgress(userId, courseId, calculatedPercent);
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-center py-5"><Alert variant="danger">Something went wrong!</Alert></div>;

  const getVideoUrl = (vidUrl) => {
    if (!vidUrl) return "";
    if (vidUrl.includes("cloudinary.com") && !vidUrl.match(/\.(mp4|webm|ogg)$/i)) {
      return vidUrl + ".mp4";
    }
    return vidUrl;
  };

  const currentDisplayUrl = getVideoUrl(currentVideo ? currentVideo.url : course.y_link);

  return (
    <div className="min-vh-100 py-4 bg-light">
      <Container>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <Button
            variant="light"
            onClick={() => navigate("/learnings")}
            className="d-flex align-items-center gap-2 shadow-sm px-4 py-2"
          >
            <FontAwesomeIcon icon={faBackward} />
            Back
          </Button>
          <div className="flex-grow-1 mx-4">
            <div className="bg-primary bg-gradient text-white rounded-3 p-3 text-center shadow-sm">
              <h3 className="h4 mb-0 fw-bold fst-italic">
                The Complete {course.course_name} Course – 2025 Edition
              </h3>
            </div>
          </div>
        </div>

        <Row className="g-4 mt-2">
          <Col lg={8}>
            {currentDisplayUrl ? (
              <div className="position-relative w-100 bg-black rounded-3 shadow-sm overflow-hidden d-flex align-items-center justify-content-center" style={{ height: '440px' }}>
                {(!ReactPlayer.canPlay(currentDisplayUrl) || videoError) && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white bg-black bg-opacity-75" style={{ zIndex: 20 }}>
                    <FontAwesomeIcon icon={faBackward} className="display-4 text-secondary mb-3" style={{ transform: 'rotate(180deg)' }} />
                    <span className="text-light fw-medium">
                      {videoError ? "Video playback failed. The URL might be invalid or broken." : "Invalid video URL format"}
                    </span>
                  </div>
                )}
                <ReactPlayer
                  ref={playerRef}
                  style={{ zIndex: 10 }}
                  onError={() => setVideoError(true)}
                  url={currentDisplayUrl}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
            ) : (
              <div className="w-100 bg-secondary bg-opacity-25 d-flex flex-column align-items-center justify-content-center rounded-3 shadow-sm border" style={{ height: '440px' }}>
                <FontAwesomeIcon icon={faBackward} className="display-4 text-secondary mb-3" />
                <span className="text-secondary fw-medium fs-5">No video available for this course yet</span>
              </div>
            )}
            
            {videos.length > 0 && (
              <Card className="mt-4 border-0 shadow-sm">
                <Card.Body>
                  <h5 className="fw-bold mb-3">Course Playlist</h5>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <ListGroup variant="flush">
                      {videos.map((vid, index) => (
                        <ListGroup.Item 
                          key={vid.id}
                          action
                          onClick={() => {
                            setCurrentVideo(vid);
                            updateProgressByClick(index);
                          }}
                          className={`d-flex align-items-center gap-3 py-3 ${currentVideo?.id === vid.id ? 'bg-primary bg-opacity-10 text-primary fw-bold' : ''}`}
                        >
                          <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${currentVideo?.id === vid.id ? 'bg-primary text-white' : 'bg-secondary bg-opacity-25 text-secondary'}`} style={{ width: '32px', height: '32px' }}>
                            {index + 1}
                          </div>
                          <span>
                            {vid.title}
                          </span>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Play size={20} className="text-primary" />
                  <h5 className="mb-0 fw-bold">Course Format</h5>
                </div>
                <p className="text-muted small mb-4">
                  This is a self-paced online course, consisting of video lectures, coding exercises,
                  and quizzes. You can complete the course at your own pace within 8 weeks.
                </p>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <BookOpen size={20} className="text-primary" />
                  <h5 className="mb-0 fw-bold">Prerequisites</h5>
                </div>
                <p className="text-muted small mb-4">
                  No prior programming experience is required, but basic computer literacy is recommended.
                </p>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <Users size={20} className="text-primary" />
                  <h5 className="mb-0 fw-bold">Who Should Take This Course</h5>
                </div>
                <ul className="text-muted small mb-4 ps-3">
                  <li>Beginners interested in learning programming.</li>
                  <li>Individuals looking to add {course.course_name} to their skillset.</li>
                  <li>Students preparing for computer science courses.</li>
                </ul>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <Award size={20} className="text-primary" />
                  <h5 className="mb-0 fw-bold">Course Completion</h5>
                </div>
                <p className="text-muted small mb-4">
                  Complete all video lessons to earn your certificate of completion.
                </p>

                {progressPercent >= 80 ? (
                  <Button
                    variant="success"
                    className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    onClick={downloadCertificate}
                  >
                    <Award size={20} />
                    Download Certificate
                  </Button>
                ) : (
                  <div className="bg-light text-secondary rounded p-3 text-center fw-bold border d-flex align-items-center justify-content-center gap-2">
                    <Lock size={16} />
                    Certificate Locked ({progressPercent}%)
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Certificate Template (Hidden) */}
        <div 
          id="certificate-template" 
          style={{ display: "none", width: "1122px", height: "793px", background: "#f8f9fa", padding: "40px", position: "relative" }}
        >
          <div style={{ border: "10px solid #0d6efd", background: "white", height: "100%", width: "100%", padding: "40px", textAlign: "center", position: "relative", boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)" }}>
            
            {/* Logo/Branding */}
            <div style={{ position: "absolute", top: "40px", left: "60px", textAlign: "left" }}>
               <h2 style={{ color: "#0d6efd", fontWeight: "bold", margin: 0 }}>CourseNexus</h2>
               <p style={{ color: "#6c757d", fontSize: "14px", margin: 0 }}>Empowering Learners</p>
            </div>

            <div style={{ position: "absolute", top: "40px", right: "60px" }}>
               <Award size={60} color="#0d6efd" />
            </div>

            <h1 style={{ fontSize: "56px", color: "#212529", marginBottom: "30px", marginTop: "80px", fontFamily: "serif", letterSpacing: "2px", textTransform: "uppercase" }}>Certificate of Completion</h1>
            
            <p style={{ fontSize: "24px", color: "#6c757d", marginBottom: "30px", fontStyle: "italic" }}>This is proudly presented to</p>
            
            <h2 style={{ fontSize: "52px", color: "#0d6efd", marginBottom: "30px", borderBottom: "2px solid #dee2e6", display: "inline-block", padding: "0 40px 10px 40px", fontFamily: "Georgia, serif" }}>
              {localStorage.getItem("name") || "Student"}
            </h2>
            
            <p style={{ fontSize: "20px", color: "#6c757d", marginBottom: "30px", maxWidth: "700px", margin: "0 auto 40px auto", lineHeight: "1.6" }}>
              for successfully completing all requirements and mastering the concepts of the course
            </p>
            
            <h3 style={{ fontSize: "40px", color: "#212529", marginBottom: "80px", fontWeight: "bold" }}>{course.course_name}</h3>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "80px", padding: "0 100px", alignItems: "flex-end" }}>
              <div style={{ textAlign: "center", width: "250px" }}>
                <div style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive", fontSize: "40px", color: "#000", marginBottom: "10px", transform: "rotate(-5deg)", height: "50px" }}>
                  {course.instructor || "Pragyaraj Solanki"}
                </div>
                <div style={{ borderTop: "2px solid #6c757d", paddingTop: "10px" }}>
                  <p style={{ fontSize: "16px", color: "#212529", margin: 0, fontWeight: "bold" }}>{course.instructor || "Course Instructor"}</p>
                  <p style={{ fontSize: "14px", color: "#6c757d", margin: 0 }}>Instructor, CourseNexus</p>
                </div>
              </div>

              <div style={{ textAlign: "center", width: "250px" }}>
                 <div style={{ fontSize: "20px", color: "#212529", marginBottom: "25px", fontWeight: "500" }}>
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div style={{ borderTop: "2px solid #6c757d", paddingTop: "10px" }}>
                  <p style={{ fontSize: "14px", color: "#6c757d", margin: 0 }}>Date of Completion</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <Card className="mt-4 border-0 shadow-sm">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <BookOpen size={20} className="text-primary" />
              <h5 className="mb-0 fw-bold">Description</h5>
            </div>
            <p className="text-muted fst-italic mb-0">{course.description}</p>
          </Card.Body>
        </Card>

        <Card className="mt-4 border-0 shadow-sm">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Clock size={20} className="text-primary" />
              <h5 className="mb-0 fw-bold">Progress</h5>
            </div>
            {progressLoading ? (
              <div className="d-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" variant="primary" />
                <span className="small text-muted">Loading progress...</span>
              </div>
            ) : (
              <>
                <Progress
                  percent={progressPercent}
                  status={progressPercent === 100 ? "success" : "active"}
                  strokeColor="#0d6efd"
                />
                <p className="mt-2 small text-muted mb-0">
                  You have completed <span className="fw-bold">{progressPercent}%</span> of this course.
                </p>
              </>
            )}
          </Card.Body>
        </Card>

        <div className="mt-4">
          <Button
            variant="primary"
            className="px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
            onClick={() => setIsDiscussionOpen(true)}
          >
            <MessageSquare size={16} />
            Discussion
          </Button>
        </div>

        <Modal
          title="Note:"
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        >
          <p className="fw-semibold">Complete 100% of your course to unlock the quiz.</p>
        </Modal>

        <Modal
          title={
            <div className="d-flex align-items-center gap-2">
              <MessageSquare size={20} className="text-primary" />
              Discussion Forum
            </div>
          }
          open={isDiscussionOpen}
          onCancel={() => setIsDiscussionOpen(false)}
          footer={null}
          width={800}
        >
          <Forum courseId={courseId} />
        </Modal>

        <div className="mt-5">
          <Feedback courseid={courseId} />
        </div>
      </Container>
    </div>
  );
};

export default Course;