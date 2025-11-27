import useAuth from './path/to/useAuth';

function MyComponent() {
    const { user } = useAuth();

    // Check if user has specific role
    const isAdmin = user?.roles?.includes('admin');
    const isTeacher = user?.roles?.includes('teacher');

    // Check if user has any of multiple roles
    const canManageContent = user?.roles?.some(role =>
        ['admin', 'teacher', 'moderator'].includes(role)
    );

    // Get all roles
    const userRoles = user?.roles || [];

    console.log('User roles:', userRoles);

    return (
        <div>
            {isAdmin && <AdminPanel />}
            {isTeacher && <TeacherDashboard />}
            {userRoles.map(role => (
                <span key={role}>{role}</span>
            ))}
        </div>
    );
}