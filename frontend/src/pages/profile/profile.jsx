import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/common/Navbar";
import ImgUpload from "./ImgUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import {
  faUser,
  faEnvelope,
  faPhone,
  faVenus,
  faMars,
  faCalendar,
  faBriefcase,
  faMapMarkerAlt,
  faBookOpen,
  faEdit,
  faTrophy
} from "@fortawesome/free-solid-svg-icons";
import { profileService } from "../../api/profile.service";
import EditProfileModal from "./EditProfileModal";
import { Container, Row, Col, Card, Button, Spinner, Nav } from "react-bootstrap";

function Profile() {
  const id = localStorage.getItem("id");
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");
  const [loadingImage, setLoadingImage] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const userRes = await profileService.getUserDetails(id);
        if (userRes.success) {
          setUserDetails(userRes.data);
        }

        const imgRes = await profileService.getProfileImage(id);
        if (imgRes.success) {
          setProfileImage(imgRes.data);
        }
      } finally {
        setLoadingImage(false);
      }
    }
    fetchUserDetails();
  }, [id]);

  const updateUser = async (updatedData) => {
    try {
      const res = await profileService.updateUser(id, updatedData);

      setUserDetails(prevDetails => ({
        ...prevDetails,
        ...updatedData
      }));

      return true;
    } catch (err) {
      console.error("Error updating user:", err);
      return false;
    }
  };

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);
  };

  const handleProfileUpdate = async (updatedData) => {
    const success = await updateUser(updatedData);
    return success;
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const res = await profileService.uploadProfileImage(id, file);
    if (res.success) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === 'female') return faVenus;
    if (gender?.toLowerCase() === 'male') return faMars;
    return faUser;
  };

  if (!userDetails && !loadingImage) {
    return (
      <div className="min-vh-100 bg-light d-flex flex-column">
        <Navbar page="profile" />
        <Container className="flex-grow-1 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar page="profile" />

      <Container className="py-5">

        {/* Profile Header Card */}
        <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-4">
          <div className="bg-primary text-white p-5" style={{ height: '120px' }}></div>
          <Card.Body className="position-relative px-4 px-md-5 pb-4" style={{ marginTop: '-60px' }}>
            <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-end mb-4 gap-4">
              <div className="position-relative z-1">
                <ImgUpload
                  onChange={handleImageChange}
                  src={loadingImage ? null : profileImage}
                  isLoading={loadingImage}
                />
              </div>

              <div className="flex-grow-1 w-100 text-center text-sm-start mt-3 mt-sm-0">
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                  <div>
                    <h2 className="fw-bold text-dark mb-1">
                      {userDetails?.username || "User"}
                    </h2>
                    <p className="text-secondary fs-5 mb-1">{userDetails?.profession || "Learner"}</p>
                    {userDetails?.location && (
                      <div className="d-flex align-items-center justify-content-center justify-content-sm-start text-muted small">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                        {userDetails?.location}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    className="px-4 py-2 fw-semibold shadow-sm d-flex align-items-center gap-2"
                    onClick={handleEditProfile}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {(userDetails?.linkedin_url || userDetails?.github_url) && (
              <div className="d-flex justify-content-center justify-content-sm-start gap-3 mb-4">
                {userDetails?.linkedin_url && (
                  <Button
                    variant="outline-primary"
                    href={userDetails.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center gap-2 px-3 bg-opacity-10 border-0 fw-semibold"
                    style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                    LinkedIn
                  </Button>
                )}
                {userDetails?.github_url && (
                  <Button
                    variant="outline-secondary"
                    href={userDetails.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center gap-2 px-3 border-0 fw-semibold bg-light"
                  >
                    <FontAwesomeIcon icon={faGithub} />
                    GitHub
                  </Button>
                )}
              </div>
            )}

            {/* Removed Tab Navigation */}
          </Card.Body>
        </Card>

          <Row>
            <Col lg={8} className="mx-auto">
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4 p-md-5">
                  <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-primary" />
                    Personal Information
                  </h4>

                  <Row className="g-4">
                    <Col md={6}>
                      <InfoCard
                        icon={faEnvelope}
                        label="Email Address"
                        value={userDetails?.email}
                        iconColor="text-danger"
                      />
                    </Col>
                    <Col md={6}>
                      <InfoCard
                        icon={faPhone}
                        label="Phone Number"
                        value={userDetails?.mobileNumber}
                        iconColor="text-success"
                      />
                    </Col>
                    <Col md={6}>
                      <InfoCard
                        icon={getGenderIcon(userDetails?.gender)}
                        label="Gender"
                        value={userDetails?.gender}
                        iconColor="text-info"
                      />
                    </Col>
                    <Col md={6}>
                      <InfoCard
                        icon={faCalendar}
                        label="Date of Birth"
                        value={userDetails?.dob}
                        iconColor="text-primary"
                      />
                    </Col>
                    <Col md={6}>
                      <InfoCard
                        icon={faBriefcase}
                        label="Profession"
                        value={userDetails?.profession}
                        iconColor="text-warning"
                      />
                    </Col>
                    <Col md={6}>
                      <InfoCard
                        icon={faBookOpen}
                        label="Learning Courses"
                        value={userDetails?.learningCourses?.length || 0}
                        iconColor="text-primary"
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
      </Container>

      <EditProfileModal
        visible={isEditModalVisible}
        onCancel={handleModalClose}
        userDetails={userDetails}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
}

function InfoCard({ icon, label, value, iconColor = "text-secondary" }) {
  return (
    <div className="p-3 bg-light rounded-3 border h-100 hover-shadow transition">
      <div className="d-flex align-items-start gap-3">
        <div className={`mt-1 fs-5 ${iconColor}`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <h6 className="small fw-semibold text-muted mb-1">{label}</h6>
          <p className="text-dark fw-medium mb-0">
            {value || "Not specified"}
          </p>
        </div>
      </div>
      <style>{`
        .hover-shadow:hover {
          background-color: #f8f9fa;
          border-color: #dee2e6;
        }
        .transition {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Profile;