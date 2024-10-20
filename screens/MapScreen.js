import {StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import MapView, {Circle, Marker} from 'react-native-maps';
import Entypo from 'react-native-vector-icons/Entypo';

const MapScreen = () => {
  const route = useRoute();
  console.log('my places', route?.params?.places);
  const mapView = useRef(null);
  const places = route?.params?.places;
  const firstPlace = places?.[0];

  const coordinates = places?.map(place => ({
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
  }));
  console.log('hey', coordinates);
  useEffect(() => {
    if (places && mapView.current) {
      // Ensure the map fits all markers
      mapView.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [places]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <SafeAreaView>
      <MapView
        loadingEnabled
        ref={mapView}
        initialRegion={{
          latitude: firstPlace.geometry.location.lat, // Use the latitude of the first place
          longitude: firstPlace.geometry.location.lng,
          latitudeDelta: 0.04, // Adjust to zoom appropriately
          longitudeDelta: 0.04,
        }}
        style={{
          width: '100%',
          height: '100%',
          marginTop: 20,
          borderRadius: 5,
        }}>
        {route?.params?.places?.map((item, index) => (
          <Marker
            onPress={() => setSelectedMarker(item)}
            coordinate={{
              latitude: item.geometry.location.lat,
              longitude: item.geometry.location.lng,
            }}
            title={item.name}
            description={item.briefDescription}>
            {/* Display the formatted location name */}
          </Marker>
        ))}

        <View
          style={{
            padding: 10,
            backgroundColor: selectedMarker ? 'white' : 'transparent',
            borderRadius: 7,
            marginTop: 'auto',
            marginBottom: 30,
            marginHorizontal: 13,
          }}>
          {selectedMarker && (
            <View
              style={{
                padding: 5,
                backgroundColor: '#fff',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                elevation: 5,
              }}>
              {/* Name and index */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: '#0066b2',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <Text style={{color: 'white', fontWeight: '500'}}>{1}</Text>
                </View>

                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    width: '82%',
                    flex: 1,
                  }}>
                  {selectedMarker?.name}
                </Text>

                <Entypo
                  onPress={() => setSelectedMarker(null)}
                  name="cross"
                  size={25}
                  color="gray"
                />
              </View>

              {/* Description */}
              <Text numberOfLines={3} style={{color: 'gray', marginBottom: 10}}>
                {selectedMarker.briefDescription}
              </Text>

              {/* Image */}
              {selectedMarker.photos && selectedMarker.photos[0] && (
                <Image
                  source={{uri: selectedMarker.photos[0]}}
                  style={{
                    width: '100%',
                    height: 150,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                  resizeMode="cover"
                />
              )}
            </View>
          )}
        </View>
      </MapView>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({});
