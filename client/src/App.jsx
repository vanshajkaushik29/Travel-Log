import React, { useState, useEffect } from "react";
import "./App.css";
import { Map, Marker, Popup } from '@vis.gl/react-maplibre';
import "maplibre-gl/dist/maplibre-gl.css";

import { listLogEntries } from "./API";
import LogEntryForm from "./LogEntryForm";

export default function App() {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    // ( async () => {
    //   const logEntries = await listLogEntries();
    //   setLogEntries(logEntries);
    //   // console.log(logEntries);
    // })(); 
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    console.log(event);
    const { lng, lat} = event.lngLat;
    setAddEntryLocation({
      latitude: lat, 
      longitude: lng
    });
  };

  return (
    <Map
      initialViewState={{
        longitude: 77.2090,   // example: India (Delhi)
        latitude: 28.6139,
        zoom: 3
      }}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
      style={{ width: "100vw", height: "100vh" }}
      onDblClick={showAddMarkerPopup}
      >
      {
        logEntries.map(entry => (
        <React.Fragment key={entry._id}>
          
          <Marker
            latitude={entry.latitude}
            longitude={entry.longitude}
            offsetLeft={-20}
            offsetTop={-10}
            onClick={() => setShowPopup({
                  // ...showPopup,
                  [entry._id]: true,
                })}
          > 
            
          </Marker>
          {
            showPopup[entry._id] ? (
              <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setShowPopup({})}
                anchor="top"
              >
                <div className="popup">
                  <h3>{entry.title}</h3>
                  <p>{entry.comments}</p>
                  <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                  {entry.image && <img src={entry.image} alt={entry.title} />}
                </div>
              </Popup>
            ) : null
          }
        </React.Fragment>
        ))
      }
      {
        addEntryLocation ? (
          <>

           <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            // offsetLeft={-20}
            // offsetTop={-40} 
            anchor="bottom"
            >    
               <div>
              <svg
                className="marker red"
                width="30"
                height="30"
                style={{ fill: "#f05305" }}
                version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512">
                <g>
                  <g>
                    <path 
                      d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                      c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                      c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/>
                  </g>
                </g>
              </svg>
            </div>
           </Marker>

            <Popup
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setAddEntryLocation(null)}
                anchor="left"
              >
                <div className="popup">
                  <LogEntryForm onClose={() => {
                    setAddEntryLocation(null);
                    getEntries();
                  }} location={addEntryLocation} />
                </div>
              </Popup>
          </>
        ) : null
      }
    </Map>
  );
}