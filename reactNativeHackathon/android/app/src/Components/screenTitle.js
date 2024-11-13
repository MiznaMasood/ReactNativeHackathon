import React from 'react';
import { Text, StyleSheet } from 'react-native';

const ScreenTitle = ({ title }) => (
  <Text style={styles.title}>{title}</Text>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
  },
});

export default ScreenTitle;
