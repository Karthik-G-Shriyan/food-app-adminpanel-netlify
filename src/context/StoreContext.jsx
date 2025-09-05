import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const [token, setToken] = useState(() => sessionStorage.getItem("token") || null);


    const contextValue = {
        token,
        setToken
    };

    useEffect( () => {

        if(sessionStorage.getItem("token"))
        {
            setToken(sessionStorage.getItem("token"));
        }
    }, []);



    return (
        <StoreContext.Provider value={contextValue}>
          {props.children}
        </StoreContext.Provider>
      );

};