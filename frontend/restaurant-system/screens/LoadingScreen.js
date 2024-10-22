import { ActivityIndicator, StyleSheet, View } from 'react-native'
import React from 'react'

const LoadingScreen = () => {
  return (
    <View>
      <ActivityIndicator size="large" color="blue"/>
    </View>
  )
}

export default LoadingScreen

const styles = StyleSheet.create({})