import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext';

GoogleSignin.configure({
  webClientId:
    '847080271209-dctpn8t7hbdactkruq9n72stqqnhfht2.apps.googleusercontent.com',
  iosClientId:
    '847080271209-tugpe7mjovatdv0gp9dkdcdtdhinmpd3.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

const LoginScreen = () => {

  const {token,setToken} = useContext(AuthContext);

  const GoogleLogin = async () => {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log('u', userInfo);
    return userInfo;
  };
  //847080271209-dctpn8t7hbdactkruq9n72stqqnhfht2.apps.googleusercontent.com

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleGoogleLogin = async () => {
  // 	setLoading(true);
  // 	try {
  // 		const response = await GoogleLogin();
  // 		const { idToken, user } = response;

  //     console.log("user",user);

  // 		// if (idToken) {
  // 		// 	const resp = await authAPI.validateToken({
  // 		// 		token: idToken,
  // 		// 		email: user.email,
  // 		// 	});
  // 		// 	await handlePostLoginData(resp.data);
  // 		// }
  // 	} catch (apiError) {
  // 		setError(
  // 			apiError?.response?.data?.error?.message || 'Something went wrong'
  // 		);
  // 	} finally {
  // 		setLoading(false);
  // 	}
  // };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await GoogleLogin(); // Google sign-in
      const {idToken} = response; // Check if idToken is directly available

      console.log('idToken:', idToken); // Log idToken to check if it's retrieved

      // If idToken is not directly available, get it from response.data.idToken
      const extractedIdToken = idToken || response.data.idToken;
      console.log('Extracted idToken from data:', extractedIdToken); // Log the extracted idToken

      if (extractedIdToken) {
        // Send idToken to the backend using axios
        const backendResponse = await axios.post(
          'http://localhost:8000/google-login',
          {
            idToken: extractedIdToken, // Sending the idToken
          },
        );

        const data = backendResponse.data;
        console.log('Backend Response:', backendResponse.data);

        await AsyncStorage.setItem('authToken', data.token);

        setToken(data.token);

        // Update auth state (if using context or state)
        // setIsAuthenticated(true); // Navigate to the main screen
        // Handle JWT token and user data here
      }
    } catch (error) {
      console.log('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View style={{marginTop: 30, alignItems: 'center'}}>
        <Image
          style={{width: 240, height: 80, resizeMode: 'contain'}}
          source={{uri: 'https://wanderlog.com/assets/logoWithText.png'}}
        />
      </View>

      <View style={{marginTop: 70}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            justifyContent: 'center',
            borderColor: '#E0E0E0',
            margin: 12,
            borderWidth: 1,
            gap: 30,
            borderRadius: 25,
            marginTop: 20,
            position: 'relative', // Added to position icon absolutely if needed
          }}>
          {/* Icon to the left */}
          <AntDesign
            style={{position: 'absolute', left: 10}} // Positioning the icon to the far left
            name="facebook-square"
            size={24}
            color="blue"
          />

          {/* Centered text */}
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 15,
              fontWeight: '500',
            }}>
            Sign Up With Facebook
          </Text>
        </View>

        <Pressable
          onPress={handleGoogleLogin}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            justifyContent: 'center',
            borderColor: '#E0E0E0',
            margin: 12,
            borderWidth: 1,
            gap: 30,
            borderRadius: 25,
            position: 'relative',
            marginTop: 20,
          }}>
          <AntDesign
            style={{position: 'absolute', left: 10}}
            name="google"
            size={24}
            color="red"
          />
          <Text style={{textAlign: 'center', fontSize: 15, fontWeight: '500'}}>
            Sign Up With Google
          </Text>
        </Pressable>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            justifyContent: 'center',
            borderColor: '#E0E0E0',
            margin: 12,
            borderWidth: 1,
            gap: 30,
            borderRadius: 25,
            marginTop: 20,
            position: 'relative',
          }}>
          <AntDesign
            style={{position: 'absolute', left: 10}}
            name="mail"
            size={24}
            color="black"
          />
          <Text style={{textAlign: 'center', fontSize: 15, fontWeight: '500'}}>
            Sign Up With Email
          </Text>
        </View>
        <Pressable style={{marginTop: 12}}>
          <Text style={{textAlign: 'center', fontSize: 15, color: 'gray'}}>
            Already have an account? Sign In
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
