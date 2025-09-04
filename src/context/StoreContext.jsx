import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const [token, setToken] = useState(() => localStorage.getItem("token") || null);


    const contextValue = {
        token,
        setToken
    };

    useEffect( () => {

        if(localStorage.getItem("token"))
        {
            setToken(localStorage.getItem("token"));
        }
    }, []);



    return (
        <StoreContext.Provider value={contextValue}>
          {props.children}
        </StoreContext.Provider>
      );

};