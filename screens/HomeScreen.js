import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  ImageBackground,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {AuthContext} from '../AuthContext';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'core-js/stable/atob';

const HomeScreen = () => {
  const currentYear = moment().year();
  const navigation = useNavigation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const {userId, setUserId, setToken, userInfo, setUserInfo} =
    useContext(AuthContext);
  const [user, setUser] = useState(null);

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
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchTrips();
    }
  }, [userId]);

  const fetchUserData = async () => {
    const response = await axios.get(`http://localhost:8000/user/${userId}`);
    setUser(response.data);
  };

  const fetchTrips = async () => {
    try {
      console.log('userdata', userId);
      const response = await axios.get(`http://localhost:8000/trips/${userId}`);
      setTrips(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setLoading(false);
    }
  };

  // useEffect(() => {

  //   fetchTrips();
  // }, []);
  console.log('user', userId);
  //b54duShqAlbkCfMv
  const logout = () => {
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('authToken');

      setToken('');
    } catch (error) {
      console.log('Error', error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Ionicons onPress={logout} name="person" size={30} color="orange" />

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
            <AntDesign name="search1" size={30} color="orange" />
            <AntDesign name="plus" size={30} color="orange" />
          </View>
        </View>

        <View style={{padding: 10}}>
          <Text style={{fontSize: 25, fontWeight: 'bold'}}>My Trips</Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 19,
              color: 'orange',
              fontWeight: '600',
            }}>
            {currentYear}
          </Text>
        </View>

        <View style={{padding: 15}}>
          {trips?.map((item, index) => (
            <Pressable
              style={{marginTop: 15}}
              onPress={() => {
                navigation.navigate('Plan', {
                  item: item,
                  user: user,
                });
              }}>
              <ImageBackground
                imageStyle={{borderRadius: 10}}
                style={{width: '100%', height: 220}}
                source={{
                  //   uri: 'https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM1fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D',
                  uri: item?.background,
                }}>
                <View
                  style={{
                    padding: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>
                    {item?.startDate} - {item?.endDate}
                  </Text>
                  <Text
                    style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>
                    {moment(item.createdAt).format('MMMM Do')}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 19,
                    fontWeight: 'bold',
                    color: 'white',
                    marginHorizontal: 15,
                  }}>
                  {item?.tripName}
                </Text>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

        <View style={{padding: 10}}>
          <Image
            style={{
              width: '96%',
              height: 220,
              resizeMode: 'contain',
              alignSelf: 'center',
              borderRadius: 20,
            }}
            source={{
              uri: 'https://tripsy.blog/content/images/size/w1000/2023/03/Tripsy-2.15-Cover-2.jpg',
            }}
          />
        </View>

        <View
          style={{
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 17, fontWeight: '600', textAlign: 'center'}}>
            Organize your next trip
          </Text>

          <Text
            style={{
              marginTop: 15,
              color: 'gray',
              width: 250,
              textAlign: 'center',
              fontSize: 16,
            }}>
            Create your next trip and plan the activities of your itinerary
          </Text>

          <Pressable
            onPress={() => navigation.navigate('Create')}
            style={{
              marginTop: 25,
              backgroundColor: '#383838',
              padding: 14,
              width: 200,
              borderRadius: 25,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
              }}>
              Create a Trip
            </Text>
          </Pressable>

          <View>
            <Image
              style={{width: 150, height: 120}}
              source={{
                uri: 'https://public.boxcloud.com/api/2.0/internal_files/1167478797742/versions/1271676686542/representations/png_paged_2048x2048/content/1.png?access_token=1!hs1qX05pRokYoNwGPUsZ4LuosvV9iRw8c9UieTIuHKCKa52TT3goWDSJeKRKBw_aVAyWuupiTxPfJwlwFfIE0jtEXEmcMjflVFyTapQ7u8IwxCLXk-OtTkMxBqIgoFmCUIGSg2hmIusso00uaP5WC1CKFKKqy4sEO6A_xInxgBUTgqmIJ7GwU1JYooTEKMB9RbBH8TlwluwGv0JxQ1o5SfyYBdsOrBsVPfZsW_CfBD4jiu2z5su8udyEdLYF97pfw55KF02ibw6SxqIoHVy0G9qzRUxhHhUFsGHTtzFQpyhpKSrVE0W__xFmk0ZLjIJJbQKRd0UyCO8c98Tuh3_8MsP67t0Z4xLsptig0ncFPZFqqcdN_bK_KTgRGHLUWEMBaSSmuVFaw31XWVxvqRkayJnf2BXCR_YdY_FPD-zjvJpwYPmo1K1sgvya1ZnMJOqi5FsZ0p4jcbgwI-3rfmiFa2Huf6xiZ-ZGQaXQf8bnjMXLrY3b5A-u8mDuQRexRYNw8oCn51-F9qMSv6UhSnBlll7InJ_Vp7YfkqR2Zrcryg2SGdPnobJbumjnRwtHVnwM3kLD9zOHXhHxzvJJ2MKx7lpviLlNX7IVoBr0f3nDdS0.&shared_link=https%3A%2F%2Fapp.box.com%2Fs%2Fu011ynlsqycigvsctgbebh07i0qpnzj8&box_client_name=box-content-preview&box_client_version=2.106.0',
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
