import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const TestComponent = forwardRef((ref, props) => {
  useImperativeHandle(ref, { testFunc });

  const testFunc = () => {
    alert('TEST');
  };

  return <View />;
});

export default TestComponent;

/////

const TestComponentUsage = props => {
  const testRef = useRef();

  return (
    <View>
      <TestComponent ref={testRef} />

      <TouchableOpacity
        onPress={() => {
          testRef.current.testFunc();
        }}>
        <Text>Ben Buton</Text>
      </TouchableOpacity>
    </View>
  );
};
