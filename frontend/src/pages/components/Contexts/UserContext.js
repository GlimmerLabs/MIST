import React, { useState, createContext, useEffect } from 'react';

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [data, setData] = useState({ albums: [], images: [] });
  function updateAuthenticatedUser() {
    fetch('/api?action=getAuthenticatedCompletePersonalProfile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => res.ok ? res.json() : res.text())
      .then((data) => setData(data.user))
      .catch(console.log);
  };
  useEffect(() => updateAuthenticatedUser(), []);

  // Fetch method to get the data
  return <UserContext.Provider value={{ user: data, updateAuthenticatedUser }}>{props.children}</UserContext.Provider>;
};
export default UserContextProvider;
