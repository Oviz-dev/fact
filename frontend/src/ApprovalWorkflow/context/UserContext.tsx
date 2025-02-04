import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
}

interface UserContextType {
  users: User[];
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  users: [],
  loading: false
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [users] = useState<User[]>([
    { id: '1', name: 'Олег' },
    { id: '2', name: 'Роман' },
    { id: '3', name: 'Илья' }
  ]);

  return (
    <UserContext.Provider value={{ users, loading: false }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);