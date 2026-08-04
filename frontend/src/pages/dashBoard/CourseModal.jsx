import { Modal, Form, Input, InputNumber, message } from "antd";
import { useState, useEffect } from "react";
import { adminService } from "../../api/admin.service";
import { authService } from "../../api/auth.service";
import { aiService } from "../../api/ai.service";
import { Spinner, Button } from "react-bootstrap";

const { TextArea } = Input;

function CourseModal({ isOpen, onClose, onSuccess, courseId = null, mode = "add" }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);

  const isEditMode = mode === "edit" || courseId !== null;
  const modalTitle = isEditMode ? "Edit Course" : "Add New Course";
  const submitButtonText = isEditMode ? "Update Course" : "Add Course";
  const loadingText = isEditMode ? "Updating..." : "Adding...";

  useEffect(() => {
    if (isOpen && isEditMode && courseId) {
      fetchCourseData();
    } else if (isOpen && !isEditMode) {
      form.resetFields();
    }
  }, [isOpen, courseId, isEditMode]);

  const fetchCourseData = async () => {
    setFetchingData(true);
    try {
      const result = await adminService.getCourseById(courseId);
      if (result.success) {
        const formData = {
          course_name: result.data.course_name,
          instructor: result.data.instructor,
          price: result.data.price,
          description: result.data.description,
          y_link: result.data.y_link,
          p_link: result.data.p_link,
        };
        form.setFieldsValue(formData);
      } else {
        message.error(result.error);
        onClose();
      }
    } catch {
      message.error("Failed to fetch course data");
      onClose();
    } finally {
      setFetchingData(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let result;
      const user = authService.getCurrentUser();
      
      if (isEditMode) {
        const editData = {
          course_name: values.course_name,
          instructor: values.instructor,
          instructorId: user.id,
          price: values.price,
          description: values.description,
          y_link: values.y_link,
          p_link: values.p_link,
        };
        result = await adminService.updateCourse(courseId, editData);
      } else {
        const addData = {
          course_name: values.course_name,
          instructor: values.instructor,
          instructorId: user.id,
          price: values.price,
          description: values.description,
          y_link: values.y_link,
          p_link: values.p_link,
        };
        result = await adminService.createCourse(addData);
      }

      if (result.success) {
        message.success(isEditMode ? "Course updated successfully!" : "Course added successfully!");
        form.resetFields();
        onClose();
        onSuccess?.();
      } else {
        message.error(result.error);
      }
    } catch {
      message.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleGenerateAiDescription = async () => {
    const currentName = form.getFieldValue("course_name");
    if (!currentName || currentName.trim().length < 3) {
      message.warning("Please enter a valid Course Name first!");
      return;
    }

    setGeneratingAi(true);
    try {
      const res = await aiService.generateDescription(currentName);
      if (res.success && res.data && res.data.description) {
        form.setFieldsValue({ description: res.data.description });
        message.success("AI Description generated successfully! ✨");
      } else {
        message.error(res.message || "Failed to generate description");
      }
    } catch (err) {
      message.error("An error occurred while generating description");
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <Modal
      title={modalTitle}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className="custom-modal"
      destroyOnClose
    >
      {fetchingData ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '128px' }}>
          <Spinner animation="border" variant="primary" />
          <span className="ms-3 text-muted">Loading course data...</span>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-3"
          initialValues={{
            course_name: "",
            instructor: "",
            price: 0,
            description: "",
            y_link: "",
            p_link: "",
          }}
        >
          <div className="d-flex flex-column gap-3">
            <Form.Item
              label="Course Name"
              name="course_name"
              rules={[
                { required: true, message: "Course name is required" },
                { min: 3, message: "Course name must be at least 3 characters" },
                { max: 100, message: "Course name cannot exceed 100 characters" },
              ]}
              className="mb-0"
            >
              <Input placeholder="Enter course name" />
            </Form.Item>

            <Form.Item
              label="Instructor"
              name="instructor"
              rules={[
                { required: true, message: "Instructor is required" },
                { min: 2, message: "Instructor name must be at least 2 characters" },
              ]}
              className="mb-0"
            >
              <Input placeholder="Enter instructor name" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Price is required" },
                { type: "number", min: 0, message: "Price must be a positive number" },
              ]}
              className="mb-0"
            >
              <InputNumber
                placeholder="Enter price"
                className="w-100"
                min={0}
                step={0.01}
                formatter={(value) =>
                  `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              label={
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span>Description</span>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="py-0 px-2 ms-3 d-flex align-items-center"
                    onClick={handleGenerateAiDescription}
                    disabled={generatingAi}
                    style={{ fontSize: '12px', height: '24px' }}
                  >
                    {generatingAi ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                    ) : "✨ Generate AI"}
                  </Button>
                </div>
              }
              name="description"
              rules={[
                { required: true, message: "Description is required" },
                { min: 10, message: "Description must be at least 10 characters" },
                { max: 500, message: "Description cannot exceed 500 characters" },
              ]}
              className="mb-0"
              style={{ width: '100%' }}
            >
              <TextArea rows={4} placeholder="Enter course description or use AI to generate it!" showCount maxLength={500} />
            </Form.Item>

            <Form.Item
              label="Video Link"
              name="y_link"
              rules={[
                { required: true, message: "Video link is required" },
                { type: "url", message: "Please enter a valid URL" },
              ]}
              className="mb-0"
            >
              <Input placeholder="https://example.com/video" />
            </Form.Item>

            <Form.Item
              label="Image Link"
              name="p_link"
              rules={[
                { required: true, message: "Image link is required" },
                { type: "url", message: "Please enter a valid URL" },
              ]}
              className="mb-0"
            >
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>
          </div>

          <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
            <Button
              variant="light"
              onClick={handleCancel}
              disabled={loading}
              className="px-4 border"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="px-4 d-flex align-items-center"
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  {loadingText}
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
}

export default CourseModal;
