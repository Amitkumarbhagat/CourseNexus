import React, { useState, useEffect } from "react";
import { Modal, Input, List, message, Select, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { Button } from "react-bootstrap";
import { videoService } from "../../api/video.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

const PlaylistModal = ({ isOpen, onClose, courseId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [videoSource, setVideoSource] = useState("link");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (isOpen && courseId) {
      fetchVideos();
    }
  }, [isOpen, courseId]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await videoService.getVideosByCourse(courseId);
      if (res.success) {
        setVideos(res.data);
      }
    } catch {
      message.error("Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async () => {
    if (!newTitle) {
      message.warning("Please provide a video title");
      return;
    }

    let finalUrl = newUrl;

    if (videoSource === "upload") {
      if (!selectedFile) {
        message.warning("Please select a file to upload");
        return;
      }
      setUploading(true);
      const uploadRes = await videoService.uploadVideoFile(selectedFile);
      if (!uploadRes.success) {
        message.error("Failed to upload video to cloud");
        setUploading(false);
        return;
      }
      finalUrl = uploadRes.url;
    } else {
      if (!newUrl) {
        message.warning("Please provide a video URL");
        return;
      }
    }

    try {
      const res = await videoService.addVideo(courseId, { title: newTitle, url: finalUrl });
      if (res.success) {
        message.success("Video added to playlist");
        setNewTitle("");
        setNewUrl("");
        setSelectedFile(null);
        setUploading(false);
        fetchVideos();
      }
    } catch {
      message.error("Failed to add video");
      setUploading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      const res = await videoService.deleteVideo(videoId);
      if (res.success) {
        message.success("Video removed");
        fetchVideos();
      }
    } catch {
      message.error("Failed to remove video");
    }
  };

  return (
    <Modal
      title="Manage Course Playlist"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div className="mb-4">
        <div className="d-flex gap-2 mb-2">
          <Input 
            placeholder="Video Title" 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            className="flex-grow-1"
          />
          <Select 
            value={videoSource} 
            onChange={setVideoSource} 
            style={{ width: 140 }}
          >
            <Option value="link">YouTube Link</Option>
            <Option value="upload">Upload File</Option>
          </Select>
        </div>
        
        <div className="d-flex gap-2">
          {videoSource === "link" ? (
            <Input 
              placeholder="Video URL (e.g. YouTube link)" 
              value={newUrl} 
              onChange={(e) => setNewUrl(e.target.value)} 
              className="flex-grow-1"
            />
          ) : (
            <div className="flex-grow-1 border rounded p-1 d-flex align-items-center bg-light">
              <input 
                type="file" 
                accept="video/mp4,video/x-m4v,video/*" 
                onChange={(e) => setSelectedFile(e.target.files[0])} 
                className="form-control form-control-sm border-0 bg-transparent"
              />
            </div>
          )}
          <Button 
            variant="primary"
            onClick={handleAddVideo}
            disabled={uploading}
            className="d-flex align-items-center gap-2"
          >
            {uploading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <FontAwesomeIcon icon={faPlus} />
            )}
            {uploading ? 'Uploading...' : 'Add'}
          </Button>
        </div>
      </div>

      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={videos}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button 
                variant="link"
                className="text-danger p-0"
                onClick={() => handleDeleteVideo(item.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<div className="rounded bg-light d-flex align-items-center justify-content-center fw-bold text-muted" style={{ width: '32px', height: '32px' }}>{index + 1}</div>}
              title={<span className="fw-semibold">{item.title}</span>}
              description={<span className="small text-muted text-truncate d-inline-block" style={{ maxWidth: '400px' }}>{item.url}</span>}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default PlaylistModal;
