import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useContext, useEffect } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { AuthContext } from '../Context/AuthContext';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const Map = ({ serviceCenter, selected }) => {
    const { theme } = useContext(AuthContext)
    const isDark = theme === 'dark' ? true : false

    const position = [23.8103, 90.4125]

    const FlyToSelected = ({ selected }) => {
        const map = useMap();

        useEffect(() => {
            if (!selected) return;
            map.flyTo([selected.latitude, selected.longitude], 11, { duration: 2 });
        }, [selected, map]);

        return null;
    };



    return (
        <div className='h-80 xxs:h-96 sm:h-[600px] overflow-hidden rounded '>
            <MapContainer className='h-full w-full' center={position} zoom={8} scrollWheelZoom={false} >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                />

                {
                    serviceCenter.map((center, index) =>
                        <Marker position={[center.latitude, center.longitude]} key={index}>
                            <Popup>
                                <strong>{center.district}</strong><br /> {center.covered_area.join(", ")}
                            </Popup>
                        </Marker>
                    )
                }



                <FlyToSelected selected={selected} />

            </MapContainer>
        </div>
    );
};

export default Map;

