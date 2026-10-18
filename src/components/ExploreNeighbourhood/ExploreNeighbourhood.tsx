import { GoogleMap, Marker, OverlayView, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text } from 'src/common/SitecoreOverrides';
import Tabs from 'src/common/Tabx';

// Icons & Sitecore Components (Assumed paths based on your snippet)
import CrossIcon from 'assets/icons/CrossIcon';
import FilterIcon from 'assets/icons/FilterIcon';
import { Checkbox } from 'components/common/Checkbox';

// --- Types & Interfaces ---
interface Location {
  name: string;
  coordinates: string;
}

interface FacilityItem {
  name: string;
  type: 'community' | 'surroundings';
  locations: Location[];
}

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
}

const DEFAULT_CENTER = { lat: 25.218306, lng: 55.429164 };

// --- Main Component ---
export default function ExploreNeighbourhood({ fields }: any) {
  const facilityList = useMemo(() => {
    const grouped = fields?.facilities?.reduce((acc: FacilityItem[], facility: any) => {
      const type = facility?.fields?.Type?.value === 'My Community' ? 'community' : 'surroundings';
      const facilityCategory = facility?.fields?.Facility?.value;

      const location: Location = {
        name: facility?.fields?.Name?.value,
        coordinates: facility?.fields?.Coordinate?.value?.replace(/\s/g, ''),
      };

      const existing = acc.find((item) => item.name === facilityCategory && item.type === type);

      if (existing) {
        existing.locations.push(location);
      } else {
        acc.push({
          name: facilityCategory,
          type,
          locations: [location],
        });
      }
      return acc;
    }, []);

    return (
      grouped
        ?.filter((item: any) => item.name)
        ?.sort((a: any, b: any) => a.name.localeCompare(b.name)) || []
    );
  }, [fields?.facilities]);

  // Hide entire component when community has no facilities
  if (!facilityList.length) {
    return null;
  }

  const myCommunityFacilities = facilityList.filter((item: any) => item.type === 'community');
  const surroundingsFacilities = facilityList.filter((item: any) => item.type === 'surroundings');

  return (
    <section className="ExploreNeighbourhood">
      <div className="container-sm mt-8 md:mt-6">
        <div className="bg-white-pure rounded-xl border border-solid border-lilac-300 overflow-hidden">
          <div className="pt-4 md:pt-8">
            <div className="px-4 md:px-8">
              <Text
                field={fields?.heading}
                tag="h3"
                className="text-[16px] leading-6 md:text-heading-3 font-normal text-navy-500"
              />
              <Text
                field={fields?.desc}
                tag="p"
                className="text-[14px] leading-5 md:text-[16px] md:leading-6 font-light text-navy-500 mt-2 md:mt-3 mb-5"
              />
            </div>

            <Tabs
              containerClasslist="p-0!"
              headerClasslist="mx-4 md:mx-8 mb-5!"
              tabs={[
                {
                  id: 'tab-surroundings',
                  label: 'MY SURROUNDINGS',
                  content: <TabBody facilityList={surroundingsFacilities} />,
                },
                {
                  id: 'tab-community',
                  label: 'MY COMMUNITY',
                  content: <TabBody facilityList={myCommunityFacilities} />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Sub-Component: TabBody ---
function TabBody({ facilityList }: { facilityList: FacilityItem[] }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPopup && popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  const handleToggleFacility = (name: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const markersToShow = useMemo(() => {
    return facilityList
      .filter((facility) => selectedFacilities.includes(facility.name))
      .flatMap((facility) =>
        facility.locations.map((loc) => {
          const [lat, lng] = loc.coordinates.split(',').map(Number);
          return { lat, lng, title: loc.name };
        })
      );
  }, [facilityList, selectedFacilities]);
  useEffect(() => {
    if (!mapRef.current) return;

    if (markersToShow.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();

      bounds.extend(DEFAULT_CENTER);

      markersToShow.forEach((marker) => {
        bounds.extend({ lat: marker.lat, lng: marker.lng });
      });

      mapRef.current.fitBounds(bounds);

      const listener = window.google.maps.event.addListener(mapRef.current, 'idle', () => {
        if (mapRef.current && mapRef.current.getZoom()! > 16) mapRef.current.setZoom(16);
        window.google.maps.event.removeListener(listener);
      });
    } else {
      mapRef.current.setCenter(DEFAULT_CENTER);
      mapRef.current.setZoom(15);
    }
  }, [markersToShow]);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleSelectAllFilters = () => {
    if (facilityList?.length !== selectedFacilities?.length) {
      const allFacilitiesName = facilityList.map((facility) => facility.name);
      setSelectedFacilities(allFacilitiesName);
    }
  };

  return (
    <div className="TabBody">
      <div className="px-4 md:px-8 pb-4 md:pb-8  flex justify-end">
        <div className="w-full md:w-auto relative z-10" ref={popupRef}>
          <button
            className="btn btn-primary py-3! px-[46px]!"
            onClick={() => setShowPopup(!showPopup)}
          >
            <FilterIcon width={20} height={20} />
            Filters ({selectedFacilities?.length})
          </button>

          <div
            className={`absolute top-full end-0 p-4 w-full md:w-75 space-y-5 bg-white-pure rounded-xl border border-solid border-lilac-300 shadow-xl transition-all duration-300 ${
              showPopup ? 'opacity-100 translate-y-2' : 'opacity-0 invisible pointer-events-none'
            }`}
          >
            <div className="flex justify-between items-center font-bold text-navy-500">
              Filters
              <button
                className="cursor-pointer text-lilac-500 hover:text-navy-500"
                onClick={() => setShowPopup(false)}
              >
                <CrossIcon />
              </button>
            </div>
            <div className="flex justify-between">
              <div
                className="text-body-sm tracking-[10%] cursor-pointer font-medium underline uppercase text-sky-700 hover:text-sky-600"
                onClick={handleSelectAllFilters}
              >
                Select all
              </div>
              <div
                className="text-body-sm tracking-[10%] cursor-pointer font-medium underline uppercase text-sky-700 hover:text-sky-600"
                onClick={() => setSelectedFacilities([])}
              >
                Clear all
              </div>
            </div>
            <ul className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar">
              {facilityList.map((item, index) => (
                <li
                  key={index}
                  className="flex gap-4 cursor-pointer"
                  onClick={() => handleToggleFacility(item.name)}
                >
                  <Checkbox
                    id={item.name}
                    name={item.name}
                    value={item.name}
                    checked={selectedFacilities.includes(item.name)}
                    onChange={() => handleToggleFacility(item.name)}
                  >
                    <p className="text-body-sm font-light">{item.name}</p>
                  </Checkbox>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {isLoaded && (
        <div className="relative">
          <GoogleMap
            onLoad={onMapLoad}
            center={DEFAULT_CENTER}
            zoom={15} // Default High Zoom
            mapContainerStyle={{ width: '100%', height: '380px' }}
          >
            <Marker
              position={DEFAULT_CENTER}
              icon={{ url: '/assets/svg/marker-1.svg' }}
              zIndex={10}
            />
            {markersToShow.map((m, idx) => {
              const isSelected = activeMarker?.title === m.title;
              return (
                <Marker
                  key={idx}
                  position={{ lat: m.lat, lng: m.lng }}
                  title={m.title}
                  icon={{
                    url: '/assets/svg/marker-2.svg',
                    scaledSize: new window.google.maps.Size(
                      isSelected ? 45 : 30,
                      isSelected ? 45 : 30
                    ),
                  }}
                  onClick={() => setActiveMarker(isSelected ? null : m)}
                />
              );
            })}
            {activeMarker && (
              <OverlayView
                position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div className="bg-white-pure shadow-lg rounded-lg p-4 w-52 -translate-x-1/2 -translate-y-[170%] border border-lilac-200">
                  <p className="text-body-xs font-normal text-navy-500">{activeMarker.title}</p>
                </div>
              </OverlayView>
            )}
          </GoogleMap>
        </div>
      )}
    </div>
  );
}
