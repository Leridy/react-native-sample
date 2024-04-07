/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import WelcomePage from './src/Pages/WelcomePage.tsx';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider
      initialMetrics={{
        insets: {top: 0, left: 0, right: 0, bottom: 0},
        frame: {x: 0, y: 0, width: 0, height: 0},
      }}>
      <PaperProvider>
        <WelcomePage />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
