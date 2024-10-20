import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {BottomModal} from 'react-native-modals';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Modal, {
  ModalContent,
  ModalTitle,
  SlideAnimation,
} from 'react-native-modals';
import Place from '../components/Place';

const TripPlanScreen = () => {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState(false);
  console.log('hey hey hey', route?.params);
  const [option, setOption] = useState('Overview');
  const formatDate = date => {
    return moment(date).format('D MMMM'); // Example: "6 June"
  };
  const navigation = useNavigation();
  const [expenses, setExpenses] = useState([]);

  const tripId = route?.params?.item?._id;
  const senderName = route?.params?.item?.name;
  const tripName = route?.params?.item?.tripName;
  const photo = route?.params?.item?.photo;

  const [placeDetails, setPlaceDetails] = useState([]);

  const [price, setPrice] = useState(0);

  const [itinerary, setItinerary] = useState([]);

  const [places, setPlaces] = useState([]);

  const [isPaidByExpanded, setPaidByExpanded] = useState(false);
  const [isSplitExpanded, setSplitExpanded] = useState(false);
  const [value, setValue] = useState('');
  const [paidBy, setPaidBy] = useState('');

  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  // Email validation regex
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = input => {
    setEmail(input);
    setIsValidEmail(validateEmail(input));
  };

  const handleSendInvite = async () => {
    if (isValidEmail) {
      try {
        // Call the API to send the invite
        const response = await axios.post(
          'http://localhost:8000/sendInviteEmail',
          {
            email, // Email entered by the user
            tripId, // ID of the current trip (you should have this from your state/context)
            tripName, // Name of the trip (you should have this from your state/context)
            senderName, // Name of the person sending the invite (you can get it from the user context)
          },
        );

        if (response.status === 200) {
          console.log('Invitation sent successfully');
          setOpenShareModal(false);
        } else {
          console.log('Failed to send invitation');
        }
      } catch (error) {
        console.error('Error sending invite email:', error);
        // alert('Error occurred while sending the invitation.');
      } finally {
        setEmail(''); // Clear the input after sending the invite
      }
    } else {
      alert('Please enter a valid email.');
    }
  };

  // Toggle handler functions
  const togglePaidBy = () => setPaidByExpanded(!isPaidByExpanded);
  const toggleSplit = () => setSplitExpanded(!isSplitExpanded);

  // Function to get day name using Moment.js
  const getDayName = date => {
    return moment(date).format('dddd'); // Example: "Monday"
  };

  const [input, setInput] = useState('');
  const inputRef = useRef(null); // Create a reference for the TextInput
  useEffect(() => {
    // Focus the TextInput when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [openingHours, setOpeningHours] = useState('');
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [number, setNumber] = useState('');
  const [reviews, setReviews] = useState('');
  const [photos, setPhotos] = useState('');

  const [selectedDate, setSelectedDate] = useState('');

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
      const description =
        details.editorial_summary?.overview ||
        details.reviews?.[0]?.text ||
        'No description available';

      const geometry = details?.geometry;

      setOpeningHours(openingHours);
      setNumber(phoneNumber);
      setWebsite(website);
      setReviews(reviews);
      setPhotos(photos);

      // Do something with the data
      // console.log('Opening Hours:', openingHours);
      // console.log('Phone Number:', phoneNumber);
      // console.log('Website:', website);
      // console.log('Reviews:', reviews);
      // console.log('Photos:', photos);
      // console.log('Descr', description);

      console.log('dfdf', geometry);

      try {
        const response = await axios.post(
          `http://localhost:8000/trip/${tripId}/addPlace`,
          {
            placeId: placeId,
          },
        );

        console.log('Updated Trip:', response.data); // Updated trip with the new place

        if (response.status == 200) {
          setModalVisible(false);
        }
        // Handle success (e.g., update the UI or show a success message)
      } catch (error) {
        console.error('Error adding place to trip:', error);
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const fetchPlacesToVisit = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/trip/${tripId}/placesToVisit`,
      );

      // Handle the response and display the places to visit
      const placesToVisit = response.data;
      console.log('Places to Visit:', placesToVisit);

      // You can now update the UI with this data

      setPlaces(placesToVisit);
    } catch (error) {
      console.error('Error fetching places to visit:', error);
      // Handle error (e.g., show an error message)
      return [];
    }
  };

  useEffect(() => {
    fetchPlacesToVisit();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlacesToVisit();
    }, [modalVisible]),
  );

  // console.log('places', places);

  const [recommendedPlaces, setRecommendedPlaces] = useState([]);

  useEffect(() => {
    // Function to fetch the recommended places
    const fetchRecommendedPlaces = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
          {
            params: {
              location: '12.2958,76.6394', // Latitude and Longitude of Mysore
              radius: 5000, // 5km radius
              type: 'tourist_attraction',
              key: 'AIzaSyCOZJadVuwlJvZjl_jWMjEvJDbbc17fQQI', // Your Google API Key
            },
          },
        );

        // Store the results in state
        setRecommendedPlaces(response.data.results.slice(0, 10)); // Get only 10 places
      } catch (error) {
        console.error('Error fetching recommended places:', error);
      }
    };

    fetchRecommendedPlaces(); // Fetch places on component mount
  }, []);

  const fetchDetails = async placeId => {
    const API_KEY = 'AIzaSyCOZJadVuwlJvZjl_jWMjEvJDbbc17fQQI'; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const details = response.data.result;

      console.log('Place Details:', details);

      return details;
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const fetchAllPlaceDetails = async () => {
    const detailsPromises = recommendedPlaces
      .slice(0, 10)
      .map(place => fetchDetails(place.place_id));
    const fetchedDetails = await Promise.all(detailsPromises);

    // Filter out any places that failed to fetch details
    const validDetails = fetchedDetails.filter(details => details !== null);

    setPlaceDetails(validDetails); // Store the fetched details in state
  };

  // Fetch details when the component mounts
  useEffect(() => {
    if (recommendedPlaces.length > 0) {
      fetchAllPlaceDetails();
    }
  }, [recommendedPlaces]);

  // console.log('os', placeDetails);

  useEffect(() => {
    fetchItinerary();
  }, [modalVisible]);

  const fetchItinerary = async () => {
    try {
      // Make the GET request to fetch the itinerary
      const response = await axios.get(
        `http://localhost:8000/trip/${tripId}/itinerary`,
      );

      // The itinerary array will be in response.data
      const itinerary = response.data;

      console.log('Itinerary fetched successfully:', itinerary);

      // Return the fetched itinerary or update the UI with the fetched data
      setItinerary(itinerary);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      // Optionally show an error message to the user
    }
  };

  const setOpenModal = item => {
    setSelectedDate(item?.date);

    // Set modal visibility
    setModalVisible(true);

    // You would then use this `formattedDate` to match with the backend data
  };

  const addPlaceToItinerary = async place => {
    // Prepare the new activity object
    console.log('place', place);
    const newActivity = {
      date: selectedDate, // Make sure this is the correct date format (e.g., '2024-10-15')
      name: place.name, // Required field: name of the place
      phoneNumber: place.phoneNumber,
      website: place.website,
      openingHours: place.openingHours,
      photos: place.photos,
      reviews: place.reviews,
      briefDescription: place.briefDescription,
      geometry: {
        location: {
          lat: place.geometry.location.lat, // Explicitly map lat
          lng: place.geometry.location.lng, // Explicitly map lng
        },
        viewport: {
          northeast: {
            lat: place.geometry.viewport.northeast.lat,
            lng: place.geometry.viewport.northeast.lng,
          },
          southwest: {
            lat: place.geometry.viewport.southwest.lat,
            lng: place.geometry.viewport.southwest.lng,
          },
        },
      },
    };

    try {
      // Make the POST request to add the activity
      const response = await axios.post(
        `http://localhost:8000/trips/${tripId}/itinerary/${selectedDate}`,
        newActivity, // Send the newActivity directly without wrapping it in an object
      );

      // Handle success, e.g., update the itinerary in the state
      console.log('Activity added successfully:', response.data);

      // Optionally close the modal or trigger some UI updates
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding place to itinerary:', error);
      // Optionally show an error message to the user
    }
  };

  console.log('ititi', itinerary);
  const [modalView, setModalView] = useState('original'); // State to manage modal content

  // Function to switch to the blank view
  const goToBlankView = () => setModalView('blank');

  // Function to return to the original view
  const goToOriginalView = () => setModalView('original');

  const [items, setItems] = useState([]);

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

  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  const selectCategory = item => {
    setCategory(item?.name);
    setImage(item?.image);
    setModalView('original');
  };

  console.log('hhfs', route?.params?.user?.email);

  const data = [
    {
      id: '0',
      name: 'Flights',
      image:
        'https://t3.ftcdn.net/jpg/02/58/40/90/240_F_258409001_w0gCLGQ5pFdJEyNB8KiiNrijHCGSdUpQ.jpg',
    },
    {
      id: '2',
      name: 'Lodges',
      image:
        'https://t3.ftcdn.net/jpg/02/21/73/46/240_F_221734695_OLItP2OWAkRqBLol8esvA4a9PuTV5pgK.jpg',
    },
    {
      id: '3',
      name: 'Car Rental',
      image:
        'https://t3.ftcdn.net/jpg/01/92/21/40/240_F_192214085_QnQ58x0ZKRLSUEgarcjVHNWrnmH8uWTA.jpg',
    },
    {
      id: '4',
      name: 'Food',
      image:
        'https://t3.ftcdn.net/jpg/00/81/02/86/240_F_81028652_e31aujidvR7NAtA8Cl4VxjDUJFUeAFte.jpg',
    },
    {
      id: '5',
      name: 'Activities',
      image:
        'https://t4.ftcdn.net/jpg/02/64/91/73/240_F_264917306_HnNaVViUQshIGnOGm1LA2FuE4YhTdu1l.jpg',
    },
    {
      id: '6',
      name: 'Shopping',
      image: 'https://cdn-icons-png.flaticon.com/128/2838/2838694.png',
    },
    {
      id: '9',
      name: 'Tour',
      image:
        'https://t3.ftcdn.net/jpg/08/37/58/92/240_F_837589252_QQfYmY2md3yunH4jRARAi6uNVf9yap53.jpg',
    },
    {
      id: '7',
      name: 'Petrol',
      image:
        'https://media.istockphoto.com/id/925225820/vector/gas-station-icon.jpg?b=1&s=612x612&w=is&k=20&c=w6pmbKjeR0z637e5fKhlDWGOJP6dgrafypC6tUI6LxM=',
    },
    {
      id: '8',
      name: 'Other',
      image:
        'https://t3.ftcdn.net/jpg/02/73/79/70/240_F_273797075_lqtsBJvUc9QsulXvIexCUHGLJWntTOL5.jpg',
    },
  ];

  const [budget, setBudget] = useState('');

  const handleSetBudget = () => {
    // Call the function to set the budget
    setTripBudget(Number(budget));
  };

  const setTripBudget = async budget => {
    console.log('budge', budget);
    try {
      const response = await axios.put(
        `http://localhost:8000/setBudget/${tripId}`,
        {
          budget, // Send the budget in the request body
        },
      );
      setModalOpen(false);
      console.log('Budget updated successfully:', response.data);
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  const addExpenseToTrip = async () => {
    try {
      const expenseData = {
        category: category,
        price: price,
        splitBy: value, // Array of users
        paidBy: paidBy, // User who paid
      };
      const response = await axios.post(
        `http://localhost:8000/addExpense/${tripId}`,
        expenseData,
      );

      if (response.status === 200) {
        console.log('Expense added successfully:', response.data);
        setModal(!modal);
        // Update the state or UI if necessary
      } else {
        console.error('Failed to add expense:', response.data.message);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [modal]);

  const fetchExpenses = async () => {
    try {
      // Make a GET request to fetch the expenses for the given trip
      const response = await axios.get(
        `http://localhost:8000/getExpenses/${tripId}`,
      );

      if (response.status === 200) {
        console.log('Expenses fetched successfully:', response.data.expenses);
        // You can return or set the expenses in your state or UI

        setExpenses(response.data.expenses);
      } else {
        console.error('Failed to fetch expenses:', response.data.message);
      }
    } catch (error) {
      console.error(
        'Error fetching expenses:',
        error.response ? error.response.data : error.message,
      );
    }
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View>
            <Image
              style={{width: '100%', height: 200, resizeMode: 'cover'}}
              source={{
                uri: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
              }}
            />
            <View>
              <View>
                <Pressable
                  style={{
                    padding: 20,
                    backgroundColor: 'white',
                    width: 300,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    borderRadius: 10,
                    position: 'absolute',
                    top: -100,
                    left: '50%',
                    transform: [{translateX: -150}],
                    shadowColor: '#000', // Shadow color
                    shadowOffset: {width: 0, height: 2}, // Shadow positioning
                    shadowOpacity: 0.25, // Opacity of the shadow
                    shadowRadius: 3.84, // Blur radius

                    // Shadow for Android
                    elevation: 5, // Elevation for Android
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      textAlign: 'left',
                      fontSize: 22,
                      fontWeight: 'bold',
                      //   paddingHorizontal: 20,
                      //   paddingVertical: 20,
                    }}>
                    Trip To {route?.params?.item?.tripName}
                  </Text>
                  <View style={{marginTop: 10}}>
                    <View>
                      <Text style={{fontWeight: '500'}}>
                        {route?.params?.item.startDate} -{' '}
                        {route?.params?.item.endDate}
                      </Text>
                      <Text style={{color: 'gray', marginTop: 4}}>
                        {route?.params?.item?.startDay} -{' '}
                        {route?.params?.item?.endDay}
                      </Text>
                    </View>

                    <View style={{marginTop: 10}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                        <Image
                          style={{width: 34, height: 34, borderRadius: 17}}
                          source={{
                            uri: route?.params?.user?.user?.photo,
                          }}
                        />

                        <Pressable
                          onPress={() => setOpenShareModal(!openShareModal)}
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            borderRadius: 25,
                            alignSelf: 'flex-start',
                            backgroundColor: 'black',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: 'white',
                              fontSize: 12,
                              fontWeight: '500',
                            }}>
                            Share
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>

            <View
              style={{backgroundColor: 'white', height: 80, zIndex: -100}}
            />

            <View
              style={{
                //   marginHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 25,
                justifyContent: 'space-around',
                backgroundColor: 'white',
                padding: 12,
              }}>
              <Pressable onPress={() => setOption('Overview')}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: option == 'Overview' ? '#ed6509' : 'gray',
                  }}>
                  Overview
                </Text>
              </Pressable>
              <Pressable onPress={() => setOption('Itinerary')}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: option == 'Itinerary' ? '#ed6509' : 'gray',
                  }}>
                  Itinerary
                </Text>
              </Pressable>
              <Pressable onPress={() => setOption('Explore')}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: option == 'Explore' ? '#ed6509' : 'gray',
                  }}>
                  Explore
                </Text>
              </Pressable>
              <Pressable onPress={() => setOption('$')}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: option == '$' ? '#ed6509' : 'gray',
                  }}>
                  $
                </Text>
              </Pressable>
            </View>

            <View style={{}}>
              {option == 'Overview' && (
                <ScrollView
                  contentContainerStyle={{marginBottom: 25}}
                  style={{
                    marginTop: 15,
                    borderRadius: 10,
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 12,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                          //   flex: 1,
                        }}>
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={25}
                          color="black"
                        />
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Notes
                        </Text>
                      </View>

                      <MaterialCommunityIcons
                        name="dots-horizontal"
                        size={25}
                        color="gray"
                      />
                    </View>

                    <View style={{marginTop: 10}}>
                      <Text
                        style={{
                          fontWeight: '500',
                          fontStyle: 'italic',
                          color: 'gray',
                        }}>
                        Write or paste general notes here, e.g. how to get
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 12,
                      marginVertical: 15,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                          //   flex: 1,
                        }}>
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={25}
                          color="black"
                        />
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Places to Visit
                        </Text>
                      </View>

                      <MaterialCommunityIcons
                        name="dots-horizontal"
                        size={25}
                        color="gray"
                      />
                    </View>

                    <View>
                      {places &&
                        places?.map((item, index) => (
                          <Place
                            index={index}
                            item={item}
                            items={items}
                            setItems={setItems}
                          />
                        ))}
                    </View>

                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <View></View>

                      <Pressable
                        onPress={() => setModalVisible(!modalVisible)}
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          backgroundColor: '#F0F0F0',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                          flex: 1,
                        }}>
                        <MaterialIcons
                          name="location-pin"
                          size={25}
                          color="gray"
                        />

                        <TextInput style={{}} placeholder="Add a place" />
                      </Pressable>

                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: '#F0F0F0',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <MaterialIcons
                          name="attach-file"
                          size={22}
                          color="black"
                        />
                      </View>

                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: '#F0F0F0',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <MaterialCommunityIcons
                          name="map-check-outline"
                          size={22}
                          color="black"
                        />
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        marginLeft: 10,
                        marginTop: 15,
                      }}>
                      Recommended Places
                    </Text>
                    <View style={{marginHorizontal: 10, marginVertical: 15}}>
                      {placeDetails && (
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}>
                          {placeDetails?.map((item, index) => {
                            // Check if the photos array exists and has at least one image
                            const firstPhoto = item?.photos?.[0];
                            const imageUrl = firstPhoto
                              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${firstPhoto.photo_reference}&key=AIzaSyCOZJadVuwlJvZjl_jWMjEvJDbbc17fQQI`
                              : null;

                            return (
                              <Pressable
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginRight: 12,
                                  borderWidth: 1,
                                  borderColor: '#E0E0E0', // Border color
                                  borderRadius: 8,
                                  padding: 10, // Padding inside the container
                                  marginBottom: 10, // Spacing between items
                                  height: 100, // Fixed height for equal containers
                                  overflow: 'hidden', // Prevent overflow from long text
                                }}
                                key={index}>
                                <View style={{marginRight: 10}}>
                                  {/* Add margin to separate image from text */}
                                  {/* Only show the first image if it exists */}
                                  {imageUrl ? (
                                    <Image
                                      source={{uri: imageUrl}}
                                      style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 6,
                                      }}
                                      resizeMode="cover"
                                    />
                                  ) : (
                                    <Text>No Image Available</Text>
                                  )}
                                </View>
                                <Text
                                  style={{
                                    flex: 1, // Allow text to take the remaining space
                                    fontSize: 16, // Text size
                                    fontWeight: '500', // Text weight
                                    color: '#333', // Text color
                                    width: 150,
                                  }}
                                  numberOfLines={2} // Restrict text to two lines
                                  ellipsizeMode="tail" // Add ellipsis at the end if the text is too long
                                >
                                  {item?.name}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </ScrollView>
                      )}
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 12,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                          //   flex: 1,
                        }}>
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={25}
                          color="black"
                        />
                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                          Add a Title
                        </Text>
                      </View>

                      <MaterialCommunityIcons
                        name="dots-horizontal"
                        size={25}
                        color="gray"
                      />
                    </View>

                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <View
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          backgroundColor: '#F0F0F0',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                          flex: 1,
                        }}>
                        <MaterialIcons
                          name="location-pin"
                          size={25}
                          color="gray"
                        />

                        <TextInput style={{}} placeholder="Add a place" />
                      </View>

                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: '#F0F0F0',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <MaterialIcons
                          name="attach-file"
                          size={22}
                          color="black"
                        />
                      </View>

                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: '#F0F0F0',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <MaterialCommunityIcons
                          name="map-check-outline"
                          size={22}
                          color="black"
                        />
                      </View>
                    </View>
                  </View>
                </ScrollView>
              )}
            </View>

            <View style={{}}>
              {option == 'Itinerary' && (
                <ScrollView
                  style={{
                    marginTop: 15,
                    borderRadius: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    {route?.params?.item?.itinerary?.map((item, index) => (
                      <View
                        style={{
                          padding: 10,
                          borderRadius: 8,
                          marginBottom: 7,
                          backgroundColor: 'orange',
                          marginLeft: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '500',
                            textAlign: 'center',
                            color: 'white',
                          }}>
                          {formatDate(item.date)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={{}}>
                    {route?.params?.item?.itinerary?.map((item, index) => (
                      <View
                        style={{
                          padding: 10,
                          borderRadius: 8,
                          marginBottom: 7,
                          backgroundColor: 'white',
                          marginVertical: 10,
                          padding: 15,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                          }}>
                          <Text style={{fontSize: 27, fontWeight: 'bold'}}>
                            {formatDate(item.date)}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: 'gray',
                              fontWeight: '500',
                            }}>
                            Add subheading
                          </Text>
                        </View>

                        <View>
                          {itinerary
                            ?.filter(place => place.date === item?.date) // Filter by the selected date
                            .map((filteredItem, filteredIndex) =>
                              filteredItem.activities.map(
                                (
                                  activity,
                                  activityIndex, // Map over activities array
                                ) => (
                                  <Pressable
                                    key={activityIndex}
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
                                              {activityIndex + 1}
                                              {/* Show the activity number */}
                                            </Text>
                                          </View>

                                          <Text
                                            style={{
                                              fontSize: 16,
                                              fontWeight: '500',
                                            }}>
                                            {activity?.name}{' '}
                                            {/* Show the activity name */}
                                          </Text>
                                        </View>
                                        <Text
                                          style={{
                                            color: 'gray',
                                            marginTop: 7,
                                            width: '80%',
                                          }}>
                                          {activity?.briefDescription}{' '}
                                          {/* Show the activity description */}
                                        </Text>
                                      </View>

                                      <View>
                                        {/* Only show the first image from the photos array */}
                                        {activity.photos &&
                                          activity.photos[0] && ( // Check if photos array exists and has an image
                                            <Image
                                              source={{uri: activity.photos[0]}} // Access the first image URL
                                              style={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: 10,
                                              }} // Adjust size and styling as needed
                                              resizeMode="cover" // Optional: Control how the image is resized
                                            />
                                          )}
                                      </View>
                                    </View>
                                  </Pressable>
                                ),
                              ),
                            )}
                        </View>

                        <View
                          style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                          }}>
                          <Pressable
                            onPress={() => setOpenModal(item)}
                            style={{
                              padding: 10,
                              borderRadius: 10,
                              backgroundColor: '#F0F0F0',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 5,
                              flex: 1,
                            }}>
                            <MaterialIcons
                              name="location-pin"
                              size={25}
                              color="gray"
                            />

                            <TextInput style={{}} placeholder="Add a place" />
                          </Pressable>

                          <View
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 22,
                              backgroundColor: '#F0F0F0',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <MaterialIcons
                              name="attach-file"
                              size={22}
                              color="black"
                            />
                          </View>

                          <View
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 22,
                              backgroundColor: '#F0F0F0',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <MaterialCommunityIcons
                              name="map-check-outline"
                              size={22}
                              color="black"
                            />
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>

            <View>
              {option == 'Explore' && (
                <ScrollView
                  style={{
                    marginTop: 15,
                    borderRadius: 10,
                    marginHorizontal: 12,
                  }}>
                  <View
                    style={{
                      padding: 10,
                      backgroundColor: '#E0E0E0',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                    }}>
                    <MaterialIcons name="search" size={22} color="gray" />

                    <Text>{route?.params?.item?.tripName}</Text>
                  </View>

                  <View style={{marginTop: 12}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                        Categories
                      </Text>
                      <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                        See all
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        marginTop: 15,
                      }}>
                      <View
                        style={{
                          backgroundColor: '#E8E8E8',
                          padding: 12,
                          borderRadius: 7,
                          flex: 1,
                        }}>
                        <Text style={{fontSize: 15}}>🍽️ Restaurants</Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: '#E8E8E8',
                          padding: 12,
                          borderRadius: 7,
                          flex: 1,
                        }}>
                        <Text style={{fontSize: 15}}>☕️ Cafes</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        marginTop: 15,
                      }}>
                      <View
                        style={{
                          backgroundColor: '#E8E8E8',
                          padding: 12,
                          borderRadius: 7,
                          flex: 1,
                        }}>
                        <Text style={{fontSize: 15}}>🤑 Cheap Rates</Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: '#E8E8E8',
                          padding: 12,
                          borderRadius: 7,
                          flex: 1,
                        }}>
                        <Text style={{fontSize: 15}}>💌 Travel</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: 1,
                        borderColor: '#E0E0E0',
                        borderWidth: 0.6,
                        marginVertical: 15,
                      }}
                    />
                  </View>

                  <View>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      Video Guides
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                      <View style={{flex: 1}}>
                        <Image
                          style={{width: 160, height: 110, resizeMode: 'cover'}}
                          source={{
                            uri: 'https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Youtube2_colored_svg-512.png',
                          }}
                        />
                      </View>

                      <View style={{flex: 1}}>
                        <Image
                          style={{width: 160, height: 110, resizeMode: 'cover'}}
                          source={{
                            uri: 'https://cdn3.iconfinder.com/data/icons/apps-4/512/Tiktok-512.png',
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </ScrollView>
              )}
            </View>

            <View>
              {option == '$' && (
                <ScrollView style={{}}>
                  <View>
                    <View style={{padding: 10, backgroundColor: '#13274F'}}>
                      <Text
                        style={{
                          fontSize: 24,
                          color: 'white',
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        {/* ₹0.00  */}₹
                        {budget ? budget : route?.params?.item?.budget}
                      </Text>

                      <Pressable onPress={() => setModalOpen(!modalOpen)}>
                        <Text
                          style={{
                            marginVertical: 13,
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 15,
                          }}>
                          Set a budget
                        </Text>
                      </Pressable>

                      <View
                        style={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          padding: 10,
                          borderRadius: 25,
                          borderColor: 'white',
                          borderWidth: 1,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 13,
                          }}>
                          Debt Summary
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View>
                    <View
                      style={{
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                        Expenses
                      </Text>

                      <MaterialIcons
                        name="person-search"
                        size={25}
                        color="black"
                      />
                    </View>

                    {expenses?.length > 0 ? (
                      <View style={{marginHorizontal: 12}}>
                        {expenses?.map((item, index) => (
                          <Pressable style={{marginTop: 10}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
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
                                  style={{color: 'white', fontWeight: '500'}}>
                                  {index + 1}
                                </Text>
                              </View>

                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: '500',
                                  flex: 1,
                                }}>
                                {item?.category}
                              </Text>

                              <Text style={{fontSize: 15, color: '#606060'}}>
                                ₹{item?.price} ({item?.splitBy})
                              </Text>
                            </View>
                            <Text style={{marginTop: 5, color: 'gray'}}>
                              Paid By - {item?.paidBy}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    ) : (
                      <Text style={{marginHorizontal: 12, color: 'gray'}}>
                        You haven't added any expenses yet!
                      </Text>
                    )}

                    <Pressable
                      onPress={() => setModal(!modal)}
                      style={{
                        padding: 12,
                        backgroundColor: '#FF5733',
                        borderRadius: 25,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 30,
                      }}>
                      <Text style={{textAlign: 'center', color: 'white'}}>
                        Add Expense
                      </Text>
                    </Pressable>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>

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
                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                  Add a Place
                </Text>
                <View style={{width: '100%'}}>
                  {/* <Text style={{marginTop: 7}}>Near by Everywhere</Text> */}

                  <GooglePlacesAutocomplete
                    styles={{
                      container: {
                        flex: 0,
                        marginTop: 10,
                        width: '90%',
                        borderRadius: 20,
                        borderColor: '#D0D0D0',
                        borderWidth: 1,
                        marginTop: 20,
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

                <View>
                  <Text
                    style={{textAlign: 'center', color: 'gray', marginTop: 12}}>
                    Places In your list
                  </Text>
                  {places &&
                    places?.map((item, index) => (
                      <Pressable
                        onPress={() => addPlaceToItinerary(item)}
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
                                  backgroundColor: 'blue',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{color: 'white', fontWeight: '500'}}>
                                  {index + 1}
                                </Text>
                              </View>

                              <Text style={{fontSize: 16, fontWeight: '500'}}>
                                {item?.name}
                              </Text>
                            </View>
                            <Text
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
                      </Pressable>
                    ))}
                </View>
              </View>
            </ModalContent>
          </BottomModal>

          <BottomModal
            onBackdropPress={() => setModal(!modal)}
            swipeDirection={['up', 'down']}
            swipeThreshold={200}
            modalAnimation={
              new SlideAnimation({
                slideFrom: 'bottom',
              })
            }
            onHardwareBackPress={() => setModal(!modal)}
            visible={modal}
            onTouchOutside={() => setModal(!modal)}>
            <ModalContent
              style={{width: '100%', height: 600, backgroundColor: '#F8F8F8'}}>
              {modalView === 'original' ? (
                <View>
                  {/* Original Modal Content */}
                  <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                    Add a Expense
                  </Text>

                  <View
                    style={{
                      marginVertical: 15,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: 16, fontWeight: '500'}}>Rs</Text>
                    <TextInput
                      vale={price}
                      onChangeText={setPrice}
                      style={{color: 'gray', fontSize: 16}}
                      placeholderTextColor="gray"
                      placeholder="0.00"
                    />
                  </View>

                  <Pressable
                    onPress={goToBlankView}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: 16, fontWeight: '500'}}>
                      Event ({category})
                    </Text>
                    <Text style={{color: 'gray', fontSize: 16}}>
                      Select Item
                    </Text>
                  </Pressable>

                  <View
                    style={{
                      height: 2,
                      borderColor: '#E0E0E0',
                      borderWidth: 3,
                      marginVertical: 20,
                      borderRadius: 4,
                    }}
                  />

                  <Pressable
                    onPress={togglePaidBy}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: 15, fontWeight: '500'}}>
                      Paid By: You ({route?.params?.user?.user?.name})
                    </Text>
                    <MaterialIcons
                      name={
                        isSplitExpanded
                          ? 'keyboard-arrow-down'
                          : 'keyboard-arrow-right'
                      }
                      size={25}
                      color="black"
                    />
                  </Pressable>

                  {isPaidByExpanded && (
                    <View style={{marginTop: 10}}>
                      {route?.params?.item?.travelers?.map((item, index) => (
                        <Pressable
                          onPress={() => setPaidBy(item?.name)}
                          key={index}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                          }}>
                          <Image
                            style={{width: 40, height: 40, borderRadius: 20}}
                            source={{
                              uri: item?.photo,
                            }}
                          />
                          <Text style={{fontSize: 16, fontWeight: '400'}}>
                            Paid By {item?.name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}

                  <Pressable
                    onPress={toggleSplit}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 15,
                    }}>
                    <Text style={{fontSize: 15, fontWeight: '500'}}>
                      Split: Don't split
                    </Text>
                    <MaterialIcons
                      name={
                        isSplitExpanded
                          ? 'keyboard-arrow-down'
                          : 'keyboard-arrow-right'
                      }
                      size={25}
                      color="black"
                    />
                  </Pressable>

                  {isSplitExpanded && (
                    <View
                      style={{marginTop: 10, flexDirection: 'column', gap: 10}}>
                      <Pressable onPress={() => setValue('Indiviudals')}>
                        <Text style={{fontSize: 15, color: 'gray'}}>
                          Indiviudals
                        </Text>
                      </Pressable>

                      <Pressable onPress={() => setValue('Everyone')}>
                        <Text style={{fontSize: 15, color: 'gray'}}>
                          Everyone
                        </Text>
                      </Pressable>

                      <Pressable onPress={() => setValue("Don't Split")}>
                        <Text style={{fontSize: 15, color: 'gray'}}>
                          Don't Split
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginVertical: 14,
                    }}>
                    <Text style={{fontSize: 15, fontWeight: '500'}}>
                      Date: Optional
                    </Text>
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={25}
                      color="black"
                    />
                  </View>

                  <Pressable onPress={addExpenseToTrip}>
                    <Text>Save expense</Text>
                  </Pressable>
                </View>
              ) : (
                // Blank View when pressing "Select Item"
                <View>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                      marginTop: 10,
                    }}>
                    Expense Category
                  </Text>
                  <Pressable
                    onPress={goToOriginalView}
                    style={{
                      marginTop: 20,
                      alignSelf: 'center',
                      padding: 10,
                      backgroundColor: 'blue',
                      borderRadius: 5,
                    }}>
                    <Text style={{color: 'white'}}>Go Back</Text>
                  </Pressable>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 60,
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      marginTop: 15,
                    }}>
                    {data?.map((item, index) => (
                      <Pressable
                        onPress={() => selectCategory(item)}
                        key={index}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 30,

                              resizeMode: 'center',
                            }}
                            source={{uri: item?.image}}
                          />
                          <Text
                            style={{
                              textAlign: 'center',
                              marginTop: 10,
                              fontSize: 13,
                            }}>
                            {item?.name}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </ModalContent>
          </BottomModal>
        </ScrollView>
      </SafeAreaView>

      <Modal
        onBackdropPress={() => setModalOpen(!modalOpen)}
        onHardwareBackPress={() => setModalOpen(!modalOpen)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalTitle={<ModalTitle title="Budget Info" />}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        visible={modalOpen}
        onTouchOutside={() => setModalOpen(!modalOpen)}>
        <ModalContent style={{width: 350, height: 'auto'}}>
          <View style={{}}>
            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15, fontWeight: '500'}}>
                Enter budget
              </Text>

              <Feather name="edit-2" size={20} color="black" />
            </View>

            <View
              style={{
                marginTop: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextInput
                style={{
                  width: '95%',
                  marginTop: 10,

                  paddingBottom: 10,
                  fontFamily: 'GeezaPro-Bold',
                  borderColor: '#E0E0E0',
                  borderWidth: 1,
                  padding: 10,

                  borderRadius: 20,
                }}
                value={budget}
                onChangeText={setBudget}
                placeholder={'Enter the budget'}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                alignItems: 'center',
                gap: 20,
                justifyContent: 'center',
              }}>
              <Pressable
                onPress={() => setModalOpen(false)}
                style={{
                  padding: 10,
                  borderRadius: 25,
                  borderColor: '#E0E0E0',
                  borderWidth: 1,
                  width: 100,
                }}>
                <Text style={{textAlign: 'center'}}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => setTripBudget(budget)}
                style={{
                  padding: 10,
                  borderRadius: 25,
                  backgroundColor: '#720e9e',
                  width: 100,
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>Save</Text>
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </Modal>

      <BottomModal
        onBackdropPress={() => setOpenShareModal(!openShareModal)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        onHardwareBackPress={() => setOpenShareModal(!openShareModal)}
        visible={openShareModal}
        onTouchOutside={() => setOpenShareModal(!openShareModal)}>
        <ModalContent
          style={{width: '100%', height: 300, backgroundColor: '#F8F8F8'}}>
          <View>
            <Text
              style={{fontSize: 15, fontWeight: '500', textAlign: 'center'}}>
              Invite Tripmates
            </Text>
            <View
              style={{
                marginVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                padding: 12,
                backgroundColor: '#E0E0E0',
                gap: 8,
                borderRadius: 7,
              }}>
              <Ionicons name="person-add-sharp" size={20} color="gray" />
              <TextInput
                value={email}
                onChangeText={handleEmailChange}
                placeholderTextColor={'gray'}
                placeholder="Invite by Email address"
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 12,
              }}>
              <View>
                <Pressable
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#E0E0E0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <AntDesign name="link" size={23} color="gray" />
                </Pressable>
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: 'center',
                    color: 'gray',
                    marginTop: 8,
                  }}>
                  Link
                </Text>
              </View>

              <View>
                <Pressable
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#E0E0E0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <AntDesign name="message1" size={23} color="gray" />
                </Pressable>
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: 'center',
                    color: 'gray',
                    marginTop: 10,
                  }}>
                  Text
                </Text>
              </View>

              <View>
                <Pressable
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#E0E0E0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <AntDesign name="sharealt" size={23} color="gray" />
                </Pressable>
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: 'center',
                    color: 'gray',
                    marginTop: 10,
                  }}>
                  Other
                </Text>
              </View>
            </View>

            {isValidEmail && (
              <Pressable
                style={{
                  backgroundColor: '#E97451',
                  marginTop: 16,
                  padding: 10,
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handleSendInvite}>
                <Text style={{color: 'white', fontSize: 16, fontWeight: '500'}}>
                  Send 1 invite
                </Text>
              </Pressable>
            )}
          </View>
        </ModalContent>
      </BottomModal>

      <Pressable
        onPress={() =>
          navigation.navigate('Ai', {
            name: route?.params?.item?.tripName,
          })
        }
        style={{
          width: 60,
          height: 60,
          borderRadius: 40,
          justifyContent: 'center',
          backgroundColor: '#662d91',
          marginLeft: 'auto',
          position: 'absolute',
          bottom: 110,
          right: 25,
          alignContent: 'center',
        }}>
        <FontAwesome6
          style={{textAlign: 'center'}}
          name="wand-magic-sparkles"
          size={24}
          color="white"
        />
      </Pressable>

      <Pressable
        onPress={() =>
          navigation.navigate('Map', {
            places: places,
          })
        }
        style={{
          width: 60,
          height: 60,
          borderRadius: 40,
          justifyContent: 'center',
          backgroundColor: 'black',
          marginLeft: 'auto',
          position: 'absolute',
          bottom: 35,
          right: 25,
          alignContent: 'center',
        }}>
        <Feather
          style={{textAlign: 'center'}}
          name="map"
          size={24}
          color="white"
        />
      </Pressable>
    </>
  );
};

export default TripPlanScreen;

const styles = StyleSheet.create({});
