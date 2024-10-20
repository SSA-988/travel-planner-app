import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import axios from 'axios';
import {BottomModal} from 'react-native-modals';
import {SlideAnimation} from 'react-native-modals';
import {ModalContent} from 'react-native-modals';
import moment from 'moment';

const DefineActivity = ({}) => {
  const route = useRoute();

  const [slot, setSlot] = useState('Morning');

  const [option, setOption] = useState('');
  const {onGoBack} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [openingHours, setOpeningHours] = useState('');
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [number, setNumber] = useState('');
  const [reviews, setReviews] = useState('');
  const [photos, setPhotos] = useState('');

  // State to track if the screen is being revisited
  const [isFirstFocus, setIsFirstFocus] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef(null); // Create a reference for the TextInput
  useEffect(() => {
    // Focus the TextInput when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const fetchPlaceDetails = async placeId => {
    const API_KEY = 'AIzaSyCOZJadVuwlJvZjl_jWMjEvJDbbc17fQQI'; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const details = response.data.result;

      console.log('Place Details:', details);

      // Example: Extract specific info like opening hours, phone number, reviews, etc.
      const openingHours = details.opening_hours?.weekday_text;
      const phoneNumber = details.formatted_phone_number;
      const website = details.website;
      const reviews = details.reviews;
      const photos = details.photos;

      setOpeningHours(openingHours);
      setNumber(phoneNumber);
      setWebsite(website);
      setReviews(reviews);
      setPhotos(photos);

      // Do something with the data
      console.log('Opening Hours:', openingHours);
      console.log('Phone Number:', phoneNumber);
      console.log('Website:', website);
      console.log('Reviews:', reviews);
      console.log('Photos:', photos);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const firstDayTime =
    openingHours && openingHours.length > 0
      ? openingHours[0].split(': ')[1]
      : 'N/A'; // Fallback value if openingHours is not available

  const PhotoGallery = ({photos, apiKey}) => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 10,
          gap: 10,
        }}>
        {photos.map((photo, index) => {
          const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`;

          return (
            <View style={{width: '45%', marginBottom: 10}}>
              <Image
                key={index}
                source={{uri: imageUrl}}
                style={{
                  width: '100%',
                  height: 120,
                  margin: 10,
                  borderRadius: 10,
                  // resizeMode:"cover"
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    );
  };

  console.log('heyyy', route?.params);

  const formatDate = date => {
    return moment(date).format('D MMMM'); // Example: "6 June"
  };

  // Function to get day name using Moment.js
  const getDayName = date => {
    return moment(date).format('dddd'); // Example: "Monday"
  };

  const slots = [
    {
      id: '0',
      type: 'Morning',
      name: 'sun',
      times: [
        '6:00 AM',
        '7:00 AM',
        '8:00 AM',
        '9:00 AM',
        '10:00 AM',
        '11:00 AM',
      ],
    },
    {
      id: '1',
      type: 'Afternoon',
      name: 'sunrise',
      times: [
        '12:00 PM',
        '1:00 PM',
        '2:00 PM',
        '3:00 PM',
        '4:00 PM',
        '5:00 PM',
      ],
    },
    {
      id: '2',
      type: 'Night',
      name: 'moon',
      times: [
        '6:00 PM',
        '7:00 PM',
        '8:00 PM',
        '9:00 PM',
        '10:00 PM',
        '11:00 PM',
      ],
    },
  ];
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView>
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            <Text style={{marginLeft: 'auto', marginRight: 'auto'}}>
              {route?.params?.name}
            </Text>
          </View>

          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'pink',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <AntDesign name="search1" size={23} color="white" />
            </View>

            <View style={{width: '100%'}}>
              <TextInput
                editable={false}
                ref={inputRef}
                value={input}
                onChangeText={setInput}
                placeholderTextColor={'gray'}
                style={{fontSize: input ? 17 : 17}}
                placeholder={`Search by ${route?.params?.name}`}
              />
              {/* <Text style={{marginTop: 7}}>Near by Everywhere</Text> */}

              <GooglePlacesAutocomplete
                styles={{
                  container: {
                    flex: 0,
                    marginTop: 10,
                    width: '80%',
                    borderRadius: 20,
                    borderColor: '#E0E0E0',
                    borderWidth: 1,
                  },
                  textInput: {
                    height: 38,
                    color: '#5d5d5d',
                    fontSize: 16,
                    borderRadius: 24,
                  },
                  textInputContainer: {
                    borderRadius: 20,
                  },
                }}
                placeholder="Search"
                fetchDetails={true} // Ensure we get 'details' from GooglePlacesAutocomplete
                onPress={(data, details = null) => {
                  console.log('Selected Place:', data);
                  setName(data?.description);
                  if (details) {
                    const placeId = details.place_id;
                    // Fetch additional place details using Place Details API
                    fetchPlaceDetails(placeId);
                  }
                }}
                query={{
                  key: 'AIzaSyCOZJadVuwlJvZjl_jWMjEvJDbbc17fQQI', // Replace with your API key
                  language: 'en',
                }}
              />
            </View>
          </View>

          {/* <Pressable
        style={{marginTop: 20, marginLeft: 'auto', marginRight: 'auto'}}>
        <Text style={{fontWeight: '500', color: 'gray', fontSize: 16}}>
          Enter Manually
        </Text>

      </Pressable> */}

          {name && (
            <View
              style={{
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}>
              <View
                style={{
                  backgroundColor: '#3457D5',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  alignSelf: 'flex-start',
                  borderRadius: 20,
                  // width: '100%',
                }}>
                <Text
                  numberOfLines={2}
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: '600',
                    width: 300,
                  }}>
                  {name}
                </Text>
              </View>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Text>Add</Text>
              </Pressable>
            </View>
          )}

          {openingHours && (
            <View
              style={{
                marginHorizontal: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <Ionicons name="time-outline" size={23} color="#2a52be" />
              <Text style={{fontSize: 15, fontWeight: '400'}}>
                Open {firstDayTime}
              </Text>
            </View>
          )}

          {number && (
            <View
              style={{
                marginHorizontal: 12,
                marginVertical: 15,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <AntDesign name="phone" size={23} color="#2a52be" />

              <Text style={{fontSize: 15, fontWeight: '400'}}>{number}</Text>
            </View>
          )}

          {website && (
            <View
              style={{
                marginHorizontal: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 10,
              }}>
              <Ionicons name="earth" size={23} color="#2a52be" />

              <Text style={{fontSize: 15, fontWeight: '400'}}>{website}</Text>
            </View>
          )}

          {photos && (
            <PhotoGallery
              photos={photos}
              apiKey={'AIzaSyCOZJadVuwlJvZjl_jWMjEvJDbbc17fQQI'}
            />
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}>
        <ModalContent
          style={{width: '100%', height: 700, backgroundColor: '#F8F8F8'}}>
          <View>
            {route?.params?.itinerary?.map((item, index) => (
              <View style={{padding: 10, borderRadius: 8, marginBottom: 7}}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                  <Text style={{fontSize: 15, fontWeight: '500'}}>
                    {getDayName(item.date)},
                  </Text>
                  <Text style={{flex: 1, fontSize: 15, fontWeight: '500'}}>
                    {formatDate(item.date)}
                  </Text>

                  {option == getDayName(item.date) ? (
                    <FontAwesome5
                      onPress={() => setOption(getDayName(item.date))}
                      name="dot-circle"
                      size={25}
                      color="orange"
                    />
                  ) : (
                    <FontAwesome
                      onPress={() => setOption(getDayName(item.date))}
                      name="circle-thin"
                      size={25}
                      color="gray"
                    />
                  )}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 6,
                  }}>
                  <Text style={{color: 'gray', fontSize: 15}}>Bengaluru</Text>
                  <Text style={{color: 'gray'}}>
                    {item.activities.length} Activities
                  </Text>
                </View>
                {option == getDayName(item.date) && (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 15,
                        justifyContent: 'space',
                      }}>
                      {slots?.map((item, index) => (
                        <Pressable
                          onPress={() => setSlot(item?.type)}
                          style={{
                            gap: 10,
                            width: '33%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Feather
                            style={{textAlign: 'center'}}
                            name={item?.name}
                            size={23}
                            color= {slot == item?.type ? "orange" : "gray"}
                          />

                          <Text style={{color: 'gray'}}>{item?.type}</Text>
                        </Pressable>
                      ))}
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      {slots
                        ?.filter(item => item.type == slot)
                        .map((item, index) =>
                          item?.times?.map((item, index) => (
                            <Pressable
                              style={{
                                padding: 10,
                                backgroundColor: '#E8E8E8',
                                borderRadius: 7,
                                marginRight:10,
                              }}>
                              <Text style={{color:"gray",fontSize:13}}>{item}</Text>
                            </Pressable>
                          )),
                        )}
                    </ScrollView>

                
                  </View>
                )}
              </View>
            ))}
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default DefineActivity;

const styles = StyleSheet.create({});
