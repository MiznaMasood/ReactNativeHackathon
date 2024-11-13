import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, ScrollView } from 'react-native';

const Home = () => {


  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>FOODIE</Text>
        <Text style={styles.subtitle}>Deliver Favourite Food</Text>
      </View>

      {/* Categories Section (Image Example) */}
      <View style={styles.categories}>
        <TouchableOpacity style={styles.category}>
          <Image style={styles.categoryImage} source={require('../../Assets/burger.jpeg')} />
          <Text style={styles.categoryText}>Burgers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Image style={styles.categoryImage} source={require('../../Assets/desserts.jpeg')} />
          <Text style={styles.categoryText}>Dessert</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Image style={styles.categoryImage} source={require('../../Assets/mexican.jpeg')} />
          <Text style={styles.categoryText}>Mexican</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Image style={styles.categoryImage} source={require('../../Assets/sushifood.jpeg')} />
          <Text style={styles.categoryText}>Sushi</Text>
        </TouchableOpacity>
      </View>

  {/* Horizontal Scroll for Offer Section */}
  <ScrollView horizontal={true} style={styles.offerScrollContainer}>
        <ImageBackground
          source={require('../../Assets/food.jpeg')} // Correct path for background image
          style={styles.offerSection}
        >
          <Text style={styles.offerText}>30% OFF</Text>
          <Text style={styles.offerSubtitle}>Exclusive discounts on orders!</Text>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Order Now</Text>
          </TouchableOpacity>
        </ImageBackground>

        <ImageBackground
          source={require('../../Assets/food.jpeg')} // Correct path for background image
          style={styles.offerSection}
        >
          <Text style={styles.offerText}>30% OFF</Text>
          <Text style={styles.offerSubtitle}>Exclusive discounts on orders!</Text>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Order Now</Text>
          </TouchableOpacity>
        </ImageBackground>

        <ImageBackground
          source={require('../../Assets/food.jpeg')} // Correct path for background image
          style={styles.offerSection}
        >
          <Text style={styles.offerText}>30% OFF</Text>
          <Text style={styles.offerSubtitle}>Exclusive discounts on orders!</Text>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Order Now</Text>
          </TouchableOpacity>
        </ImageBackground>
      </ScrollView>

  
      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1225',
    padding: 20,
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  category: {
    alignItems: 'center',
    width: '22%',
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
  },
  offerSection: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
    width:300,
    margin:20,
    height: 200, // Set height for the offer section
    justifyContent: 'center', // Center content vertically
    borderRadius: 70, // Optional: rounded corners
  },
  offerText: {
    fontSize: 32,
    color: '#f06c64',
    fontWeight: 'bold',
  },
  offerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 10,
  },
  orderButton: {
    backgroundColor: '#f06c64',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  footerButton: {
    backgroundColor: '#f06c64',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;

