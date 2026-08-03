import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Send, MessageCircle, Users, Hash, Clock, ArrowLeft } from 'lucide-react'
import { courseService } from '../../api/course.service'
import { authService } from '../../api/auth.service'
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap'

function Forum({ courseId: propCourseId }) {
  const { id: paramCourseId } = useParams()
  const courseId = propCourseId || paramCourseId
  const taskRef = useRef("")
  const messagesEndRef = useRef(null)
  const [message, setMessage] = useState([])
  const [name] = useState(localStorage.getItem("name"))
  const [course, setCourse] = useState()
  const [sending, setSending] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const isInstructor = authService.isInstructorAuthenticated()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: name,
    course_id: courseId,
    content: ''
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [message])

  useEffect(() => {
    const fetchData = async () => {
      const msgRes = await courseService.getMessages(courseId);
      if (msgRes.success) setMessage(msgRes.data);

      const courseRes = await courseService.getCourseById(courseId);
      if (courseRes.success) setCourse(courseRes.data);
    };

    if (courseId) fetchData();
  }, [courseId]);

  const addTask = async () => {
    if (!formData.content.trim()) {
      alert("Enter a Message")
      return
    }

    setSending(true)
    const payload = {
      ...formData,
      content: formData.content.trim(),
    }
    if (replyingTo) {
      payload.parentId = replyingTo.id
    }

    const res = await courseService.addMessage(payload)
    if (res.success) {
      // Refresh messages completely to show threaded replies
      const msgRes = await courseService.getMessages(courseId);
      if (msgRes.success) setMessage(msgRes.data);
      
      setFormData({ ...formData, content: "" })
      setReplyingTo(null)
      taskRef.current.value = ""
    } else {
      alert("Failed to send message")
    }
    setSending(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      addTask()
    }
  }

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  }

  const getRandomColor = (name) => {
    const colors = [
      'bg-primary', 'bg-success', 'bg-info', 'bg-warning text-dark', 
      'bg-danger', 'bg-secondary', 'bg-dark'
    ]
    const index = name?.length ? name.length % colors.length : 0
    return colors[index]
  }

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;

    return time.toLocaleString();
  };

  return (
    <div className="d-flex flex-column h-100">
      <Card className="mb-3 bg-light border-0 shadow-sm">
        <Card.Body className="p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <Hash size={16} className="text-primary" />
              <h6 className="mb-0 fw-bold">{course?.course_name} Discussion</h6>
            </div>
            <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)} className="d-flex align-items-center gap-1">
              <ArrowLeft size={14} />
              Back
            </Button>
          </div>
          <div className="d-flex align-items-center gap-4 text-muted small">
            <div className="d-flex align-items-center gap-1">
              <Users size={14} />
              <span>{message.filter(m => m.content.trim() !== "").length} messages</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <MessageCircle size={14} />
              <span>Active discussion</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="flex-grow-1 overflow-auto mb-3 p-3 bg-light rounded shadow-sm border" style={{ maxHeight: '400px' }}>
        {message.length > 0 ? (
          message.map((value, key) => (
            value.content.trim() !== "" && (
              <Card key={key} className="mb-3 border-0 shadow-sm">
                <Card.Body className="p-3">
                  <div className="d-flex gap-3">
                    <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0 ${getRandomColor(value.userName)}`} style={{ width: '36px', height: '36px' }}>
                      {getInitials(value.userName)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-bold small">{value.userName}</span>
                        <span className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                          <Clock size={12} />
                          {formatRelativeTime(value.time)}
                        </span>
                      </div>
                      <p className="mb-1 text-dark small">{value.content}</p>
                      {isInstructor && (
                        <Button variant="link" size="sm" className="p-0 text-decoration-none fw-semibold" style={{ fontSize: '0.8rem' }} onClick={() => setReplyingTo(value)}>
                          Reply
                        </Button>
                      )}
                      
                      {/* Replies */}
                      {value.replies && value.replies.length > 0 && (
                        <div className="mt-3 ps-3 border-start border-2 border-primary border-opacity-25">
                          {value.replies.map((reply, rKey) => (
                            <div key={rKey} className="d-flex gap-2 mt-2 bg-light p-2 rounded">
                              <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0 ${getRandomColor(reply.userName)}`} style={{ width: '24px', height: '24px', fontSize: '0.65rem' }}>
                                {getInitials(reply.userName)}
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                  <span className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>
                                    {reply.userName} 
                                    {reply.userName === course?.instructor ? <span className="ms-2 badge bg-primary bg-opacity-25 text-primary">Instructor</span> : null}
                                  </span>
                                  <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                    <Clock size={10} />
                                    {formatRelativeTime(reply.time)}
                                  </span>
                                </div>
                                <p className="mb-0 text-dark" style={{ fontSize: '0.8rem' }}>{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )
          ))
        ) : (
          <div className="text-center py-5">
            <MessageCircle size={48} className="text-muted mb-3 opacity-50" />
            <p className="text-muted">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div>
        {replyingTo && (
          <div className="d-flex align-items-center justify-content-between bg-primary bg-opacity-10 p-2 rounded-top border border-primary border-opacity-25 border-bottom-0">
            <span className="small text-primary">
              Replying to <span className="fw-bold">{replyingTo.userName}</span>: "{replyingTo.content.substring(0, 50)}{replyingTo.content.length > 50 ? '...' : ''}"
            </span>
            <Button variant="link" size="sm" className="text-muted p-0 text-decoration-none" onClick={() => setReplyingTo(null)}>Cancel</Button>
          </div>
        )}
        <div className={`d-flex gap-3 p-3 bg-white rounded-bottom shadow-sm border ${replyingTo ? 'border-top-0 border-primary border-opacity-25' : ''}`}>
          <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0 ${getRandomColor(name)}`} style={{ width: '40px', height: '40px' }}>
            {getInitials(name)}
          </div>
          <div className="flex-grow-1 position-relative">
            <Form.Control
              as="textarea"
              ref={taskRef}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              onKeyPress={handleKeyPress}
              rows={2}
              className="pe-5 shadow-sm rounded-3"
              placeholder="Share your thoughts, ask questions, or help others..."
              disabled={sending}
              style={{ resize: 'none' }}
            />
            <Button
              variant="primary"
              className="position-absolute rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
              style={{ bottom: '10px', right: '10px', width: '36px', height: '36px' }}
              onClick={addTask}
              disabled={sending || !formData.content.trim()}
            >
              {sending ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between mt-2 px-1">
          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
            Press <kbd className="bg-light text-dark border">Enter</kbd> to send, <kbd className="bg-light text-dark border">Shift + Enter</kbd> for new line
          </p>
          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
            {formData.content.length}/500
          </p>
        </div>
      </div>
    </div>
  )
}

export default Forum
