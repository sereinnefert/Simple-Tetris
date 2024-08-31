import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TetrisGame from './tetris';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TetrisGame />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;