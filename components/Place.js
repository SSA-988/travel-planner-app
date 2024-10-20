import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Place = ({item, items, setItems, index}) => {
  const choosePlaces = name => {
    setItems(prevItems => {
      if (prevItems.includes(name)) {
        // If the item is already in the array, filter it out
        return prevItems.filter(item => item !== name);
      } else {
        // If the item is not in the array, add it
        return [...prevItems, name];
      }
    });
  };
  return (
    <Pressable
      onPress={() => choosePlaces(item?.name)}
      key={index}
      style={{marginTop: 12}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 10,
        }}>
        <View style={{flex: 1}}>
          {/* Allow this view to take available space */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
            }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: '#0066b2',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: '500',
                }}>
                {index + 1}
              </Text>
            </View>

            <Text
              numberOfLines={2}
              style={{
                fontSize: 16,
                fontWeight: '500',
                width: '82%',
              }}>
              {item?.name}
            </Text>
          </View>
          <Text
            numberOfLines={3}
            style={{
              color: 'gray',
              marginTop: 7,
              width: '80%',
            }}>
            {item?.briefDescription}
          </Text>
        </View>

        <View>
          {/* Only show the first image from the photos array */}
          <Image
            source={{uri: item.photos[0]}} // Access the first image URL
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
            }} // Adjust size and styling as needed
            resizeMode="cover" // Optional: Control how the image is resized
          />
        </View>
      </View>
      <View>
        {items?.includes(item?.name) && (
          <>
            {item?.phoneNumber && (
              <View
                style={{
                  marginHorizontal: 8,
                  marginBottom: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <AntDesign name="phone" size={23} color="#2a52be" />

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#4B61D1',
                  }}>
                  {item?.phoneNumber}
                </Text>
              </View>
            )}

            <View
              style={{
                marginHorizontal: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <Ionicons name="time-outline" size={23} color="#2a52be" />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#4B61D1',
                }}>
                Open {item?.openingHours[0].split(': ')[1]}
              </Text>
            </View>
            {item?.website && (
              <View
                style={{
                  marginHorizontal: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 6,
                }}>
                <Ionicons name="earth" size={23} color="#2a52be" />

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '400',
                    color: '#4B61D1',
                  }}>
                  {item?.website}
                </Text>
              </View>
            )}

            {item?.formatted_address && (
              <View
                style={{
                  marginHorizontal: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 8,
                }}>
                <Entypo name="location" size={23} color="#2a52be" />

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '400',
                    color: '#4B61D1',
                    width:"95%"
                  }}>
                  {item?.formatted_address}
                </Text>
              </View>
            )}

            {item?.types && (
              <View
                style={{
                  marginHorizontal: 8,
                  marginBottom: 6,
                  marginTop: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                }}>
                {item?.types?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      borderRadius: 23,
                      backgroundColor: '#4B61D1',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 13,
                        fontWeight: '500',
                      }}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
};

export default Place;

const styles = StyleSheet.create({});
