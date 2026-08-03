import React, { useState, useEffect } from "react";
import { adminService } from "../../api/admin.service";
import { authService } from "../../api/auth.service";
import { Row, Col, Card } from "react-bootstrap";

function Dashboard({isAuthenticated}) {
  const [userscount, setUserscount] = useState(0);
  const [coursescount, setCoursescount] = useState(0);
  const [enrolled, setEnrolled] = useState(0);

  useEffect(() => {

    if(!isAuthenticated){
      return;
    } 
    
    async function fetchData() {
      const usersRes = await adminService.getAllUsers();
      if (usersRes.success) setUserscount(usersRes.data.length);

      const coursesRes = await adminService.getAllCourses();
      if (coursesRes.success) setCoursescount(coursesRes.data.length);

      const learningRes = await adminService.getAllLearning();
      if (learningRes.success) setEnrolled(learningRes.data.length);
    }

    fetchData();
  }, [isAuthenticated]);

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-dark">
          Dashboard
        </h2>
      </div>

      {/* Info Cards */}
      <Row className="g-4">
        {/* Users */}
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm rounded-4 hover-shadow transition h-100">
            <Card.Body className="p-4 d-flex align-items-center gap-4">
              <div className="rounded-4 bg-primary bg-gradient d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                <i className="bx bxs-group fs-1" />
              </div>
              <div>
                <h3 className="fw-bold text-dark mb-1">{userscount}</h3>
                <p className="text-muted mb-0">Total Users</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Courses */}
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm rounded-4 hover-shadow transition h-100">
            <Card.Body className="p-4 d-flex align-items-center gap-4">
              <div className="rounded-4 bg-warning bg-gradient d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                <i className="bx bx-book fs-1" />
              </div>
              <div>
                <h3 className="fw-bold text-dark mb-1">{coursescount}</h3>
                <p className="text-muted mb-0">Total Courses</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Enrollments */}
        <Col md={6} lg={4}>
          <Card className="border-0 shadow-sm rounded-4 hover-shadow transition h-100">
            <Card.Body className="p-4 d-flex align-items-center gap-4">
              <div className="rounded-4 bg-success bg-gradient d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                <i className="bx bxs-calendar-check fs-1" />
              </div>
              <div>
                <h3 className="fw-bold text-dark mb-1">{enrolled}</h3>
                <p className="text-muted mb-0">Total Enrollment</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
          transform: translateY(-5px);
        }
        .transition {
          transition: all .3s ease;
        }
      `}</style>
    </>
  );
}

export default Dashboard;
