import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode'
import { AuthContext } from './context'


const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      // ✅ This runs when the app first loads or refreshes
      const token = Cookies.get('token'); // ⬅️ Read token from cookie
  
      if (token) {
        try {
          const decoded = jwtDecode(token); // ⬅️ Decode it to get user info
          setUser(decoded);                 // ⬅️ Save decoded user in state
        } catch (err) {
          console.error("Invalid token:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
  
      setLoading(false); // ✅ Important to signal that we're done loading
    }, []);
      const isAdmin = user?.role === 'admin';
      const isCandidate = user?.role === 'candidate';
     
    return (
        <AuthContext.Provider value={{ user, isAdmin: true, isCandidate, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider