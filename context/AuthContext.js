import { createContext, useContext, useState } from "react";
import { auth } from "../firebase.config";
import {
    createUserWithEmailAndPassword, onAuthStateChanged,
    signInWithEmailAndPassword, signOut


} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext)
}
export const AuthProvider = ({ children }) => { 
    const [currentUser,setCurrentUser]     = useState()
    const [loading,setLoading]= useState(true)

    const signup = (email, password) => { 
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const login = (email, password) => { 
        return signInWithEmailAndPassword(auth, email, password)
    } 
  
    const logout = () => {
        return signOut(auth)
    }
 useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, user => {
         setcurrentUser(user)
         setLoading(false)
     })
     return unsubscribe
 }, []);
    
    const value = {
        currentUser,
        login,
        signup,
        logout,
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}


