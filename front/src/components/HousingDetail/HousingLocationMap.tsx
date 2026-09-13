import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import { MapPin } from "lucide-react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";

import {
  addressApi,
  type AddressSuggestion,
} from "../../api/addressApi";

interface Props {
  address: string;
  city: string;
}

const markerIcon = L.icon({
  iconUrl: "/images/icons/pin.png",
  iconSize: [42, 52],
  iconAnchor: [21, 52],
});

const HousingLocationMap = ({ address, city }: Props) => {
  const query = [address, city]
    .filter(Boolean)
    .join(", ");

  const { data, isLoading } = useQuery<AddressSuggestion[]>({
    queryKey: ["housing-location", query],
    queryFn: () => addressApi.autocomplete(query),
    enabled: Boolean(query),
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });

  const location = data?.find(
    (item) =>
      typeof item.lat === "number" &&
      typeof item.lon === "number"
  );

  const position: LatLngExpression | null = location
    ? [location.lat!, location.lon!]
    : null;

  return (
    <section>
      <h2 className="text-[18px] font-semibold text-[#111820]">
        Перегляньте розташування на карті
      </h2>

      <p className="mt-1 text-[13px] text-[#56636C]">
        {query}
      </p>

      <div className="mt-4 h-[300px] overflow-hidden rounded-[8px] border border-[#C5CED4] bg-[#EEF2F4]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-[13px] text-[#87939B]">
            Завантаження карти...
          </div>
        ) : position ? (
          <MapContainer
            center={position}
            zoom={16}
            scrollWheelZoom={false}
            dragging
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapCenter position={position} />

            <Marker
              position={position}
              icon={markerIcon}
            />
          </MapContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-[13px] text-[#87939B]">
            <MapPin size={24} className="mb-2 text-[#355872]" />
            Не вдалося визначити розташування за вказаною адресою.
          </div>
        )}
      </div>
    </section>
  );
};

const MapCenter = ({
  position,
}: {
  position: LatLngExpression;
}) => {
  const map = useMap();

  map.setView(position, 16);

  return null;
};

export default HousingLocationMap;