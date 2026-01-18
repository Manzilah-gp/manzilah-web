// src/pages/TeacherDashboard/Students/AllStudentsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select, Input, message, Checkbox, Popover } from 'antd';
import { SearchOutlined, DownloadOutlined, FilterOutlined, SettingOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { getAllMyStudents, getMyCourses } from '../../../api/teacherCourses';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import './AllStudentsPage.css';

const AllStudentsPage = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState({});
    const [filters, setFilters] = useState({
        courseId: '',
        search: ''
    });

    // Column Visibility State
    const [columnVisibility, setColumnVisibility] = useState({
        student_id: true,
        full_name: true,
        email: true,
        phone: true,
        course_name: true,
        course_type: true,
        completion_percentage: true,
        current_page: false, // Hidden by default
        exams_passed: true,
        exam_1_score: false, // Hidden by default
        exam_2_score: false,
        exam_3_score: false,
        exam_4_score: false,
        exam_5_score: false,
        final_exam_score: false,
        attendance_rate: false,
        is_graduated: true,
        enrollment_date: true,
    });

    useEffect(() => {
        fetchCourses();
        fetchStudents();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [filters]);

    const fetchCourses = async () => {
        try {
            const response = await getMyCourses();
            if (response.data.success) {
                setCourses(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await getAllMyStudents(filters);
            if (response.data.success) {
                // Add computed fields
                const studentsData = response.data.data.map(s => ({
                    ...s,
                    attendance_rate: s.total_attendance_records > 0
                        ? `${Math.round((s.present_count / s.total_attendance_records) * 100) || 0}%`
                        : 'N/A',
                    exams_passed_display: `${s.exams_passed || 0}/5`,
                }));
                setStudents(studentsData);
            }
        } catch (error) {
            message.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    // Column Definitions
    const columns = useMemo(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            size: 50,
        },
        {
            accessorKey: 'student_id',
            header: 'ID',
            size: 80,
        },
        {
            accessorKey: 'full_name',
            header: 'Full Name',
            size: 200,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            size: 220,
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            size: 150,
        },
        {
            accessorKey: 'course_name',
            header: 'Course',
            size: 180,
        },
        {
            accessorKey: 'course_type',
            header: 'Type',
            size: 120,
        },
        {
            accessorKey: 'completion_percentage',
            header: 'Progress %',
            size: 120,
            cell: ({ getValue }) => {
                const value = getValue() || 0;
                const color = value >= 80 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';
                return (
                    <span style={{
                        color,
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: `${color}20`
                    }}>
                        {value}%
                    </span>
                );
            },
        },
        {
            accessorKey: 'current_page',
            header: 'Current Page',
            size: 120,
        },
        {
            accessorKey: 'exams_passed_display',
            header: 'Exams Passed',
            size: 130,
        },
        {
            accessorKey: 'exam_1_score',
            header: 'Exam 1',
            size: 100,
            cell: ({ getValue }) => {
                const value = getValue();
                if (!value) return '-';
                const passed = value >= 90;
                return (
                    <span style={{
                        color: passed ? '#10b981' : '#ef4444',
                        fontWeight: 600
                    }}>
                        {value}
                    </span>
                );
            },
        },
        {
            accessorKey: 'exam_2_score',
            header: 'Exam 2',
            size: 100,
            cell: ({ getValue }) => {
                const value = getValue();
                if (!value) return '-';
                const passed = value >= 90;
                return (
                    <span style={{
                        color: passed ? '#10b981' : '#ef4444',
                        fontWeight: 600
                    }}>
                        {value}
                    </span>
                );
            },
        },
        {
            accessorKey: 'exam_3_score',
            header: 'Exam 3',
            size: 100,
            cell: ({ getValue }) => {
                const value = getValue();
                if (!value) return '-';
                const passed = value >= 90;
                return (
                    <span style={{
                        color: passed ? '#10b981' : '#ef4444',
                        fontWeight: 600
                    }}>
                        {value}
                    </span>
                );
            },
        },
        {
            accessorKey: 'exam_4_score',
            header: 'Exam 4',
            size: 100,
            cell: ({ getValue }) => {
                const value = getValue();
                if (!value) return '-';
                const passed = value >= 90;
                return (
                    <span style={{
                        color: passed ? '#10b981' : '#ef4444',
                        fontWeight: 600
                    }}>
                        {value}
                    </span>
                );
            },
        },
        {
            accessorKey: 'exam_5_score',
            header: 'Exam 5',
            size: 100,
            cell: ({ getValue }) => {
                const value = getValue();
                if (!value) return '-';
                const passed = value >= 90;
                return (
                    <span style={{
                        color: passed ? '#10b981' : '#ef4444',
                        fontWeight: 600
                    }}>
                        {value}
                    </span>
                );
            },
        },
        {
            accessorKey: 'final_exam_score',
            header: 'Final Exam',
            size: 110,
            cell: ({ getValue }) => {
                const value = getValue();
                if (!value) return '-';
                const passed = value >= 90;
                return (
                    <span style={{
                        color: passed ? '#10b981' : '#ef4444',
                        fontWeight: 600
                    }}>
                        {value}
                    </span>
                );
            },
        },
        {
            accessorKey: 'attendance_rate',
            header: 'Attendance',
            size: 120,
        },
        {
            accessorKey: 'is_graduated',
            header: 'Graduated',
            size: 110,
            cell: ({ getValue }) => (
                <span style={{
                    color: getValue() ? '#10b981' : '#6b7280',
                    fontWeight: getValue() ? 600 : 400
                }}>
                    {getValue() ? '✓ Yes' : 'No'}
                </span>
            ),
        },
        {
            accessorKey: 'enrollment_date',
            header: 'Enrolled',
            size: 130,
            cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
        },
        {
            id: 'actions',
            header: 'Actions',
            size: 150,
            cell: ({ row }) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() => navigate(`/teacher/student-progress/${row.original.enrollment_id}`)}
                >
                    View Progress
                </Button>
            ),
        },
    ], [navigate]);

    const table = useReactTable({
        data: students,
        columns,
        state: {
            globalFilter,
            rowSelection,
            columnVisibility,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 25,
            },
        },
    });

    const handleExportPDF = () => {
        const selectedRows = table.getSelectedRowModel().rows;

        if (selectedRows.length === 0) {
            message.warning('Please select rows to export');
            return;
        }

        try {
            // Get visible columns (excluding select & actions)
            const visibleColumns = table.getAllColumns()
                .filter(col => col.getIsVisible() && col.id !== 'select' && col.id !== 'actions')
                .map(col => ({
                    id: col.id,
                    header: col.columnDef.header
                }));

            // Get selected course name for title
            const courseName = filters.courseId
                ? courses.find(c => c.course_id === parseInt(filters.courseId))?.course_name || 'All Courses'
                : 'All Courses';

            // Extract data
            const tableData = selectedRows.map(row => {
                return visibleColumns.map(col => {
                    const cellValue = row.original[col.id];

                    // Handle special formatting
                    if (col.id === 'enrollment_date' && cellValue) {
                        return new Date(cellValue).toLocaleDateString();
                    }
                    if (col.id === 'is_graduated') {
                        return cellValue ? 'Yes' : 'No';
                    }
                    if (col.id === 'completion_percentage') {
                        return `${cellValue || 0}%`;
                    }
                    if (col.id === 'exams_passed_display') {
                        return `${row.original.exams_passed || 0}/5`;
                    }

                    return cellValue || '-';
                });
            });

            // Generate PDF
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // Add gradient-inspired header
            doc.setFillColor(30, 60, 114); // #1e3c72
            doc.rect(0, 0, 297, 40, 'F');

            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Student Progress Report', 148.5, 15, { align: 'center' });

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Course: ${courseName}`, 148.5, 25, { align: 'center' });
            doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}`, 148.5, 32, { align: 'center' });

            // Add table
            autoTable(doc, {
                head: [visibleColumns.map(col => col.header)],
                body: tableData,
                startY: 45,
                theme: 'striped',
                headStyles: {
                    fillColor: [44, 62, 80], // #2c3e50
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 10
                },
                bodyStyles: {
                    fontSize: 9,
                    textColor: [50, 50, 50]
                },
                alternateRowStyles: {
                    fillColor: [245, 247, 250]
                },
                margin: { left: 10, right: 10 },
                columnStyles: {
                    0: { cellWidth: 'auto' }
                }
            });

            // Footer with page numbers
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    148.5,
                    205,
                    { align: 'center' }
                );
            }

            // Generate filename
            const filename = `Students_${courseName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]
                }.pdf`;

            // Save PDF
            doc.save(filename);

            message.success(`PDF exported: ${selectedRows.length} students`);

        } catch (error) {
            console.error('PDF Export Error:', error);
            message.error('Failed to generate PDF');
        }
    };


    // Column Selector Content
    const columnSelectorContent = (
        <div style={{ maxHeight: '400px', overflowY: 'auto', width: '250px' }}>
            <div style={{ marginBottom: '12px', fontWeight: 600 }}>
                Select Columns to Display
            </div>
            {table.getAllLeafColumns()
                .filter(col => col.id !== 'select' && col.id !== 'actions')
                .map(column => (
                    <div key={column.id} style={{ marginBottom: '8px' }}>
                        <Checkbox
                            checked={column.getIsVisible()}
                            onChange={column.getToggleVisibilityHandler()}
                        >
                            {column.columnDef.header}
                        </Checkbox>
                    </div>
                ))}
        </div>
    );

    return (
        <div className="all-students-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>👥 All Students</h1>
                    <p>Manage and track students across all your courses</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Popover content={columnSelectorContent} trigger="click" placement="bottomRight">
                        <Button icon={<SettingOutlined />}>
                            Columns
                        </Button>
                    </Popover>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={handleExportPDF}
                    >
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <Select
                    placeholder="Filter by Course"
                    style={{ width: 250 }}
                    allowClear
                    value={filters.courseId || undefined}
                    onChange={(value) => setFilters({ ...filters, courseId: value || '' })}
                >
                    {courses.map(course => (
                        <Select.Option key={course.course_id} value={course.course_id}>
                            {course.course_name}
                        </Select.Option>
                    ))}
                </Select>

                <Input
                    placeholder="Search by name, email, or phone..."
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />

                <div className="filter-info">
                    <FilterOutlined /> {students.length} students found
                    {Object.keys(rowSelection).length > 0 &&
                        ` (${Object.keys(rowSelection).length} selected)`}
                </div>
            </div>

            {/* React Table */}
            <div className="students-table-container">
                <div className="table-wrapper">
                    <table className="students-table">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            style={{ width: header.getSize() }}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="header-cell">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getIsSorted() && (
                                                    <span className="sort-icon">
                                                        {header.column.getIsSorted() === 'asc' ?
                                                            <CaretUpOutlined /> : <CaretDownOutlined />}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination-controls">
                    <div className="pagination-info">
                        Showing {table.getRowModel().rows.length} of {students.length} students
                    </div>
                    <div className="pagination-buttons">
                        <Button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {'<<'}
                        </Button>
                        <Button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {'<'}
                        </Button>
                        <span className="page-indicator">
                            Page {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </span>
                        <Button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {'>'}
                        </Button>
                        <Button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            {'>>'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllStudentsPage;