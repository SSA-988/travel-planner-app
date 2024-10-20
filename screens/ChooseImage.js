import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const ChooseImage = () => {
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
  const navigation = useNavigation();

  const handleSelectImage = image => {
    navigation.navigate('Create', {image: image});
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#484848'}}>
      <View>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 15,
            color: 'white',
            fontSize: 16,
            fontWeight: '500',
          }}>
          Choose Image
        </Text>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          {images?.map((item, index) => (
            <Pressable
              onPress={() => handleSelectImage(item?.image)}
              style={{margin: 10}}>
              <Image
                style={{
                  width: 118,
                  height: 160,
                  resizeMode: 'cover',
                  borderRadius: 15,
                }}
                source={{uri: item?.image}}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChooseImage;

const styles = StyleSheet.create({});
