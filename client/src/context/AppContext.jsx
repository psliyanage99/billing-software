import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService.js";
import { fetchItems } from "../Service/ItemService.js";


export const AppContext = createContext(null);

export const AppContextProvider = (props) => {

    const [categories, setCategories] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [auth, setAuth] = useState({token: null, role: null});


    useEffect(() => {
        async function loadData() {
            if (localStorage.getItem("token") && localStorage.getItem("role")) {
                setAuthData(
                    localStorage.getItem("token"),
                    localStorage.getItem("role")
                );
            }
            const response = await fetchCategories();
            const itemResponse = await fetchItems();
            console.log('item response', itemResponse);
            setCategories(response.data);
            setItemsData(itemResponse.data);

        }
        loadData();
    }, []);
    

    const setAuthData = (token, role) => {
        setAuth({token, role});
    }


    const contextValue = {
        categories,
        setCategories,
        auth,
        setAuthData,
        itemsData,
        setItemsData
    }

    return <AppContext.Provider value={contextValue}>
        {props.children}
    </AppContext.Provider>
}

export default AppContext;