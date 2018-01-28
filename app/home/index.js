import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Human from '../components/human';
import SOSButton from '../components/SOSButton';
import Internal_External_Selection from '../components/internal_external_selection';
import BeaconPage from '../beacon';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this._handleSOSPress = this._handleSOSPress.bind(this);
  }
  _handleSOSPress() {
    console.log("SOS PRess")
    const nextRoute = {
      component: BeaconPage,
      title: 'Beacon Page',
      passProps: { myProp: 'bar' }
    };
    this.props.navigator.push(nextRoute);
  }
  render() {
    return (
      <View style={styles.container}>
        <Human style={{flex: 2}}/>
        <Internal_External_Selection style={{flex: 1}}/>
        <SOSButton onTapped={this._handleSOSPress} style={{flex: 1}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosText: {
    color: '#fff',
  }
});
