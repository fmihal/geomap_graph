import React, {useState, useEffect, useContext} from "react";
import ReactMapGL, {NavigationControl, Marker} from 'react-map-gl';
import { withStyles } from "@material-ui/core/styles";
 import 'mapbox-gl/src/css/mapbox-gl.css';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import {useClient} from '../client';
import { GET_PINS_QUERY } from '../graphql/queries'
import PinIcon from './PinIcon';
import Blog from './Blog';
import Context from '../context'

const INITIAL_STATE = {
      latitude: 44.7866,
      longitude: 20.4489,
      zoom: 13
}

const Map = ({ classes }) => {
  const client = useClient();
  const {state, dispatch} = useContext(Context);
  
  useEffect(() => {
    getPins()
  }, [])
  
  const [viewport, setViewport] = useState(INITIAL_STATE);
  const [userPosition, setUserPosition] = useState(null);
  
  useEffect(() => {
    getUserPosition()
  }, [])


  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const {latitude, longitude} = position.coords;
        setViewport({...viewport, latitude, longitude});
        setUserPosition({latitude, longitude});
      })
    }
  }

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: "GET_PINS", payload: getPins})
    console.log('got pins ',{getPins})
  }
  

  const handleMapClick = ({lngLat,leftButton}) => {
    if (!leftButton) return; 
    if (!state.draft) {
      dispatch({type: "CREATE_DRAFT"})
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: {longitude, latitude}
    })
  }
  


  return ( 
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        heght="calc(100vh-64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoibWloYWxpYzE5ODkiLCJhIjoiY2p5ZGFsZ2FqMHFpZjNjcDh3MG5mM3VvNSJ9.adKavd7f5Hm9PW5q9jvNZQ"
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        <div className={classes.navigationControl}>
        <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
            {...viewport}
        />
      </div>
      {userPosition && (
        <Marker
          latitude={userPosition.latitude}
          longitude={userPosition.longitude}
          offsetLeft={-19}
          offsetTop={-37}
        >
          <PinIcon size={40} color="red"/>
        </Marker>
      )}

      {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}
        {state.pins.map(pin => (
          <Marker
            key = {pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="dark" />
          </Marker>
        ))}
      )}
      </ReactMapGL>
      <Blog/>
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 75,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
