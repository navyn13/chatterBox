import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStateValue } from './StateProvider';

function ProtectedRoute({ children }) {
    const [{ isAuth }] = useStateValue();
    
    if (!isAuth) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
