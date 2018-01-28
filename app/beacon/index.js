import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';

const {width, height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width/height
const LATITUDE_DELTA = 0.0042
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class BeaconPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      },
      markerPosition: {
        latitude: 0,
        longitude: 0
      },
      marker2Position: {
        latitude: 44.97285530892421,
        longitude: -93.2348245382309
      },
      distance: 0
    }

    this.calDis = function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}
  }

  watchID: ?number = null

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)

      var initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }

      this.setState({initialPosition: initialRegion})
      this.setState({markerPosition: initialRegion})

      var dist = this.calDis(lat, long, this.state.marker2Position.latitude, this.state.marker2Position.longitude, 'K')
      this.setState({distance: dist.toFixed(2)})
    },
    (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000})

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)

      console.log(lat)
      console.log(long)

      var lastRegion = {
        latitude: lat,
        longitude: long,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA
      }

      this.setState({initialPosition: lastRegion})
      this.setState({markerPosition: lastRegion})
    },
    (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000})
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          region={this.state.initialPosition}>
            <MapView.Marker
              coordinate={this.state.markerPosition}>
                <View style={styles.radius}>
                  <View style={styles.marker} />
                </View>

            </MapView.Marker>

            <MapView.Marker
              coordinate={this.state.marker2Position}>
                <View style={styles.radius}>
                  <View style={styles.marker2} />
                </View>
            </MapView.Marker>
          </MapView>
          <Text>{this.state.distance} KM AWAY</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  radius: {
    height: 50,
    width: 50,
    borderRadius: 50/2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  marker:{
    height: 20,
    width: 20,
    borderRadius: 3,
    borderColor: 'white',
    borderRadius: 20/2,
    overflow: 'hidden',
    backgroundColor: '#007AFF'
  },
  marker2:{
    height: 20,
    width: 20,
    borderRadius: 3,
    borderColor: 'white',
    borderRadius: 20/2,
    overflow: 'hidden',
    backgroundColor: '#FF0000'
  },
  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute'
  }
});

