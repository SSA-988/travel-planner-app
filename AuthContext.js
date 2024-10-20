import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import {createContext, useEffect, useState} from 'react';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');

  const [userInfo,setUserInfo] = useState(null);

  const [upcomingGames, setUpComingGames] = useState([]);

  const isLoggedIn = async () => {
    try {
      const userToken = await AsyncStorage.getItem('authToken');
      setToken(userToken);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    isLoggedIn();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        userId,
        setUserId,
        userInfo,
        setUserInfo,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};
