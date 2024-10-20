import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useState,useCallback} from 'react';
import {useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import moment from 'moment';
import {BottomModal} from 'react-native-modals';
import {SlideAnimation} from 'react-native-modals';
import {ModalContent} from 'react-native-modals';
import {useNavigation,useFocusEffect} from '@react-navigation/native';

const TripScreen = () => {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const formatDate = date => {
    if (date) {
      return moment(date).format('DD MMMM YYYY');
    }
    return '';
  };
  const data = [
    {
      id: '1',
      name: 'Lodging',
      image: 'https://cdn-icons-png.flaticon.com/128/15592/15592598.png',
    },
    {
      id: '2',
      name: 'Restaurant',
      image: 'https://cdn-icons-png.flaticon.com/128/7595/7595720.png',
    },
    {
      id: '3',
      name: 'Tour',
      image: 'https://cdn-icons-png.flaticon.com/128/5472/5472888.png',
    },
    {
      id: '4',
      name: 'Location',
      image: 'https://cdn-icons-png.flaticon.com/128/3124/3124939.png',
    },
    {
      id: '5',
      name: 'Museum',
      image: 'https://cdn-icons-png.flaticon.com/128/4441/4441743.png',
    },
    {
      id: '6',
      name: 'Coffee',
      image: 'https://cdn-icons-png.flaticon.com/128/2498/2498749.png',
    },
    {
      id: '7',
      name: 'Party',
      image: 'https://cdn-icons-png.flaticon.com/128/4633/4633973.png',
    },
    {
      id: '8',
      name: 'Concert',
      image: 'https://cdn-icons-png.flaticon.com/128/3293/3293810.png',
    },
    {
      id: '9',
      name: 'Fitness',
      image: 'https://cdn-icons-png.flaticon.com/128/3084/3084146.png',
    },
    {
      id: '10',
      name: 'Shopping',
      image: 'https://cdn-icons-png.flaticon.com/128/6815/6815081.png',
    },
    {
      id: '11',
      name: 'Kids',
      image: 'https://cdn-icons-png.flaticon.com/128/2444/2444705.png',
    },
    {
      id: '12',
      name: 'Theatre',
      image: 'https://cdn-icons-png.flaticon.com/128/9921/9921891.png',
    },
  ];
  

  const navigation = useNavigation();

  console.log("route",route?.params);

  const itinerary  = route?.params?.item?.itinerary;
  console.log(itinerary);


 
  return (
    <>
      <SafeAreaView>
        <ImageBackground
          style={{width: '100%', height: '100%'}}
          source={{
            //   uri: 'https://images.unsplash.com/photo-1464852045489-bccb7d17fe39?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM1fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D',
            uri: route?.params?.item?.background,
          }}>
          <View
            style={{
              padding: 13,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <AntDesign name="downcircle" size={25} color="white" />
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <AntDesign name="sharealt" size={25} color="white" />
              <AntDesign name="setting" size={25} color="white" />
            </View>
          </View>

          <View style={{marginHorizontal: 13}}>
            <Text style={{fontSize: 16, color: 'white', fontWeight: '600'}}>
              1 Week ago
            </Text>
            <Text
              style={{
                fontSize: 26,
                fontWeight: 'bold',
                color: 'white',
                marginTop: 7,
              }}>
              {route?.params?.item?.tripName}
            </Text>
          </View>

          <View
            style={{
              marginHorizontal: 13,
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
                    {route?.params?.item.endDate}
                  </Text>
                  <Text style={{marginTop: 6, fontSize: 15}}>
                    {route?.params?.item.startDate}
                  </Text>
                </View>

                <AntDesign name="arrowright" size={20} color="black" />

                <View>
                  <Text style={{color: '#505050'}}>
                    {route?.params?.item?.endDay}
                  </Text>
                  <Text style={{marginTop: 6, fontSize: 15}}>
                    {route?.params?.item?.startDay}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              marginHorizontal: 13,
              backgroundColor: '#c1c9d6',
              marginVertical: 10,
              borderRadius: 20,
              padding: 15,
              width: 120,
            }}>
            <AntDesign name="pluscircle" size={30} color="#202020" />

            <Text style={{fontSize: 15, color: '#404040', marginTop: 30}}>
              New Activity
            </Text>
          </Pressable>
        </ImageBackground>
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
          style={{width: '100%', height: 600, backgroundColor: '#F8F8F8'}}>
          <View>
            <Text style={{textAlign: 'center'}}>Choose a Activity</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              {data?.map((item, index) => (
                <Pressable
                  onPress={() => {
                    setModalVisible(false)
                    navigation.navigate('Define', {
                      name: item?.name,
                      itinerary:itinerary
                      // onGoBack: () => setModalVisible(true),
                    });

                  }}
                  style={{
                    width: 95,
                    height: 95,
                    borderRadius: 6,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 10,
                    padding: 10,
                  }}>
                  <Image
                    style={{width: 40, height: 40, borderRadius: 20}}
                    source={{uri: item?.image}}
                  />

                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '400',
                      marginTop: 12,
                      textAlign: 'center',
                    }}>
                    {item?.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default TripScreen;

const styles = StyleSheet.create({});
