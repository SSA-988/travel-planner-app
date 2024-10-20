import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Pressable,
  TextInput,
  Button,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import React, {useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import DatePicker from 'react-native-date-ranges';
import DateRangePicker from 'react-native-daterange-picker';
import moment from 'moment';
import axios from 'axios';
import {AuthContext} from '../AuthContext';

const CreateTrip = () => {
  const images = [
    {
      id: '0',
      image:
        'https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM1fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D',
    },
    {
      id: '1',
      image:
        'https://images.unsplash.com/photo-1716417511759-dd9c0f353ef9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDQ0fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D',
    },
    {
      id: '2',
      image:
        'https://images.unsplash.com/photo-1536928994169-e339332d0b4e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDc3fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D',
    },
    {
      id: '3',
      image:
        'https://images.unsplash.com/photo-1689753363735-1f7427933d0d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D',
    },
    {
      id: '4',
      image:
        'https://images.unsplash.com/photo-1577172249844-716749254893?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTN8fHxlbnwwfHx8fHw%3D',
    },
    {
      id: '5',
      image:
        'https://images.unsplash.com/photo-1503756234508-e32369269deb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fHw%3D',
    },
    {
      id: '6',
      image:
        'https://images.unsplash.com/photo-1715940404541-8de003993435?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDExMnw2c01WalRMU2tlUXx8ZW58MHx8fHx8',
    },
    {
      id: '7',
      image:
        'https://images.unsplash.com/photo-1489945796694-07eba0228bc7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE1Nnw2c01WalRMU2tlUXx8ZW58MHx8fHx8',
    },
    {
      id: '8',
      image:
        'https://images.unsplash.com/photo-1715144536829-50ee7e56596d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI1M3w2c01WalRMU2tlUXx8ZW58MHx8fHx8',
    },
  ];
  const route = useRoute();
  const [tripName, setTripName] = useState('');
  const [image, setImage] = useState(images[0].image);
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [displayedDate, setDisplayedDate] = useState(moment());
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');
  const [background, setBackground] = useState('');
  const {userId, setUserId, setToken, userInfo, setUserInfo} =
    useContext(AuthContext);

  useEffect(() => {
    if (route?.params?.image) {
      setBackground(route?.params?.image);
    }
  }, [route?.params]);

  const handleCreateTrip = async () => {
    if (!tripName || !startDate || !endDate) {
      alert('Please fill all fields');
      return;
    }

    // const startDay = moment(startDate).format('dddd');
    // const endDay = moment(endDate).format('dddd');

    const tripData = {
      tripName,
      startDate: startDate,
      endDate: endDate,
      startDay,
      endDay,
      // background:"https://images.unsplash.com/photo-1577172249844-716749254893?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTN8fHxlbnwwfHx8fHw%3D",
      background: background,
      host: userId,
    };

    try {
      const response = await axios.post('http://localhost:8000/trip', tripData);

      console.log('Trip created successfully:', response.data);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error(
        'Error creating trip:',
        error.response ? error.response.data : error.message,
      );
      // Handle error (e.g., show an error message)
    }
  };

  const setDates = dates => {
    if (dates.startDate) {
      setStartDate(dates.startDate);
      setStartDay(moment(dates.startDate).format('dddd'));
    }
    if (dates.endDate) {
      setEndDate(dates.endDate);
      setEndDay(moment(dates.endDate).format('dddd'));
    }
    if (dates.displayedDate) {
      setDisplayedDate(dates.displayedDate);
    }
  };

  const formatDate = date => {
    if (date) {
      return moment(date).format('DD MMMM YYYY');
    }
    return '';
  };

  console.log(displayedDate);

  const customButton = onConfirm => {
    return (
      <Button
        onPress={onConfirm}
        style={{
          container: {width: '80%', marginHorizontal: '3%'},
          text: {fontSize: 20},
        }}
        primary
        title="Submit"
      />
    );
  };
  return (
    <SafeAreaView>
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        source={{
          //   uri: 'https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM1fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D',
          uri: background ? background : image,
        }}>
        <View
          style={{
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
              Cancel
            </Text>
          </Pressable>

          <Pressable
            onPress={handleCreateTrip}
            style={{padding: 10, backgroundColor: 'white', borderRadius: 25}}>
            <Text
              style={{
                textAlign: 'center',
                color: 'orange',
                fontSize: 15,
                fontWeight: '500',
              }}>
              Create
            </Text>
          </Pressable>
        </View>

        <View style={{padding: 15}}>
          <DateRangePicker
            onChange={setDates}
            endDate={endDate}
            startDate={startDate}
            displayedDate={displayedDate}
            range>
            <AntDesign name="calendar" size={25} color="white" />
          </DateRangePicker>
          <View>
            <View>
              <TextInput
                value={tripName}
                onChangeText={setTripName}
                placeholderTextColor={'#c1c9d6'}
                style={{fontSize: 25, fontWeight: 'bold', color: '#c1c9d6'}}
                placeholder="Trip name"
              />
            </View>

            <View
              style={{
                backgroundColor: '#c1c9d6',
                marginVertical: 15,
                borderRadius: 20,
              }}>
              <View
                style={{
                  padding: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                }}>
                <AntDesign name="calendar" size={25} color="black" />
                <Text style={{fontSize: 16, color: '#505050'}}>Itinerary</Text>
              </View>

              <View style={{borderColor: '#e0e0e0', borderWidth: 1}} />

              <View
                style={{
                  padding: 15,
                }}>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={{color: '#505050'}}>
                      {startDate ? startDay : 'Starts'}
                    </Text>
                    <Text style={{marginTop: 6, fontSize: 15}}>
                      {startDate ? formatDate(startDate) : 'Set Dates'}
                    </Text>
                  </View>

                  <AntDesign name="arrowright" size={20} color="black" />

                  <View>
                    <Text style={{color: '#505050'}}>
                      {endDay ? endDay : 'Starts'}
                    </Text>
                    <Text style={{marginTop: 6, fontSize: 15}}>
                      {endDate ? formatDate(endDate) : 'End Dates'}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            <View
              style={{
                // backgroundColor: '#c1c9d6',

                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#c1c9d6',
                  borderRadius: 20,
                  padding: 15,
                }}>
                <AntDesign name="earth" size={25} color="black" />
                <Text style={{marginTop: 10, fontSize: 15, fontWeight: '600'}}>
                  TimeZone
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#505050',
                  }}>
                  Bengaluru, India
                </Text>
              </View>

              <Pressable
                onPress={() => navigation.navigate('Choose', {})}
                style={{
                  flex: 1,
                  backgroundColor: '#c1c9d6',
                  borderRadius: 20,
                  padding: 15,
                }}>
                <FontAwesome name="photo" size={25} color="black" />
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 15,
                    fontWeight: '600',
                  }}></Text>
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#505050',
                  }}>
                  Choose Image
                </Text>
              </Pressable>
            </View>
          </View>

          {/* <Text>{`Start Date: ${formatDate(startDate)}`}</Text>
          <Text>{`Start Day: ${startDay}`}</Text>
          <Text>{`End Date: ${formatDate(endDate)}`}</Text>
          <Text>{`End Day: ${endDay}`}</Text> */}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default CreateTrip;

const styles = StyleSheet.create({});
