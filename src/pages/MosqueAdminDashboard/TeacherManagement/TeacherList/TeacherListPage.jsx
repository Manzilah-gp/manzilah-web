import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Button,
    Space,
    message,
    Typography,
    Tag,
    Row,
    Col,
    Input,
    Select,
    Modal,
    Switch
} from 'antd';
import {
    EyeOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import {
    getTeachers,
    updateTeacherStatus,
    deleteTeacher
} from '../../../../api/teacherManagement';
import './TeacherListPage.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const TeacherListPage = () => {
    const navigate = useNavigate();

    // State
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [genderFilter, setGenderFilter] = useState('all');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // Fetch Teachers
    const fetchTeachers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getTeachers();
            setTeachers(response.data || []);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            message.error('Failed to load teachers');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    // Handlers
    const handleStatusChange = async (checked, teacher) => {
        const newStatus = checked ? 1 : 0;
        try {
            await updateTeacherStatus(teacher.id, newStatus);
            message.success(`Teacher ${checked ? 'activated' : 'deactivated'} successfully`);

            // Optimistic update
            setTeachers(prev => prev.map(t =>
                t.id === teacher.id ? { ...t, is_active: newStatus } : t
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Failed to update status');
            fetchTeachers(); // Revert on failure
        }
    };

    const handleDeleteClick = (teacher) => {
        setSelectedTeacher(teacher);
        setDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedTeacher) return;

        try {
            await deleteTeacher(selectedTeacher.id);
            message.success('Teacher removed successfully');
            setDeleteModalVisible(false);
            setSelectedTeacher(null);
            fetchTeachers();
        } catch (error) {
            console.error('Error removing teacher:', error);
            message.error('Failed to remove teacher');
        }
    };

    const handleViewDetails = (teacherId) => {
        navigate(`/mosque-admin/teacher-info/${teacherId}`);
    };

    // Filtered Data
    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher => {
            const matchesSearch =
                teacher.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
                teacher.email?.toLowerCase().includes(searchText.toLowerCase()) ||
                teacher.phone?.includes(searchText);

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && teacher.is_active) ||
                (statusFilter === 'inactive' && !teacher.is_active);

            const matchesGender =
                genderFilter === 'all' ||
                teacher.gender === genderFilter;

            return matchesSearch && matchesStatus && matchesGender;
        });
    }, [teachers, searchText, statusFilter, genderFilter]);

    // Stats
    const stats = useMemo(() => {
        return {
            total: teachers.length,
            active: teachers.filter(t => t.is_active).length,
            inactive: teachers.filter(t => !t.is_active).length
        };
    }, [teachers]);

    // Column Definitions
    const columnDefs = [
        {
            field: 'full_name',
            headerName: 'Name',
            flex: 2,
            cellRenderer: (params) => (
                <Text strong style={{ color: '#1890ff' }}>{params.value}</Text>
            )
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 2,
        },
        {
            field: 'phone',
            headerName: 'Phone',
            flex: 1.5,
        },
        {
            field: 'gender',
            headerName: 'Gender',
            flex: 1,
            cellRenderer: (params) => (
                <Tag color={params.value === 'male' ? 'blue' : 'magenta'}>
                    {params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : '-'}
                </Tag>
            )
        },
        {
            field: 'is_active',
            headerName: 'Status',
            flex: 1,
            cellRenderer: (params) => (
                <Switch
                    checked={!!params.value}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    onChange={(checked) => handleStatusChange(checked, params.data)}
                />
            )
        },
        {
            headerName: 'Actions',
            flex: 2,
            cellRenderer: (params) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(params.data.id)}
                    >
                        View
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteClick(params.data)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    const defaultColDef = {
        sortable: true,
        filter: true,
        resizable: true,
    };

    return (
        <div className="teacher-list-page">
            <Card className="teacher-list-header">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} className="page-title">
                            Teacher Management
                        </Title>
                        <Text type="secondary">
                            Manage teachers detailed information and status
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* Statistics */}
            <Row gutter={[16, 16]} className="stats-row">
                <Col xs={24} sm={8}>
                    <Card className="stat-card total">
                        <div className="stat-content">
                            <div className="stat-number">{stats.total}</div>
                            <div className="stat-label">Total Teachers</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="stat-card active">
                        <div className="stat-content">
                            <div className="stat-number">{stats.active}</div>
                            <div className="stat-label">Active Teachers</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="stat-card inactive">
                        <div className="stat-content">
                            <div className="stat-number">{stats.inactive}</div>
                            <div className="stat-label">Inactive Teachers</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="filters-card">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={8}>
                        <Search
                            placeholder="Search by name, email or phone"
                            allowClear
                            onSearch={val => setSearchText(val)}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Select
                            placeholder="Filter by Status"
                            style={{ width: '100%' }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Col>
                    <Col xs={12} md={6}>
                        <Select
                            placeholder="Filter by Gender"
                            style={{ width: '100%' }}
                            value={genderFilter}
                            onChange={setGenderFilter}
                        >
                            <Option value="all">All Genders</Option>
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                        </Select>
                    </Col>
                    <Col xs={24} md={4}>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchTeachers}
                            loading={loading}
                            block
                        >
                            Refresh
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Grid */}
            <Card className="grid-card">
                <div className="ag-theme-alpine" style={{ width: '100%' }}>
                    <AgGridReact
                        rowData={filteredTeachers}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        domLayout='autoHeight'
                        autoSizeStrategy={{ type: 'fitGridWidth' }}
                    />
                </div>
            </Card>

            {/* Delete Modal */}
            <Modal
                title="Confirm Removal"
                open={deleteModalVisible}
                onOk={handleConfirmDelete}
                onCancel={() => setDeleteModalVisible(false)}
                okText="Remove"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to remove <strong>{selectedTeacher?.full_name}</strong> from this mosque?</p>
                <p>This action will remove their role assignment but not delete their user account.</p>
            </Modal>
        </div>
    );
};

export default TeacherListPage;
