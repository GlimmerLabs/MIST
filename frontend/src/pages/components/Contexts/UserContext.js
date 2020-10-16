import React, {useState, createContext, useEffect} from 'react';

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [data, setData] = useState();

    useEffect(() => {
        fetch('/api?action=getAuthenticatedCompletePersonalProfile', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include'
          }) 
          .then(res => res.json())
          .then(data => setData(data.user))
          .catch(console.log)
    }, []);

    // Fetch method to get the data
    return <UserContext.Provider value={data}>{props.children}</UserContext.Provider>;
};

export default UserContextProvider;