import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faBookOpen, faClipboardList, faCheckCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import { message } from "antd";
import { adminService } from "../../api/admin.service";
import CourseModal from "./CourseModal";
import DeleteModal from "./DeleteModal";
import PlaylistModal from "./PlaylistModal";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [courseModal, setCourseModal] = useState({
    isOpen: false,
    mode: "add",
    courseId: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    course: null,
  });
  const [playlistModal, setPlaylistModal] = useState({
    isOpen: false,
    courseId: null,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllCoursesAdmin();
      if (result.success) {
        setCourses(result.data);
      } else {
        message.error(result.error);
      }
    } catch {
      message.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const openAddCourseModal = () => {
    setCourseModal({ isOpen: true, mode: "add", courseId: null });
  };

  const openEditCourseModal = (course) => {
    setCourseModal({ isOpen: true, mode: "edit", courseId: course.course_id });
  };

  const closeCourseModal = () => {
    setCourseModal({ isOpen: false, mode: "add", courseId: null });
  };

  const handleCourseSuccess = () => {
    fetchCourses();
  };

  const openDeleteModal = (course) => {
    setDeleteModal({ isOpen: true, course });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, course: null });
  };

  const handleDeleteCourse = async (course) => {
    return await adminService.deleteCourse(course.course_id);
  };

  const handleDeleteSuccess = () => {
    fetchCourses();
  };

  const handleApproveCourse = async (course_id) => {
    try {
      const result = await adminService.approveCourse(course_id);
      if (result.success) {
        message.success("Course approved successfully");
        fetchCourses();
      } else {
        message.error(result.error);
      }
    } catch {
      message.error("Failed to approve course");
    }
  };

  return (
    <Container fluid className="px-0 max-w-7xl mx-auto">
        <Card className="rounded-4 shadow-sm border-0 overflow-hidden">
          <div className="px-4 px-md-5 py-4 border-bottom bg-primary bg-gradient bg-opacity-10">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div>
                <h2 className="fw-bold text-dark mb-1">Course Management</h2>
                <p className="text-muted mb-0">Manage your courses and track student progress</p>
              </div>
              <Button
                variant="primary"
                onClick={openAddCourseModal}
                className="rounded-3 px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm transition hover-scale"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add New Course
              </Button>
            </div>
          </div>

          <Card.Body className="p-4 p-md-5">
            {loading ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5">
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <p className="mt-4 text-muted fw-medium">Loading your courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '100px', height: '100px' }}>
                  <FontAwesomeIcon icon={faBookOpen} className="fs-1 text-muted" />
                </div>
                <h4 className="fw-bold text-dark mb-2">No courses yet</h4>
                <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
                  Get started by creating your first course. You can add content, manage students, and track progress.
                </p>
                <Button
                  variant="primary"
                  onClick={openAddCourseModal}
                  className="rounded-3 px-5 py-3 fw-bold transition hover-scale shadow-sm"
                >
                  Create Your First Course
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {courses.map((course) => (
                  <Card key={course.course_id} className="border border-light rounded-3 shadow-sm hover-shadow transition">
                    <Card.Body className="p-4 d-flex flex-column flex-lg-row align-items-lg-start justify-content-between gap-4">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <h4 className="fw-bold text-dark mb-0 text-truncate"> {course.course_name} </h4>
                          <Badge 
                            bg={course.approved ? "success" : "warning"} 
                            text={course.approved ? "white" : "dark"}
                            className="px-3 py-2 rounded-pill fw-medium"
                          >
                            <FontAwesomeIcon icon={course.approved ? faCheckCircle : faClock} className="me-1" />
                            {course.approved ? 'Approved' : 'Pending Verification'}
                          </Badge>
                        </div>
                        <Row className="g-3 mb-2">
                          {course.instructor && (
                            <Col md="auto" className="d-flex align-items-center gap-2">
                              <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                              <span className="text-muted small">Instructor:</span>
                              <span className="fw-semibold text-dark small"> {course.instructor} </span>
                            </Col>
                          )}
                          {course.price && (
                            <Col md="auto" className="d-flex align-items-center gap-2">
                              <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                              <span className="text-muted small">Price:</span>
                              <span className="fw-bold text-success fs-5">₹{course.price}</span>
                            </Col>
                          )}
                        </Row>
                      </div>
                      
                      <div className="d-flex flex-wrap align-items-center gap-2 ms-lg-4">
                        <Button 
                          variant="primary" 
                          onClick={() => setPlaylistModal({ isOpen: true, courseId: course.course_id })} 
                          className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-2 fw-medium shadow-sm transition hover-scale"
                        >
                          <FontAwesomeIcon icon={faClipboardList} /> Manage Playlist
                        </Button>
                        {!course.approved && (
                          <Button 
                            variant="success" 
                            onClick={() => handleApproveCourse(course.course_id)} 
                            className="px-3 py-2 rounded-2 fw-medium shadow-sm transition hover-scale"
                          >
                            Approve
                          </Button>
                        )}
                        <Button 
                          variant="light" 
                          onClick={() => openEditCourseModal(course)} 
                          className="p-2 rounded-2 text-primary hover-bg-primary-light border-0 transition"
                          title="Edit Course"
                        >
                          <FontAwesomeIcon icon={faEdit} /> 
                        </Button>
                        <Button 
                          variant="light" 
                          onClick={() => openDeleteModal(course)} 
                          className="p-2 rounded-2 text-danger hover-bg-danger-light border-0 transition"
                          title="Delete Course"
                        >
                          <FontAwesomeIcon icon={faTrash} /> 
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>

      {/* Modals */}
      <CourseModal
        isOpen={courseModal.isOpen}
        onClose={closeCourseModal}
        onSuccess={handleCourseSuccess}
        courseId={courseModal.courseId}
        mode={courseModal.mode}
      />
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onSuccess={handleDeleteSuccess}
        onDelete={handleDeleteCourse}
        item={deleteModal.course}
        itemType="Course"
        title="Delete Course"
        description="Are you sure you want to delete this course?"
        itemDisplayName={deleteModal.course?.course_name}
      />
      <PlaylistModal
        isOpen={playlistModal.isOpen}
        onClose={() => setPlaylistModal({ isOpen: false, courseId: null })}
        courseId={playlistModal.courseId}
      />
      <style>{`
        .transition {
          transition: all 0.2s ease-in-out;
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          border-color: #0d6efd !important;
        }
        .hover-bg-primary-light:hover {
          background-color: #e7f1ff;
        }
        .hover-bg-danger-light:hover {
          background-color: #f8d7da;
        }
      `}</style>
    </Container>
  );
}

export default Courses;
