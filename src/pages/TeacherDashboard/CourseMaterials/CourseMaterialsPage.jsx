// src/pages/CourseMaterials/CourseMaterialsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button, Upload, Modal, Input, Select, message,
    Card, Spin, Popconfirm, Tag, Empty, Divider
} from 'antd';
import {
    UploadOutlined, DeleteOutlined, DownloadOutlined,
    FileTextOutlined, FilePdfOutlined, FileImageOutlined,
    FolderOutlined, PlusOutlined, ArrowLeftOutlined,
    EyeOutlined, EditOutlined
} from '@ant-design/icons';
import useAuth from '../../../hooks/useAuth';
import {
    getCourseMaterials, uploadMaterial, deleteMaterial,
    trackDownload, createSection, getSections, deleteSection,
    downloadMaterial
} from '../../../api/materials';
import './CourseMaterialsPage.css';

const { TextArea } = Input;

const CourseMaterialsPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [materials, setMaterials] = useState({
        sections: [],
        ungroupedMaterials: []
    });
    const [sections, setSections] = useState([]);

    // Upload Modal State
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        file: null,
        title: '',
        description: '',
        materialLabel: 'General',
        sectionId: null
    });

    // Section Modal State
    const [sectionModalVisible, setSectionModalVisible] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');

    // Check if user is teacher
    const isTeacher = user?.roles?.includes('teacher');

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [materialsRes, sectionsRes] = await Promise.all([
                getCourseMaterials(courseId),
                getSections(courseId)
            ]);

            if (materialsRes.data.success) {
                setMaterials(materialsRes.data.data);
            }

            if (sectionsRes.data.success) {
                setSections(sectionsRes.data.data);
            }
        } catch (error) {
            console.error('Error fetching materials:', error);
            message.error('Failed to load materials');
        } finally {
            setLoading(false);
        }
    };

    // Handle file selection
    const handleFileChange = (info) => {
        const file = info.file.originFileObj || info.file;

        // Validate file size (50MB)
        if (file.size > 50 * 1024 * 1024) {
            message.error('File size must be less than 50MB');
            return;
        }

        setUploadForm(prev => ({
            ...prev,
            file,
            title: prev.title || file.name.split('.')[0] // Auto-fill title if empty
        }));
    };

    // Handle upload submission
    const handleUpload = async () => {
        if (!uploadForm.file) {
            message.error('Please select a file');
            return;
        }

        if (!uploadForm.title.trim()) {
            message.error('Please enter a title');
            return;
        }

        setUploading(true);

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('file', uploadForm.file);
            formData.append('courseId', courseId);
            formData.append('title', uploadForm.title);
            formData.append('description', uploadForm.description);
            formData.append('materialLabel', uploadForm.materialLabel);

            if (uploadForm.sectionId) {
                formData.append('sectionId', uploadForm.sectionId);
            }

            const response = await uploadMaterial(formData);

            if (response.data.success) {
                message.success('Material uploaded successfully!');
                setUploadModalVisible(false);
                resetUploadForm();
                fetchData(); // Refresh materials
            }
        } catch (error) {
            console.error('Upload error:', error);
            message.error(error.response?.data?.message || 'Failed to upload material');
        } finally {
            setUploading(false);
        }
    };

    // Handle delete
    const handleDelete = async (materialId) => {
        try {
            const response = await deleteMaterial(materialId);

            if (response.data.success) {
                message.success('Material deleted successfully');
                fetchData();
            }
        } catch (error) {
            message.error('Failed to delete material');
        }
    };

    // Handle download
    // Find this function and replace it:
    const handleDownload = async (material) => {
        try {
            // Track download
            await trackDownload(material.id);

            // Download file using API (authenticated)
            const response = await downloadMaterial(material.id);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', material.file_name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            message.success('Download started');
        } catch (error) {
            console.error('Download error:', error);
            message.error('Failed to download material');
        }
    };

    // Create section
    const handleCreateSection = async () => {
        if (!newSectionName.trim()) {
            message.error('Please enter a section name');
            return;
        }

        try {
            const response = await createSection({
                courseId,
                sectionName: newSectionName,
                sectionOrder: sections.length
            });

            if (response.data.success) {
                message.success('Section created successfully!');
                setSectionModalVisible(false);
                setNewSectionName('');
                fetchData();
            }
        } catch (error) {
            message.error('Failed to create section');
        }
    };

    // Delete section
    const handleDeleteSection = async (sectionId) => {
        try {
            const response = await deleteSection(sectionId);

            if (response.data.success) {
                message.success('Section deleted successfully');
                fetchData();
            }
        } catch (error) {
            message.error('Failed to delete section');
        }
    };

    const resetUploadForm = () => {
        setUploadForm({
            file: null,
            title: '',
            description: '',
            materialLabel: 'General',
            sectionId: null
        });
    };

    // Get file icon
    const getFileIcon = (fileType) => {
        const icons = {
            pdf: <FilePdfOutlined style={{ color: '#e74c3c', fontSize: '24px' }} />,
            image: <FileImageOutlined style={{ color: '#3498db', fontSize: '24px' }} />,
            document: <FileTextOutlined style={{ color: '#2ecc71', fontSize: '24px' }} />
        };
        return icons[fileType] || <FileTextOutlined style={{ fontSize: '24px' }} />;
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading materials..." />
            </div>
        );
    }

    return (
        <div className="course-materials-page">
            {/* Header */}
            <div className="page-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
                <div>
                    <h1>📚 Course Materials</h1>
                    <p>Download and manage course resources</p>
                </div>

                {/* Teacher Actions */}
                {isTeacher && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            type="default"
                            icon={<FolderOutlined />}
                            onClick={() => setSectionModalVisible(true)}
                        >
                            New Section
                        </Button>
                        <Button
                            type="primary"
                            icon={<UploadOutlined />}
                            onClick={() => setUploadModalVisible(true)}
                        >
                            Upload Material
                        </Button>
                    </div>
                )}
            </div>

            {/* Materials Display */}
            <div className="materials-content">
                {/* Sections with Materials */}
                {materials.sections.map(section => (
                    <Card
                        key={section.id}
                        className="section-card"
                        title={
                            <div className="section-header">
                                <div>
                                    <FolderOutlined style={{ marginRight: '8px' }} />
                                    {section.section_name}
                                </div>
                                {isTeacher && (
                                    <Popconfirm
                                        title="Delete this section?"
                                        description="All materials in this section will be moved to 'General'"
                                        onConfirm={() => handleDeleteSection(section.id)}
                                        okText="Delete"
                                        cancelText="Cancel"
                                    >
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            size="small"
                                        />
                                    </Popconfirm>
                                )}
                            </div>
                        }
                    >
                        {section.materials.length === 0 ? (
                            <Empty
                                description="No materials in this section"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ) : (
                            <div className="materials-grid">
                                {section.materials.map(material => (
                                    <MaterialCard
                                        key={material.id}
                                        material={material}
                                        isTeacher={isTeacher}
                                        onDownload={handleDownload}
                                        onDelete={handleDelete}
                                        formatFileSize={formatFileSize}
                                        getFileIcon={getFileIcon}
                                    />
                                ))}
                            </div>
                        )}
                    </Card>
                ))}

                {/* Ungrouped Materials */}
                {materials.ungroupedMaterials.length > 0 && (
                    <Card
                        className="section-card"
                        title={
                            <div className="section-header">
                                <div>
                                    <FileTextOutlined style={{ marginRight: '8px' }} />
                                    General Materials
                                </div>
                            </div>
                        }
                    >
                        <div className="materials-grid">
                            {materials.ungroupedMaterials.map(material => (
                                <MaterialCard
                                    key={material.id}
                                    material={material}
                                    isTeacher={isTeacher}
                                    onDownload={handleDownload}
                                    onDelete={handleDelete}
                                    formatFileSize={formatFileSize}
                                    getFileIcon={getFileIcon}
                                />
                            ))}
                        </div>
                    </Card>
                )}

                {/* Empty State */}
                {materials.sections.length === 0 &&
                    materials.ungroupedMaterials.length === 0 && (
                        <Card>
                            <Empty
                                description={
                                    isTeacher
                                        ? "No materials yet. Click 'Upload Material' to add resources"
                                        : "No materials available for this course yet"
                                }
                            />
                        </Card>
                    )}
            </div>

            {/* Upload Modal */}
            <Modal
                title="Upload Course Material"
                open={uploadModalVisible}
                onCancel={() => {
                    setUploadModalVisible(false);
                    resetUploadForm();
                }}
                footer={null}
                width={600}
            >
                <div className="upload-modal-content">
                    {/* File Upload */}
                    <div className="form-group">
                        <label>Select File *</label>
                        <Upload
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            maxCount={1}
                            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        >
                            <Button icon={<UploadOutlined />}>
                                Choose File
                            </Button>
                        </Upload>
                        {uploadForm.file && (
                            <div className="file-info">
                                Selected: {uploadForm.file.name} ({formatFileSize(uploadForm.file.size)})
                            </div>
                        )}
                        <div className="file-hint">
                            Allowed: PDF, Images, Documents (Max 50MB)
                        </div>
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label>Title *</label>
                        <Input
                            placeholder="e.g., Week 1 Notes"
                            value={uploadForm.title}
                            onChange={(e) => setUploadForm(prev => ({
                                ...prev,
                                title: e.target.value
                            }))}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <TextArea
                            rows={3}
                            placeholder="Add a description..."
                            value={uploadForm.description}
                            onChange={(e) => setUploadForm(prev => ({
                                ...prev,
                                description: e.target.value
                            }))}
                        />
                    </div>

                    {/* Label */}
                    <div className="form-group">
                        <label>Material Label</label>
                        <Input
                            placeholder="e.g., Notes, Assignment, Resource"
                            value={uploadForm.materialLabel}
                            onChange={(e) => setUploadForm(prev => ({
                                ...prev,
                                materialLabel: e.target.value
                            }))}
                        />
                    </div>

                    {/* Section */}
                    <div className="form-group">
                        <label>Section (Optional)</label>
                        <Select
                            placeholder="Select section"
                            style={{ width: '100%' }}
                            allowClear
                            value={uploadForm.sectionId}
                            onChange={(value) => setUploadForm(prev => ({
                                ...prev,
                                sectionId: value
                            }))}
                        >
                            {sections.map(section => (
                                <Select.Option key={section.id} value={section.id}>
                                    {section.section_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <Button onClick={() => {
                            setUploadModalVisible(false);
                            resetUploadForm();
                        }}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            loading={uploading}
                            onClick={handleUpload}
                        >
                            Upload
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Section Creation Modal */}
            <Modal
                title="Create New Section"
                open={sectionModalVisible}
                onCancel={() => {
                    setSectionModalVisible(false);
                    setNewSectionName('');
                }}
                onOk={handleCreateSection}
                okText="Create"
            >
                <Input
                    placeholder="Section name (e.g., Week 1, Unit 2)"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    onPressEnter={handleCreateSection}
                />
            </Modal>
        </div>
    );
};

// Material Card Component
const MaterialCard = ({
    material,
    isTeacher,
    onDownload,
    onDelete,
    formatFileSize,
    getFileIcon
}) => {
    return (
        <div className="material-card">
            <div className="material-icon">
                {getFileIcon(material.file_type)}
            </div>

            <div className="material-content">
                <h4 className="material-title">{material.title}</h4>

                {material.description && (
                    <p className="material-description">
                        {material.description}
                    </p>
                )}

                <div className="material-meta">
                    <Tag color="blue">{material.material_label}</Tag>
                    <span className="file-size">
                        {formatFileSize(material.file_size)}
                    </span>
                </div>

                <div className="material-footer">
                    <span className="upload-info">
                        By {material.uploaded_by_name} • {material.download_count} downloads
                    </span>
                </div>
            </div>

            <div className="material-actions">
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => onDownload(material)}
                    size="small"
                >
                    Download
                </Button>

                {isTeacher && (
                    <Popconfirm
                        title="Delete this material?"
                        onConfirm={() => onDelete(material.id)}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                )}
            </div>
        </div>
    );
};

export default CourseMaterialsPage;