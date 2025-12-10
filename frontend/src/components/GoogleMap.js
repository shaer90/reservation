import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './GoogleMap.css';

const MapComponent = ({ locations, center, zoom = 12 }) => {
  const [selected, setSelected] = React.useState(null);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '10px'
  };

  const defaultCenter = center || {
    lat: 40.730610,
    lng: -73.935242
  };

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={zoom}
        >
          {locations && locations.map((location, index) => (
            <Marker
              key={index}
              position={{
                lat: location.coordinates[1],
                lng: location.coordinates[0]
              }}
              onClick={() => setSelected(location)}
            />
          ))}

          {selected && (
            <InfoWindow
              position={{
                lat: selected.coordinates[1],
                lng: selected.coordinates[0]
              }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="info-window">
                <h3>{selected.name}</h3>
                {selected.address && <p>{selected.address}</p>}
                {selected.price && <p className="price">${selected.price}/night</p>}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
