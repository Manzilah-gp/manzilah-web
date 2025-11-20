// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Alert } from 'antd';
// import { EnvironmentOutlined } from '@ant-design/icons';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//     iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// // Custom marker icon
// const createCustomIcon = (color = '#ff4d4f') => {
//     return new L.Icon({
//         iconUrl: `data:image/svg+xml;base64,${btoa(`
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="24px" height="24px">
//         <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
//       </svg>
//     `)}`,
//         iconSize: [24, 24],
//         iconAnchor: [12, 24],
//         popupAnchor: [0, -24],
//         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//         shadowSize: [41, 41],
//         shadowAnchor: [12, 41],
//     });
// };

// // Map click handler component
// function LocationMarker({ selectedLocation, onLocationSelect }) {
//     useMapEvents({
//         click(e) {
//             onLocationSelect(e.latlng);
//         },
//     });

//     return selectedLocation ? (
//         <Marker
//             position={selectedLocation}
//             icon={createCustomIcon('#ff4d4f')}
//         />
//     ) : null;
// }

// const MapComponent = ({ visible, onCancel, onLocationSelect, initialLocation }) => {
//     const [selectedLocation, setSelectedLocation] = useState(null);

//     // Palestine bounds and center
//     const palestineCenter = [31.5, 34.5];
//     const palestineBounds = [
//         [31.0, 34.0], // Southwest
//         [32.5, 35.5]  // Northeast
//     ];

//     // Initialize selected location from props
//     useEffect(() => {
//         if (initialLocation && initialLocation.latitude && initialLocation.longitude) {
//             setSelectedLocation([initialLocation.latitude, initialLocation.longitude]);
//         } else {
//             setSelectedLocation(null);
//         }
//     }, [initialLocation, visible]);

//     const handleMapClick = (latlng) => {
//         setSelectedLocation([latlng.lat, latlng.lng]);
//     };

//     const handleConfirmLocation = async () => {
//         if (selectedLocation) {
//             try {
//                 const [lat, lng] = selectedLocation;
//                 const response = await fetch(
//                     `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&countrycodes=ps&accept-language=en`
//                 );
//                 const data = await response.json();

//                 if (data.address) {
//                     const address = data.address;
//                     const locationData = {
//                         latitude: lat,
//                         longitude: lng,
//                         address_line1: address.road || address.house_number ?
//                             `${address.house_number || ''} ${address.road || ''}`.trim() : '',
//                         city: address.city || address.town || address.village || address.hamlet || '',
//                         region: address.state || address.county || '',
//                         governorate: mapToGovernorate(address.state || address.county || ''),
//                         postal_code: address.postcode || '',
//                         country: 'Palestine',
//                         formatted_address: data.display_name
//                     };

//                     onLocationSelect(locationData);
//                 } else {
//                     // Fallback with coordinates only
//                     onLocationSelect({
//                         latitude: lat,
//                         longitude: lng,
//                         city: 'Ramallah',
//                         region: 'Ramallah and al-Bireh',
//                         governorate: 'ramallah',
//                         country: 'Palestine',
//                         formatted_address: `Palestine (${lat.toFixed(6)}, ${lng.toFixed(6)})`
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error reverse geocoding:', error);
//                 // Fallback: just return coordinates
//                 onLocationSelect({
//                     latitude: selectedLocation[0],
//                     longitude: selectedLocation[1],
//                     country: 'Palestine',
//                     formatted_address: `Palestine (${selectedLocation[0].toFixed(6)}, ${selectedLocation[1].toFixed(6)})`
//                 });
//             }
//         }
//     };

//     const mapToGovernorate = (region) => {
//         const governorateMap = {
//             'gaza': 'gaza',
//             'غزة': 'gaza',
//             'ramallah': 'ramallah',
//             'رام الله': 'ramallah',
//             'رام الله والبيرة': 'ramallah',
//             'hebron': 'hebron',
//             'الخليل': 'hebron',
//             'nabulus': 'nabulus',
//             'نابلس': 'nabulus',
//             'jerusalem': 'jerusalem',
//             'القدس': 'jerusalem',
//             'bethlehem': 'bethlehem',
//             'بيت لحم': 'bethlehem',
//             'jenin': 'jenin',
//             'جنين': 'jenin',
//             'tulkarm': 'tulkarm',
//             'طولكرم': 'tulkarm',
//             'qalqilya': 'qalqilya',
//             'قلقيلية': 'qalqilya',
//             'salfit': 'salfit',
//             'سلفيت': 'salfit',
//             'jericho': 'jericho',
//             'أريحا': 'jericho',
//             'tubas': 'tubas',
//             'طوباس': 'tubas'
//         };

//         const normalizedRegion = region.toLowerCase().trim();
//         return governorateMap[normalizedRegion] || governorateMap[region] || 'ramallah';
//     };

//     return (
//         <Modal
//             title="Select Your Location in Palestine"
//             open={visible}
//             onCancel={onCancel}
//             onOk={handleConfirmLocation}
//             okButtonProps={{ disabled: !selectedLocation }}
//             width={800}
//             okText="Confirm Location"
//             cancelText="Cancel"
//         >
//             <Alert
//                 message="Click on the map to select your location in Palestine"
//                 type="info"
//                 showIcon
//                 style={{ marginBottom: 16 }}
//             />

//             <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
//                 <MapContainer
//                     center={initialLocation?.latitude && initialLocation?.longitude
//                         ? [initialLocation.latitude, initialLocation.longitude]
//                         : palestineCenter
//                     }
//                     zoom={10}
//                     style={{ height: '100%', width: '100%' }}
//                     minZoom={8}
//                     maxBounds={palestineBounds}
//                     maxBoundsViscosity={1.0}
//                 >
//                     <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     />
//                     <LocationMarker
//                         selectedLocation={selectedLocation}
//                         onLocationSelect={handleMapClick}
//                     />
//                 </MapContainer>
//             </div>

//             {selectedLocation && (
//                 <div style={{ marginTop: 16, padding: 12, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
//                     <strong>📍 Selected Location:</strong><br />
//                     <div style={{ marginTop: 4 }}>
//                         Latitude: <strong>{selectedLocation[0].toFixed(6)}</strong><br />
//                         Longitude: <strong>{selectedLocation[1].toFixed(6)}</strong>
//                     </div>
//                 </div>
//             )}
//         </Modal>
//     );
// };

// export default MapComponent;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Spin } from 'antd';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color = '#ff4d4f') => {
    return new L.Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="24px" height="24px">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41],
    });
};

// Map controller to handle resize issues
function MapController({ map, visible }) {
    useEffect(() => {
        if (map && visible) {
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }
    }, [map, visible]);

    return null;
}

// Location marker component
function LocationMarker({ selectedLocation, onLocationSelect }) {
    const map = useMap();

    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        },
    });

    return selectedLocation ? (
        <Marker
            position={selectedLocation}
            icon={createCustomIcon('#ff4d4f')}
        />
    ) : null;
}

const MapComponent = ({ visible, onCancel, onLocationSelect, initialLocation }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(false);

    // Palestine bounds and center
    const palestineCenter = [31.5, 34.5];
    const palestineBounds = [
        [31.0, 34.0], // Southwest
        [32.5, 35.5]  // Northeast
    ];

    // Initialize selected location from props
    useEffect(() => {
        if (initialLocation && initialLocation.latitude && initialLocation.longitude) {
            setSelectedLocation([initialLocation.latitude, initialLocation.longitude]);
        } else {
            setSelectedLocation(null);
        }
    }, [initialLocation, visible]);

    // Handle modal visibility changes
    useEffect(() => {
        if (visible && map) {
            setLoading(true);
            setTimeout(() => {
                if (map) {
                    map.invalidateSize();
                    setLoading(false);
                }
            }, 300);
        }
    }, [visible, map]);

    const handleMapClick = (latlng) => {
        setSelectedLocation([latlng.lat, latlng.lng]);
    };

    const mapToGovernorate = (region) => {
        const governorateMap = {
            'gaza': 'gaza',
            'غزة': 'gaza',
            'gaza strip': 'gaza',
            'ramallah': 'ramallah',
            'رام الله': 'ramallah',
            'رام الله والبيرة': 'ramallah',
            'ramallah and al-bireh': 'ramallah',
            'hebron': 'hebron',
            'الخليل': 'hebron',
            'al khalil': 'hebron',
            'nabulus': 'nabulus',
            'نابلس': 'nabulus',
            'nablus': 'nabulus',
            'jerusalem': 'jerusalem',
            'القدس': 'jerusalem',
            'al quds': 'jerusalem',
            'bethlehem': 'bethlehem',
            'بيت لحم': 'bethlehem',
            'bayt lahm': 'bethlehem',
            'jenin': 'jenin',
            'جنين': 'jenin',
            'tulkarm': 'tulkarm',
            'طولكرم': 'tulkarm',
            'tul karm': 'tulkarm',
            'qalqilya': 'qalqilya',
            'قلقيلية': 'qalqilya',
            'qalqilia': 'qalqilya',
            'salfit': 'salfit',
            'سلفيت': 'salfit',
            'jericho': 'jericho',
            'أريحا': 'jericho',
            'ariha': 'jericho',
            'tubas': 'tubas',
            'طوباس': 'tubas',
            'tubas governorate': 'tubas'
        };

        if (!region) return '';

        const normalizedRegion = region.toLowerCase().trim();

        // Try exact match first
        if (governorateMap[normalizedRegion]) {
            return governorateMap[normalizedRegion];
        }

        // Try partial matches
        for (const [key, value] of Object.entries(governorateMap)) {
            if (normalizedRegion.includes(key) || key.includes(normalizedRegion)) {
                return value;
            }
        }

        return ''; // default fallback
    };

    const handleConfirmLocation = async () => {
        if (selectedLocation) {
            try {
                const [lat, lng] = selectedLocation;
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&countrycodes=ps&accept-language=en`
                );
                const data = await response.json();

                console.log('🗺️ Full OpenStreetMap Response:', data);
                console.log('🏠 Address Details:', data.address);

                if (data.address) {
                    const address = data.address;
                    const governorate = mapToGovernorate(address.state || address.county || address.city || address.town || address.region || data.address);

                    const locationData = {
                        latitude: lat,
                        longitude: lng,
                        address_line1: address.road || address.house_number ?
                            `${address.house_number || ''} ${address.road || ''}`.trim() : '',
                        // city: address.city || address.town || address.village || address.hamlet || '',
                        region: address.suburb || address.town || address.city || address.state || address.county || address.village || address.hamlet || '',
                        governorate: governorate,
                        postal_code: address.postcode || '',
                        country: 'Palestine',
                        formatted_address: data.display_name
                    };

                    onLocationSelect(locationData);
                } else {
                    // Fallback with coordinates only
                    onLocationSelect({
                        latitude: lat,
                        longitude: lng,
                        country: 'Palestine',
                        formatted_address: `Palestine (${lat.toFixed(6)}, ${lng.toFixed(6)})`
                    });
                }
            } catch (error) {
                console.error('Error reverse geocoding:', error);
                // Fallback: just return coordinates
                onLocationSelect({
                    latitude: selectedLocation[0],
                    longitude: selectedLocation[1],
                    country: 'Palestine',
                    formatted_address: `Palestine (${selectedLocation[0].toFixed(6)}, ${selectedLocation[1].toFixed(6)})`
                });
            }
        }
    };

    // const handleConfirmLocation = async () => {
    //     if (selectedLocation) {
    //         try {
    //             const [lat, lng] = selectedLocation;
    //             console.log('📍 Selected Coordinates:', { lat, lng });

    //             const response = await fetch(
    //                 `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&countrycodes=ps&accept-language=en`
    //             );
    //             const data = await response.json();

    //             console.log('🗺️ Full OpenStreetMap Response:', data);
    //             console.log('🏠 Address Details:', data.address);

    //             if (data.address) {
    //                 const address = data.address;
    //                 console.log('🔍 Available Address Fields:', Object.keys(address));

    //                 const governorate = mapToGovernorate(address.state || address.county || address.city || '');
    //                 console.log('🎯 Mapped Governorate:', governorate, 'from:', address.state || address.county || address.city);

    //                 const locationData = {
    //                     latitude: lat,
    //                     longitude: lng,
    //                     address_line1: address.road || address.house_number ?
    //                         `${address.house_number || ''} ${address.road || ''}`.trim() : '',
    //                     city: address.city || address.town || address.village || address.hamlet || '',
    //                     region: address.state || address.county || '',
    //                     governorate: governorate,
    //                     postal_code: address.postal_code || '',
    //                     country: 'Palestine',
    //                     formatted_address: data.display_name
    //                 };

    //                 console.log('📦 Final Location Data Being Sent:', locationData);
    //                 onLocationSelect(locationData);
    //             } else {
    //                 console.warn('⚠️ No address found in response, using fallback');
    //                 // Fallback data...
    //             }
    //         } catch (error) {
    //             console.error('❌ Error reverse geocoding:', error);
    //             // Fallback data...
    //         }
    //     }
    // };

    return (
        <Modal
            title="Select Your Location in Palestine"
            open={visible}
            onCancel={onCancel}
            onOk={handleConfirmLocation}
            okButtonProps={{ disabled: !selectedLocation }}
            width={800}
            okText="Confirm Location"
            cancelText="Cancel"
            afterOpenChange={(open) => {
                if (open && map) {
                    setTimeout(() => map.invalidateSize(), 100);
                }
            }}
        >
            <Alert
                message="Click on the map to select your location in Palestine"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />

            {loading && (
                <div style={{
                    height: '400px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f5f5f5'
                }}>
                    <Spin size="large" tip="Loading map..." />
                </div>
            )}

            <div
                style={{
                    height: '400px',
                    width: '100%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: loading ? 'none' : 'block'
                }}
            >
                <MapContainer
                    center={initialLocation?.latitude && initialLocation?.longitude
                        ? [initialLocation.latitude, initialLocation.longitude]
                        : palestineCenter
                    }
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                    minZoom={8}
                    maxBounds={palestineBounds}
                    maxBoundsViscosity={1.0}
                    whenCreated={setMap}
                >
                    <MapController map={map} visible={visible} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker
                        selectedLocation={selectedLocation}
                        onLocationSelect={handleMapClick}
                    />
                </MapContainer>
            </div>

            {selectedLocation && (
                <div style={{ marginTop: 16, padding: 12, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
                    <strong>📍 Selected Location:</strong><br />
                    <div style={{ marginTop: 4 }}>
                        Latitude: <strong>{selectedLocation[0].toFixed(6)}</strong><br />
                        Longitude: <strong>{selectedLocation[1].toFixed(6)}</strong>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default MapComponent;