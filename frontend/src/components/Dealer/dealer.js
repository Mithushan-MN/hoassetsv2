import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Footer from "../Footer";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaPng from "leaflet/dist/images/marker-icon-2x.png";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetinaPng,
  iconUrl: markerIconPng,
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const defaultIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconRetinaUrl: markerIconRetinaPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const activeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const userLocationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapPanner({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      const bounds = L.latLngBounds(
        [position[0] - 0.001, position[1] - 0.001],
        [position[0] + 0.001, position[1] + 0.001]
      );
      map.fitBounds(bounds, { maxZoom: 18, padding: [50, 50] });
    }
  }, [position, map]);
  return null;
}

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// ✅ Routing with single error toast
function Routing({ from, to }) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const toastId = "routing-error";

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
      },
    })
      .on("routesfound", () => {
        toast.dismiss(toastId);
      })
      .on("routingerror", () => {
        if (!toast.isActive(toastId)) {
          toast.error("Dealer is too far or route cannot be generated.", {
            toastId,
          });
        }
      })
      .addTo(map);

    return () => {
      if (routingControl && map.hasLayer(routingControl)) {
        map.removeControl(routingControl);
      }
    };
  }, [map, from, to]);

  return null;
}

export default function DealerLocatorCSV() {
  const [dealers, setDealers] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedPos, setSelectedPos] = useState(null);
  const [selectedDealerIndex, setSelectedDealerIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);

  const defaultCenter = [-30.0, 140.0];
  const defaultZoom = 4;
  const australiaCenter = [-25.0, 134.0];
  const australiaZoom = 5;
  const newZealandCenter = [-41.0, 174.0];
  const newZealandZoom = 6;
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(defaultZoom);

  useEffect(() => {
    Papa.parse("/dealers.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedDealers = results.data.map((row) => ({
          name: row.name,
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng),
          photo_url: row.photo_url,
          address: row.address,
          mobile_number: row.mobile_number,
          website_url: row.website_url,
        }));
        setDealers(parsedDealers);
      },
      error: (err) => {
        console.error("Error loading CSV:", err);
      },
    });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.warn("Error getting location:", err);
      }
    );
  }, []);

  const filteredDealers = dealers.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  const australiaDealers = filteredDealers.filter(
    (d) => d.lat <= -9 && d.lat >= -44 && d.lng >= 110 && d.lng <= 155
  );

  const newZealandDealers = filteredDealers.filter(
    (d) => d.lat <= -33 && d.lat >= -48 && d.lng >= 165 && d.lng <= 180
  );

  let dealersToShow =
    selectedRegion === "australia"
      ? australiaDealers
      : selectedRegion === "newzealand"
      ? newZealandDealers
      : filteredDealers;

  let selectedDealer = null;
  if (selectedDealerIndex !== null) {
    selectedDealer =
      selectedCategory === "australia"
        ? australiaDealers[selectedDealerIndex]
        : selectedCategory === "newzealand"
        ? newZealandDealers[selectedDealerIndex]
        : filteredDealers[selectedDealerIndex];
  }

  const handleDealerClick = (lat, lng, index, category) => {
    setSelectedPos([lat, lng]);
    setSelectedDealerIndex(index);
    setSelectedCategory(category);
    setRouteDestination(null);
  };

  const handleShowRouteClick = () => {
    if (!userLocation) {
      toast.error("User location not available. Please allow location access.");
      return;
    }
    if (!selectedDealer) {
      toast.error("Please select a dealer first.");
      return;
    }

    setRouteDestination([selectedDealer.lat, selectedDealer.lng]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pt-24">
      <div className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full flex flex-col items-center">
        <ToastContainer position="top-right" autoClose={4000} />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider bg-gradient-to-r from-zinc-700 to-zinc-500 bg-clip-text text-transparent mb-8 text-center uppercase">
          FIND A DEALER
        </h1>
        
        {/* Region Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => {
              setSelectedRegion("australia");
              setMapCenter(australiaCenter);
              setMapZoom(australiaZoom);
            }}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all ${selectedRegion === "australia" ? "bg-red-700 text-white shadow-md shadow-red-700/25" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"}`}
          >
            Australia
          </button>
          <button
            onClick={() => {
              setSelectedRegion("newzealand");
              setMapCenter(newZealandCenter);
              setMapZoom(newZealandZoom);
            }}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all ${selectedRegion === "newzealand" ? "bg-red-700 text-white shadow-md shadow-red-700/25" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"}`}
          >
            New Zealand
          </button>
          <button
            onClick={() => {
              setSelectedRegion(null);
              setMapCenter(defaultCenter);
              setMapZoom(defaultZoom);
            }}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all ${selectedRegion === null ? "bg-red-700 text-white shadow-md shadow-red-700/25" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"}`}
          >
            All
          </button>
        </div>

        {/* Main Locator Panel */}
        <div className="w-full bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
          
          {/* Sidebar */}
          <div className="w-full lg:w-96 p-6 bg-zinc-50 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-start items-stretch gap-6 overflow-y-auto lg:h-[600px]">
            <input
              type="text"
              placeholder="Search dealers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-300 bg-white placeholder-zinc-400 focus:border-red-600 focus:ring-4 focus:ring-red-600/10 outline-none transition-all"
              aria-label="Search dealers"
            />

            {/* Dealer List */}
            <div className="flex-grow flex flex-col gap-2 overflow-y-auto max-h-60 lg:max-h-none scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-zinc-100 pr-1">
              {dealersToShow.length === 0 ? (
                <p className="text-center py-8 text-sm italic text-zinc-400 bg-zinc-100/50 rounded-xl">
                  No dealers found.
                </p>
              ) : (
                dealersToShow.map((dealer, i) => {
                  let cat = "all";
                  if (australiaDealers.includes(dealer)) cat = "australia";
                  else if (newZealandDealers.includes(dealer)) cat = "newzealand";

                  const isActive = selectedDealer && selectedDealer.name === dealer.name;

                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedCategory(cat);
                        handleDealerClick(dealer.lat, dealer.lng, i, cat);
                      }}
                      className={`px-4 py-3.5 rounded-xl text-sm font-bold cursor-pointer border border-transparent shadow-sm transition-all duration-200 ${isActive ? "bg-gradient-to-r from-red-700 to-red-600 text-white border-red-500 scale-[1.02]" : "bg-white hover:bg-zinc-100 text-zinc-700 hover:scale-[1.01]"}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${dealer.name}`}
                    >
                      {dealer.name}
                    </div>
                  );
                })
              )}
            </div>

            {selectedDealer && (
              <button
                onClick={handleShowRouteClick}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-900 active:scale-98 transition-all text-white font-bold rounded-xl text-sm tracking-wide shadow-md shadow-zinc-800/10"
              >
                Show Route
              </button>
            )}

            {/* Selected Dealer Details */}
            {selectedDealer && (
              <div className="bg-zinc-200/60 border border-zinc-300/40 rounded-2xl p-5 shadow-inner text-zinc-800 space-y-3">
                <h3 className="font-extrabold text-base border-b border-zinc-300 pb-2 uppercase tracking-wide">
                  {selectedDealer.name}
                </h3>
                <p className="text-xs leading-relaxed">
                  <strong className="text-zinc-600">Address:</strong> {selectedDealer.address}
                </p>
                {selectedDealer.mobile_number && (
                  <p className="text-xs">
                    <strong className="text-zinc-600">Phone:</strong> {selectedDealer.mobile_number}
                  </p>
                )}
                {selectedDealer.website_url && (
                  <p className="text-xs">
                    <strong className="text-zinc-600">Website:</strong>{" "}
                    <a
                      href={selectedDealer.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 hover:underline font-bold"
                    >
                      {selectedDealer.website_url}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Map Section */}
          <div className="flex-grow h-[400px] lg:h-[600px] relative w-full">
            <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full">
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {userLocation && (
                <Marker position={userLocation} icon={userLocationIcon}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}

              {dealersToShow.map((dealer, i) => (
                <Marker
                  key={i}
                  position={[dealer.lat, dealer.lng]}
                  icon={
                    selectedDealer && dealer.name === selectedDealer.name
                      ? activeIcon
                      : defaultIcon
                  }
                  eventHandlers={{
                    click: () =>
                      handleDealerClick(dealer.lat, dealer.lng, i, selectedRegion),
                  }}
                >
                  <Popup>
                    <div className="max-w-[200px] space-y-2">
                      <h3 className="font-bold text-sm text-zinc-700">{dealer.name}</h3>
                      <p className="text-xs">
                        <strong>Address:</strong> {dealer.address}
                      </p>
                      {dealer.mobile_number && (
                        <p className="text-xs">
                          <strong>Phone:</strong> {dealer.mobile_number}
                        </p>
                      )}
                      {dealer.website_url && (
                        <p className="text-xs">
                          <strong>Website:</strong>{" "}
                          <a
                            href={dealer.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-700 underline font-bold"
                          >
                            {dealer.website_url}
                          </a>
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {userLocation && routeDestination && (
                <Routing from={userLocation} to={routeDestination} />
              )}

              {selectedPos && <MapPanner position={selectedPos} />}
              <MapUpdater center={mapCenter} zoom={mapZoom} />
            </MapContainer>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
