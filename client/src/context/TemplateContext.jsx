import React, { createContext, useState, useCallback, useContext} from 'react'
import { getAllTemplates as apiGetAllTemplates } from '../api/templateServiceApi.js' // Renamed for clarity
import useAuthContext from '../hooks/useAuth.js'

const TemplateContext = createContext(null)

const TemplateContextProvider = ({ children }) => {

    const [ templates, setTemplates ] = useState([])
    const [ isLoadingTemplates, setIsLoadingTemplates ] = useState(false)
    const [ templatesError, setTemplatesError ] = useState(null)

    const { isAuthenticated } = useAuthContext()

    const getAllTemplates = useCallback(async () => {
        if( !isAuthenticated ) {
            setTemplates([])
            setIsLoadingTemplates(false)
            setTemplatesError(null)
            return []; // Return empty array if not authenticated
        }

        setIsLoadingTemplates(true)
        setTemplatesError(null)

        try{
            const data = await apiGetAllTemplates()
            const templatesArray = Array.isArray(data) ? data : [];
            setTemplates(templatesArray)
            return templatesArray; // *** FIX: Return the fetched data ***
        }
        catch(error) {
            console.error("Error fetching templates in TemplateContext: ", error)
            setTemplatesError(error.message || "Failed to load templates. Please try again.")
            return []; // Return empty array on error
        }
        finally {
            setIsLoadingTemplates(false)
        }
    }, [isAuthenticated])

    const contextValues = {
        templates,
        isLoadingTemplates,
        templatesError,
        getAllTemplates
    }

    return (
        <TemplateContext.Provider value={ contextValues }>
            {children}
        </TemplateContext.Provider>
    )
}

export { TemplateContext, TemplateContextProvider}
