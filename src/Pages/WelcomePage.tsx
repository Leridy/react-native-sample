import React, {FunctionComponent, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FunctionBox, {functionType} from '../components/FunctionBox.tsx';

interface OwnProps {}

type Props = OwnProps;

const BOTTOM_APPBAR_HEIGHT = 80;
const MEDIUM_FAB_HEIGHT = 56;

const {Header, Action, Content} = Appbar;

const WelcomePage: FunctionComponent<Props> = props => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();

  const [currentTab, setCurrentTab] = useState<functionType>('system');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleTabChange = (tab: functionType) => {
    setCurrentTab(tab);
  };

  return (
    <>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <Header style={[styles.header]}>
          <Content
            titleStyle={styles.headerTitle}
            title="DEMO FOR REACT NATIVE"
          />
        </Header>
        <FunctionBox currentTab={currentTab} />
      </SafeAreaView>

      <Appbar
        style={[
          styles.bottom,
          {
            height: BOTTOM_APPBAR_HEIGHT + bottom,
            backgroundColor: theme.colors.elevation.level2,
          },
        ]}>
        <Action
          icon="information"
          onPress={() => {
            handleTabChange('system');
          }}
        />
        <Action
          icon="bell"
          onPress={() => {
            handleTabChange('notification');
          }}
        />
        <Action
          icon="camera"
          onPress={() => {
            handleTabChange('camera');
          }}
        />
        <Action
          icon="bluetooth"
          onPress={() => {
            handleTabChange('bluetooth');
          }}
        />
        <Action
          icon="map-marker"
          onPress={() => {
            handleTabChange('geo-location');
          }}
        />
        <Action
          icon="file"
          onPress={() => {
            handleTabChange('file');
          }}
        />
      </Appbar>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'blue',
    borderBottomWidth: 1,
  },

  headerTitle: {
    color: 'white',
  },

  bottom: {
    backgroundColor: 'aquamarine',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    right: 16,
  },
});

export default WelcomePage;
