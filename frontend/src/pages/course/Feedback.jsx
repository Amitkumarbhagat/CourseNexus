import React, { useEffect, useState } from "react";
import { message, Rate } from "antd";
import { courseService } from "../../api/course.service";
import { authService } from "../../api/auth.service";
import { Card, Button, Form, Spinner } from "react-bootstrap";

const Feedback = ({ courseid }) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userFeedbackId, setUserFeedbackId] = useState(null);

  const fetchFeedbacks = async () => {
    const res = await courseService.getFeedbacks(courseid);
    if (res.success) {
      const allFeedbacks = res.data;
      setFeedbacks(allFeedbacks);
      
      const user = authService.getCurrentUser();
      if (user) {
        const userFeedback = allFeedbacks.find(
          f => f.userId === user.id || (!f.userId && f.userName === user.name)
        );
        if (userFeedback) {
          setFeedback(userFeedback.comment);
          setRating(userFeedback.rating);
          setUserFeedbackId(userFeedback.id);
        } else {
          setUserFeedbackId(null);
          setFeedback("");
          setRating(0);
        }
      }
    } else {
      message.error(res.error || "Failed to load feedbacks");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [courseid]);

  const sendFeedback = async () => {
    if (!feedback.trim()) {
      message.warning("Please enter feedback before submitting");
      return;
    }
    if (rating === 0) {
      message.warning("Please provide a rating before submitting");
      return;
    }

    const user = authService.getCurrentUser();
    const res = await courseService.postFeedback(courseid, feedback, rating, user.name, user.id);
    if (res.success) {
      message.success(userFeedbackId ? "Feedback updated 🎉" : "Feedback submitted 🎉");
      setIsEditing(false);
      fetchFeedbacks();
    } else {
      message.error(res.error || "Failed to submit feedback");
    }
  };

  const user = authService.getCurrentUser();
  const hasUserFeedback = !!userFeedbackId;
  const showInputSection = !hasUserFeedback || isEditing;

  return (
    <Card className="border-0 shadow-sm mt-4">
      <Card.Body className="p-4">
        <h5 className="fw-bold mb-4">Feedback</h5>

        {/* Feedback List */}
        <div className="mb-4 pe-2" style={{ maxHeight: '240px', overflowY: 'auto' }}>
          {feedbacks.length > 0 ? (
            feedbacks.map((item, index) => {
              const isMyFeedback = user && (item.userId === user.id || (!item.userId && item.userName === user.name));
              return (
                <div
                  key={index}
                  className="d-flex flex-column gap-2 p-3 bg-light rounded-3 mb-3 border hover-shadow-sm transition"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold" style={{ width: '32px', height: '32px' }}>
                        {item.userName ? item.userName.charAt(0).toUpperCase() : "A"}
                      </div>
                      <div>
                        <p className="fw-bold text-dark mb-0">{item.userName || "Anonymous"}</p>
                        <Rate disabled defaultValue={item.rating || 5} className="small text-warning" />
                      </div>
                    </div>
                    {isMyFeedback && (
                      <div className="d-flex gap-2">
                        <Button 
                          variant="link"
                          onClick={() => setIsEditing(true)}
                          className="text-primary p-0 text-decoration-none small fw-bold"
                        >
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-muted mt-2 mb-0">{item.comment}</p>
                </div>
              );
            })
          ) : (
            <p className="text-muted fst-italic">No feedback yet. Be the first!</p>
          )}
        </div>

        {/* Input Section */}
        {showInputSection && (
          <div className="d-flex flex-column gap-3 border-top pt-4">
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary fw-medium">Rate this course:</span>
              <Rate value={rating} onChange={setRating} className="text-warning" />
            </div>
            <div className="d-flex gap-3">
              <Form.Control
                type="text"
                placeholder="Write your feedback..."
                className="flex-grow-1"
                onChange={(e) => setFeedback(e.target.value)}
                value={feedback}
              />
              <div className="d-flex gap-2">
                {isEditing && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset to existing feedback content
                      const myFb = feedbacks.find(f => f.userId === user.id);
                      if(myFb) {
                        setFeedback(myFb.comment);
                        setRating(myFb.rating);
                      }
                    }}
                    className="fw-semibold"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={sendFeedback}
                  className="fw-semibold"
                >
                  {hasUserFeedback ? "Update" : "Send"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
      <style>{`
        .hover-shadow-sm:hover {
          box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important;
        }
        .transition {
          transition: all .2s ease-in-out;
        }
      `}</style>
    </Card>
  );
};

export default Feedback;
