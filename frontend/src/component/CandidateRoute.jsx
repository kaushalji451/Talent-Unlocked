import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/context';

const CandidateRoute = ({ children }) => {
  const { user, isCandidate, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; 

  if (!user) return <Navigate to="/login" />;       
  if (!isCandidate) return <Navigate to="/unauthorized" />; 

  return children;
};

export default CandidateRoute;
