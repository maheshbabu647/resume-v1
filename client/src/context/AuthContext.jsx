import react, { Children, createContext, useCallback, useContext, useEffect, useState} from 'react'

import { authStatus, userSignin, userSignout, userSignup } from '../api/authServiceApi.js'

const AuthContext = createContext(null)

const AuthContextProvider = ({children}) => {

    const [authState, setAuthState] = useState({
        userData : null,
        isAuthenticated : false,
        isLoading : true, // Start with loading true
        error : null
    })

    const checkStatus = useCallback(async () => {

        setAuthState(prev => ({ ...prev, isLoading : true, error : null }))

        try {

            const response = await authStatus()
            if (response.success && response.data) { // Check for data presence

                const {userName, userEmail, userRole} = response.data
                const userData = {
                    userName,
                    userEmail,
                    userRole
                }

                setAuthState({
                    userData : userData,
                    isAuthenticated : true,
                    isLoading : false,
                    error : null
                })
            }
            else{
                setAuthState({
                    userData : null,
                    isAuthenticated : false,
                    isLoading : false,
                    error : null
                })
            }

        }
        catch (error) {

            console.log("Error checking the status : ", error)
            setAuthState({
                userData : null,
                isAuthenticated : false,
                isLoading : false,
                error : null // Don't set a global error on initial status check failure
            })
        }
    }, [])

    useEffect(() => {
        checkStatus();
    },[checkStatus])

    const signin = useCallback( async (signinCredentials) => {

        setAuthState(prev => ({ ...prev, isLoading : true, error : null }))

        try{

            const response = await userSignin(signinCredentials)
            if(response.success){

                const {userName, userEmail, userRole} = response.data
                
                const userData = {
                    userName,
                    userEmail,
                    userRole
                }

                setAuthState({
                    userData,
                    isAuthenticated : true,
                    isLoading : false,
                    error : null
                })
                return true
            }
            else {
                // Throw an error if API call was successful but operation failed
                throw new Error(response.message || 'Something went wrong, Please try again.')
            }

        }
        catch(error){

            console.log("Login error in context : ", error)
            setAuthState({
                userData : null,
                isAuthenticated : false,
                isLoading : false,
                error : error.response?.data || { message: error.message || 'Login failed. Please try again.' }
            })

            return false
        }
    }, [])

    const signup = useCallback(async (signupCredentials) => {

        setAuthState(( prev ) => ({ ...prev, isLoading : true, error : null }))
        try{

            const response = await userSignup(signupCredentials)
            if(response.success){

                const {userName, userEmail, userRole} = response.data
                const userData = {
                    userName,
                    userEmail,
                    userRole
                }

                setAuthState({
                    userData,
                    isAuthenticated : true,
                    isLoading : false,
                    error : null
                })
                return true
            } 
            else {
                throw new Error(response.message || "Something went wrong, Please try again.")
            }

        }
        catch (error) {

            console.log('Signup failed in context : ', error)
            setAuthState({
                userData : null,
                isAuthenticated : false,
                isLoading : false,
                error : error.response?.data || { message: error.message || 'Signup failed. Please try again.' }
            })
            return false
        }
    }, [])

    const signout = useCallback(async () => {
        // Optimistically update UI while waiting for API
        setAuthState((prev) => ({...prev, isLoading : true, error : null}))
        try{
            await userSignout()
        }
        catch(error){
            console.error("Server signout failed, but signing out locally.", error)
        }
        finally {
            // This runs regardless of API success/failure
            setAuthState({
                userData : null,
                isAuthenticated : false,
                isLoading : false,
                error : null
            })
            // The calling component will handle navigation.
        } 
    }, [])

    const value = {
        ...authState,
        signin,
        signup,
        signout
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>

}

export { AuthContext, AuthContextProvider }
