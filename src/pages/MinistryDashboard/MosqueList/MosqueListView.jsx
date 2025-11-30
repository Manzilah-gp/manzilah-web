// pages/MinistryDashboard/MosqueList/MosqueListView.jsx
import React, { useState, useEffect, useCallback } from 'react';
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
    Modal
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    SearchOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import {
    getAllMosques,
    deleteMosque,
    searchMosquesByName,
    getMosquesByGovernorate
} from '../../../api/mosque';
import useAuth from '../../../hooks/useAuth';
import { getGovernorates } from '../../../util/getGovernates';
import './MosqueListView.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const { Title, Text } = Typography;
const { Search } = Input;

/**
 * MosqueListView - Display and manage list of mosques
 * Features: Search, Filter, View, Edit, Delete
 */
const MosqueListView = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State management
    const [mosques, setMosques] = useState([]);
    const [loading, setLoading] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [selectedMosque, setSelectedMosque] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [governorateFilter, setGovernorateFilter] = useState('');

    const governorateOptions = getGovernorates();

    // Column definitions for AG Grid
    const [columnDefs] = useState([
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            filter: 'agNumberColumnFilter',
            sort: 'asc'
        },
        {
            field: 'name',
            headerName: 'Mosque Name',
            width: 200,
            filter: 'agTextColumnFilter',
            cellRenderer: (params) => (
                <div className="mosque-name-cell">
                    <div className="mosque-name">{params.value}</div>
                </div>
            )
        },
        {
            field: 'contact_number',
            headerName: 'Contact Number',
            width: 150,
            filter: 'agTextColumnFilter',
            cellRenderer: (params) => (
                <div>
                    {params.value ? (
                        <Text>{params.value}</Text>
                    ) : (
                        <Text type="secondary">No contact</Text>
                    )}
                </div>
            )
        },
        {
            field: 'governorate',
            headerName: 'Governorate',
            width: 150,
            filter: 'agTextColumnFilter',
            cellRenderer: (params) => {
                const governorateColors = {
                    gaza: 'red',
                    ramallah: 'blue',
                    hebron: 'green',
                    nablus: 'orange',
                    jerusalem: 'purple',
                    bethlehem: 'cyan',
                    jenin: 'geekblue',
                    tulkarm: 'magenta',
                    qalqilya: 'volcano',
                    salfit: 'gold',
                    jericho: 'lime',
                    tubas: 'processing'
                };
                return (
                    <Tag color={governorateColors[params.value] || 'default'}>
                        {params.value?.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            field: 'region',
            headerName: 'Region',
            width: 150,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 280,
            filter: 'agTextColumnFilter',
            cellRenderer: (params) => (
                <div className="address-cell">
                    {params.value ? (
                        <Text ellipsis={{ tooltip: params.value }}>
                            {params.value}
                        </Text>
                    ) : (
                        <Text type="secondary">No address</Text>
                    )}
                </div>
            )
        },
        {
            field: 'admin_name',
            headerName: 'Admin',
            width: 170,
            filter: 'agTextColumnFilter',
            cellRenderer: (params) => (
                <div>
                    {params.value ? (
                        <Text>{params.value}</Text>
                    ) : (
                        <Tag color="default">Not Assigned</Tag>
                    )}
                </div>
            )
        },
        {
            headerName: 'Actions',
            width: 150,
            cellRenderer: (params) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditMosque(params.data)}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteClick(params.data)}
                        size="small"
                    >
                        Delete
                    </Button>
                </Space>
            ),
            sortable: false,
            filter: false
        }
    ]);

    // Default column definitions
    const defaultColDef = {
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
        wrapText: true,
        autoHeight: true,
    };

    // Fetch mosques from backend
    const fetchMosques = useCallback(async () => {
        setLoading(true);
        try {

            const response = await getAllMosques();
            setMosques(response.data?.data || response.data || []);
            message.success(`Loaded ${response.data.data?.length || 0} mosques`);
            console.log('data', response.data.data);
        } catch (error) {
            console.error('Error fetching mosques:', error);
            message.error('Failed to load mosques');
        } finally {
            setLoading(false);
        }
    }, []);

    // Search mosques by name
    const handleSearch = async (value) => {
        setSearchText(value);
        if (!value.trim()) {
            fetchMosques();
            return;
        }

        setLoading(true);
        try {
            const response = await searchMosquesByName(value);
            setMosques(response.data.data || []);
        } catch (error) {
            console.error('Error searching mosques:', error);
            message.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    // Filter by governorate
    const handleGovernorateFilter = async (value) => {
        setGovernorateFilter(value);
        if (!value) {
            fetchMosques();
            return;
        }

        setLoading(true);
        try {
            const response = await getMosquesByGovernorate(value);
            setMosques(response.data.data || []);
        } catch (error) {
            console.error('Error filtering mosques:', error);
            message.error('Filter failed');
        } finally {
            setLoading(false);
        }
    };

    // Handle grid ready
    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    // Handle edit mosque - FIXED NAVIGATION
    const handleEditMosque = (mosque) => {
        console.log('Editing mosque:', mosque);

        // FIXED: Use the correct navigation path
        navigate(`/dashboard/edit-mosque/${mosque.id}`);

        message.info(`Opening edit form for: ${mosque.name}`);
    };



    // Helper function for governorate colors
    const getGovernorateColor = (governorate) => {
        const colors = {
            gaza: 'red',
            ramallah: 'blue',
            hebron: 'green',
            nablus: 'orange',
            jerusalem: 'purple',
            bethlehem: 'cyan',
            jenin: 'geekblue',
            tulkarm: 'magenta',
            qalqilya: 'volcano',
            salfit: 'gold',
            jericho: 'lime',
            tubas: 'processing'
        };
        return colors[governorate] || 'default';
    };

    // Handle delete confirmation
    const handleDeleteClick = (mosque) => {
        setSelectedMosque(mosque);
        setDeleteModalVisible(true);
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        if (!selectedMosque) return;

        try {
            await deleteMosque(selectedMosque.id);
            message.success(`Mosque "${selectedMosque.name}" deleted successfully`);
            setDeleteModalVisible(false);
            setSelectedMosque(null);
            fetchMosques(); // Refresh the list
        } catch (error) {
            console.error('Error deleting mosque:', error);
            message.error('Failed to delete mosque');
        }
    };

    // Calculate statistics
    const getStats = () => {
        const total = mosques.length;
        const withAdmin = mosques.filter(m => m.admin_name).length;
        const withoutAdmin = total - withAdmin;
        return { total, withAdmin, withoutAdmin };
    };

    const stats = getStats();

    // Load mosques on component mount
    useEffect(() => {
        fetchMosques();
    }, [fetchMosques]);

    return (
        <div className="mosque-list-view">
            {/* Header Section */}
            <Card className="mosque-list-header">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} className="page-title">
                            Mosque Management
                        </Title>
                        <Text type="secondary">
                            Manage all registered mosques in the system
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} className="stats-row">
                <Col xs={24} sm={8}>
                    <Card className="stat-card total">
                        <div className="stat-content">
                            <div className="stat-number">{stats.total}</div>
                            <div className="stat-label">Total Mosques</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="stat-card with-admin">
                        <div className="stat-content">
                            <div className="stat-number">{stats.withAdmin}</div>
                            <div className="stat-label">With Admin</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="stat-card without-admin">
                        <div className="stat-content">
                            <div className="stat-number">{stats.withoutAdmin}</div>
                            <div className="stat-label">Without Admin</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Filters and Actions */}
            <Card className="filters-card">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={8}>
                        <Search
                            placeholder="Search by mosque name..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <Select
                            placeholder="Filter by governorate"
                            allowClear
                            size="large"
                            style={{ width: '100%' }}
                            onChange={handleGovernorateFilter}
                            value={governorateFilter}
                            options={governorateOptions}
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={fetchMosques}
                                loading={loading}
                            >
                                Refresh
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* AG Grid */}
            <Card className="grid-card">
                <div
                    className="ag-theme-alpine"
                    style={{ height: '600px', width: '100%' }}
                >
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={mosques}
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={10}
                        enableClickSelection={true}
                        animateRows={true}
                        loading={loading}
                        enableCellTextSelection={true}
                        ensureDomOrder={true}
                    />
                </div>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Confirm Delete"
                open={deleteModalVisible}
                onOk={handleConfirmDelete}
                onCancel={() => setDeleteModalVisible(false)}
                okText="Delete"
                cancelText="Cancel"
                okType="danger"
            >
                <p>
                    Are you sure you want to delete the mosque <strong>"{selectedMosque?.name}"</strong>?
                </p>
                <p style={{ color: '#ff4d4f' }}>
                    This action cannot be undone and will permanently remove the mosque and its location data.
                </p>
            </Modal>
        </div>
    );
};

export default MosqueListView;