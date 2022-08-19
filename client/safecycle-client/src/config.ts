

// COLORS
// For use the global colors, go to app.component.ts and add the new property (e.g. --dirt-itinerary-color for DIRT_ITINERARY_COLOR),
// and after, in the scss, call color: var(--dirt-itinerary-color) (exemple in src/app/feature/itinerary/intern-sections/itinerary-card/itinerary-card.component.scss)
import {AmenityEnum} from "./app/core/model/amenity.model";

export const DIRT_ITINERARY_COLOR: string = "#8f5858";
export const PROTECTED_ITINERARY_COLOR: string = "#759bc9";
export const ROAD_ITINERARY_COLOR: string = "#484848";
export const PEDESTRIAN_ITINERARY_COLOR: string = "#4f7c40";
export const BASIC_ITINERARY_COLOR: string = "#b2b2b2";

// SIZES
export const MARKER_ICON_SIZE = [35, 35];

// ICONS
export const ASSISTANT_NAVIGATION_ICON: string = "/assets/icons/assistant_navigation.svg";
export const START_ITINERARY_MARKER_ICON: string = "/assets/icons/start_itinerary_marker.svg";
export const FINISH_ITINERARY_MARKER_ICON: string = "/assets/icons/end_itinerary_marker.svg";
export const CHECKPOINT_ITINERARY_MARKER_ICON: string = "/assets/icons/checkpoint_marker.svg";

export const DRINKING_WATER_ICON: string = '/assets/icons/water_drop_icon.svg';
export const CAMP_SITE_ICON: string = '/assets/icons/camping_icon.svg';
export const RESTAURANT_ICON: string = '/assets/icons/restaurant_icon.svg';
export const BICYCLE_REPAIR_STATION_ICON: string = '/assets/icons/repair_icon.svg';
export const SHELTER_ICON: string = '/assets/icons/shelter_icon.svg';
export const TOILETS_ICON: string = '/assets/icons/toilets_icon.svg';
export const NOT_FOUND_ICON: string = '/assets/icons/didnt_find_icon.svg';


// URL OSM
export const URL_TILE_LAYER: string  = "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png";
export const ATTRIBUTION_MAP: string  = "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>";

export const NOMINATIM_API_URL: string = 'https://nominatim.openstreetmap.org/search.php';

// URLS API
export const GET_AMENITY_IN_BBOX: string = 'amenitities-bbox';

export const GET_NEW_ITINERARY_VIA_CHECKPOINTS: string = 'checkpoints-itinerary';

export const POST_NEW_DRINKING_WATER_AMENITY: string = 'new-drinking-water-amenity';
export const POST_NEW_SHELTER_AMENITY: string = 'new-shelter-amenity';
export const POST_NEW_TOILETS_AMENITY: string = 'new-toilet-amenity';
export const POST_NEW_REPAIR_STATION_AMENITY: string = 'new-repair-station-amenity';
