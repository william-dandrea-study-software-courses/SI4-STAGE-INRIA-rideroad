import {AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {Subscription} from "rxjs";
import {
  ASSISTANT_NAVIGATION_ICON,
  ATTRIBUTION_MAP,
  UNSELECTED_ITINERARY_COLOR,
  CHECKPOINT_ITINERARY_MARKER_ICON,
  DEFAULT_MAP_CENTER_LATITUDE,
  DEFAULT_MAP_CENTER_LONGITUDE,
  DEFAULT_ZOOM,
  DIRT_ITINERARY_COLOR,
  FINISH_ITINERARY_MARKER_ICON,
  MARKER_ICON_SIZE,
  MAX_ZOOM,
  MIN_ZOOM,
  PEDESTRIAN_ITINERARY_COLOR,
  PROTECTED_ITINERARY_COLOR,
  ROAD_ITINERARY_COLOR,
  START_ITINERARY_MARKER_ICON,
  URL_TILE_LAYER
} from "../../../../config";
import {AmenityService} from "../../../core/service/amenity.service";
import {AutoCompletionAddressService} from "../../../core/service/auto-completion-address.service";
import {GeolocalisationService} from "../../../core/service/geolocalisation.service";
import {GpsService} from "../../../core/service/gps.service";
import {ItineraryService} from "../../../core/service/itinerary.service";
import {MapClickService} from "../../../core/service/map-click.service";
import {AmenityModel} from "../../../core/model/amenity.model";
import {FeatureGroup, LatLng, LeafletMouseEvent, PointTuple} from "leaflet";
import {ItineraryVisual} from "../../../core/model/itinerary-visual.class";
import {NewUserItineraryInfosClass} from "../../../core/model/new-user-itinerary-infos.class";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {SpinnerComponent} from "../../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-itinerary-map',
  templateUrl: './itinerary-map.component.html',
  styleUrls: ['./itinerary-map.component.scss']
})
export class ItineraryMapComponent implements OnInit, AfterViewInit, OnDestroy {

  // @ts-ignore
  public map: Map;

  // Subscriptions
  private currentPositionSubscription: Subscription = new Subscription();
  private centerOnUserSubscription: Subscription = new Subscription();
  private amenitiesResultSubscription: Subscription = new Subscription();
  private mapClickSubscription: Subscription = new Subscription();
  private itinerarySubscription: Subscription = new Subscription();
  private newItineraryUserInfosSubscription: Subscription = new Subscription();
  private isLoadingNewItinerarySubscription: Subscription = new Subscription();

  // Infos from services
  private currentPosition: GeolocationPosition | null = null;
  private centerOnUser: boolean = true;
  private amenitiesResult: AmenityModel[] | null = null;
  private clickPosition: LeafletMouseEvent | null = null;
  private itinerariesVisual: ItineraryVisual[] | null = null;
  private itineraryUserInfos: NewUserItineraryInfosClass | null = null;
  private isLoadingItinerary: boolean | Error = false;

  // Elements on map
  private currentNavigationMarker: L.Marker | null = null;
  private itineraryMarkers: L.Marker[] = [];
  private itinerariesLayers: L.Layer[] = [];
  private amenitiesLayers: L.Layer[] = [];

  public getScreenWidth: any;
  public getScreenHeight: any;

  constructor(
    private amenityService: AmenityService,
    private autoCompletionAddressService: AutoCompletionAddressService,
    private geolocalisationService: GeolocalisationService,
    private gpsService: GpsService,
    private itineraryService: ItineraryService,
    private mapClickService: MapClickService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    this.loadCurrentPositionSubscription()
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.loadCenterOnUserSubscription()
    this.loadAmenitiesResultSubscription()
    this.loadMapClickSubscription()
    this.loadItinerarySubscription()
    this.loadNewItineraryUserInfosSubscription()
    this.loadIsLoadingNewItinerarySubscription()
  }

  private loadCurrentPositionSubscription() {
    if (this.currentPositionSubscription) {this.currentPositionSubscription .unsubscribe();}
    this.currentPositionSubscription = this.geolocalisationService.currentPosition$.subscribe(currentPosition => {
    this.newCurrentPositionValue(currentPosition);
  }); }
  private loadCenterOnUserSubscription() {
    if (this.centerOnUserSubscription) {this.centerOnUserSubscription .unsubscribe();}
    this.centerOnUserSubscription = this.geolocalisationService.centerOnUser$.subscribe(centerOnUser => {
    this.newCenterOnUserValue(centerOnUser);
  }); }
  private loadAmenitiesResultSubscription() {
    if (this.amenitiesResultSubscription) {this.amenitiesResultSubscription .unsubscribe();}
    this.amenitiesResultSubscription = this.amenityService.$amenitiesResult.subscribe(amenitiesResult => {
    this.newAmenitiesResultValue(amenitiesResult);
  }); }
  private loadMapClickSubscription() {
    if (this.mapClickSubscription) {this.mapClickSubscription .unsubscribe();}
    this.mapClickSubscription = this.mapClickService.$clickPosition.subscribe(clickPosition => {
    this.newClickPositionValue(clickPosition)
  }); }
  private loadItinerarySubscription() {
    if (this.itinerarySubscription) {this.itinerarySubscription .unsubscribe();}
    this.itinerarySubscription = this.itineraryService.$itineraryVisual.subscribe(itinerariesVisual => {
    this.newItinerariesVisuel(itinerariesVisual);
  }); }
  private loadNewItineraryUserInfosSubscription() {
    if (this.newItineraryUserInfosSubscription) {this.newItineraryUserInfosSubscription .unsubscribe();}
    this.newItineraryUserInfosSubscription = this.itineraryService.newItineraryUserInfos$.subscribe(itineraryUserInfos => {
    this.newItineraryUserInfosValue(itineraryUserInfos);
  }) }
  private loadIsLoadingNewItinerarySubscription() {
    if (this.isLoadingNewItinerarySubscription) {this.isLoadingNewItinerarySubscription .unsubscribe();}
    this.isLoadingNewItinerarySubscription = this.itineraryService.$isLoadingItineraryOnBackend.subscribe(isLoadingItinerary => {
    this.newIsLoadingItineraryValue(isLoadingItinerary);
  }) }







  private newCurrentPositionValue(currentPosition: GeolocationPosition | null): void {
    this.currentPosition = currentPosition;

    if (this.currentPosition != null) {
      // When we have the current position of the user, we can remove the snackbar that say "Please, allow geolocation on your browser"
      this.snackBar.dismiss();

      // We set the current position marker on the position of the user
      this.setCurrentPositionMarker(this.currentPosition);

      // If the centerOnUser is True, we want to center on the user position
      if (this.centerOnUser) {
        this.centerMapOnPosition(new LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude))
      }

    } else {
      // Ask for accepting the localisation (but before we wait the infos from current position)
      this.snackBar.open("Please, allow geolocation on your browser", "", {duration: 1000})
    }

  }

  private newCenterOnUserValue(centerOnUser: boolean): void {
    this.centerOnUser = centerOnUser;

    // If the centerOnUser is True, we want to center on the user position
    if (this.centerOnUser && this.currentPosition != null) {
      this.centerMapOnPosition(new LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude))
    }
  }

  private newAmenitiesResultValue(amenitiesResult: AmenityModel[]): void {
    this.amenitiesResult = amenitiesResult;

    this.showAmenitiesOnMap(amenitiesResult);
  }

  private newClickPositionValue(clickPosition: LeafletMouseEvent | null): void {
    this.clickPosition = clickPosition;
  }

  private newItinerariesVisuel(itinerariesVisual: ItineraryVisual[] | null): void {
    this.itinerariesVisual = itinerariesVisual;

    if (this.itinerariesVisual != null) {
      this.showItinerary(this.itinerariesVisual);
    }
  }

  private newItineraryUserInfosValue(itineraryUserInfos: NewUserItineraryInfosClass | null): void {
    this.itineraryUserInfos = itineraryUserInfos;

    // We set the related markers of the itinerary inputs on the map
    if (this.itineraryUserInfos != null) {
      this.setMarkersNewItineraryUserInfos(this.itineraryUserInfos);
    }
  }

  private newIsLoadingItineraryValue(isLoadingItinerary: boolean | Error): void {
    this.isLoadingItinerary = isLoadingItinerary;



    if (isLoadingItinerary === true) {
      this.dialog.open(SpinnerComponent);
    } else if(isLoadingItinerary === false) {
      this.dialog.closeAll();
    } else {
      this.dialog.closeAll();
      this.snackBar.open(isLoadingItinerary.message + ", please try again", "Ok", {duration: 3000})
    }
  }



  private showAmenitiesOnMap(amenities: AmenityModel[]) {

      this.amenitiesLayers.forEach(ame => this.map.removeLayer(ame))
      this.amenitiesLayers = [];

      amenities.forEach(amenity => {
        const layer = L.marker(new LatLng(amenity.lat, amenity.lon), {
          icon: L.icon({
            iconUrl: this.amenityService.getIconUrl(amenity.tags.amenity),
            // @ts-ignore
            iconSize: MARKER_ICON_SIZE,
          }),
        })

        const popup = L.popup({
          autoClose: false,
        }).setContent(JSON.stringify(amenity.tags))

        layer.bindPopup(popup, {
          closeButton: false
        })

        this.map.addLayer(layer)
        this.amenitiesLayers.push(layer)
      });

  }



  private showItinerary(itineraries: ItineraryVisual[]) {

    itineraries.forEach(itinerary => {
      itinerary.segments_on_map = this.generateSegmentsOnMapItinerary(itinerary);
    });

    this.itinerariesLayers.forEach(itineraries => itineraries.removeFrom(this.map))
    this.itinerariesLayers = []

    const selectedItinerary: ItineraryVisual | undefined = itineraries.find(iti => iti.is_selectionned);
    const notSelectedItinerary: ItineraryVisual[] = itineraries.filter(iti => !iti.is_selectionned);

    notSelectedItinerary.forEach(notSelectedItinerary => this.showSegmentsOnMapItinerary(notSelectedItinerary))
    if (selectedItinerary != undefined) {
      this.showSegmentsOnMapItinerary(selectedItinerary);
    }
  }



  private showSegmentsOnMapItinerary(itinerary: ItineraryVisual) {

    if (itinerary.segments_on_map != null) {
      itinerary.segments_on_map.addTo(this.map);
      this.itinerariesLayers.push(itinerary.segments_on_map);

      itinerary.segments_on_map.on('click', (e) => {
        this.itineraryService.changeSelectedItinerary(itinerary.index)
      });
    }
  }

  private generateSegmentsOnMapItinerary(itinerary: ItineraryVisual): FeatureGroup {
    const allSegments: L.Polyline[] = [];

    itinerary.itinerary.paths.forEach(path => {
      const allLongLat = path.coords.map(coord => new LatLng(coord.lat, coord.lon, coord.elevation))

      let color: string = UNSELECTED_ITINERARY_COLOR;
      let opacity: number = 0.8;
      if (itinerary.is_selectionned) {
        if (this.itineraryService.isDirtPath(path.tags['highway'])) {
          color = DIRT_ITINERARY_COLOR
        } else if (this.itineraryService.isPedestrianPath(path.tags['highway'])) {
          color = PEDESTRIAN_ITINERARY_COLOR
        } else if (this.itineraryService.isBikePath(path)) {
          color = PROTECTED_ITINERARY_COLOR
        } else {
          color = ROAD_ITINERARY_COLOR
        }

        opacity = 1.0;
      }

      allSegments.push( L.polyline(allLongLat, { color: color,  weight: 7,  smoothFactor: 1,  opacity: opacity,}) );
    });

    return L.featureGroup(allSegments);
  }

  /**
   * Set markers related to the itinerary inputs on the map
   */
  private setMarkersNewItineraryUserInfos(itineraryUserInfos: NewUserItineraryInfosClass) {

    this.itineraryMarkers.forEach(itineraryMarker => { itineraryMarker.removeFrom(this.map); });
    this.itineraryMarkers = [];

    if (itineraryUserInfos.startMarker != null) {
      // show start marker
      this.itineraryMarkers.push(this.createMarker(itineraryUserInfos.startMarker, START_ITINERARY_MARKER_ICON, 0));
    }

    if (itineraryUserInfos.endMarker != null) {
      // show end marker
      this.itineraryMarkers.push(this.createMarker(itineraryUserInfos.endMarker, FINISH_ITINERARY_MARKER_ICON, 0));
    }

    itineraryUserInfos.checkPoints.forEach(latLngCheckpoint => {
      // Show checkpoint
      this.itineraryMarkers.push(this.createMarker(latLngCheckpoint, CHECKPOINT_ITINERARY_MARKER_ICON, 0));
    });

    this.itineraryMarkers.forEach(itineraryMarker => {itineraryMarker.addTo(this.map)})

    this.centerMapOnSeveralPositions(this.itineraryMarkers.map(m => m.getLatLng()));
  }


  private createMarker(position: LatLng, url: string, rotation: number): L.Marker {

    return new L.Marker(position, {
      icon: new L.Icon({
        iconUrl: url,
        // @ts-ignore
        iconSize: MARKER_ICON_SIZE,
      }),
      rotationAngle: rotation
    });

  }





  /**
   * Center the map around a certain position
   */
  private centerMapOnPosition(position: LatLng): void {
    this.map.setView(position);
  }

  private centerMapOnSeveralPositions(positions: LatLng[]): void {
    if (positions.length > 0) {
      this.map.fitBounds(positions);
    }
  }


  /**
   * Set the marker (of the current location of the user) on the map
   */
  private setCurrentPositionMarker(currentPosition: GeolocationPosition) {
    if (this.currentNavigationMarker != null) {
      this.currentNavigationMarker.removeFrom(this.map);
      this.currentNavigationMarker = null;
    }

    const currentPositionForMarker: LatLng = new LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude)
    const rotation = currentPosition.coords.heading ? currentPosition.coords.heading : 0;

    this.currentNavigationMarker = this.createMarker(currentPositionForMarker, ASSISTANT_NAVIGATION_ICON, rotation)

    this.currentNavigationMarker.addTo(this.map)
  }

  /**
   * Initialize the map when we create the component
   */
  private initializeMap(): void {

    const currentPositionUser = this.geolocalisationService.currentPosition ? new LatLng(this.geolocalisationService.currentPosition.coords.latitude, this.geolocalisationService.currentPosition.coords.longitude) : undefined;

    this.map = L.map('map', {
      center: currentPositionUser != undefined ? currentPositionUser : [ DEFAULT_MAP_CENTER_LATITUDE, DEFAULT_MAP_CENTER_LONGITUDE ],
      zoom: DEFAULT_ZOOM,
    });

    const tiles = L.tileLayer(URL_TILE_LAYER, {
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      attribution: ATTRIBUTION_MAP,
      detectRetina: true,
    });

    tiles.addTo(this.map);

    // Set the click on the map
    this.map.on('click', (v: LeafletMouseEvent) => {this.mapClickService.setClickPosition(v);});

    this.map.on('moveend', (v: LeafletMouseEvent) => {this.amenityService.changeMapBounds(this.map.getBounds())})

    this.addLegend();

  }

  private addLegend() {
    const legend = new (L.Control.extend({
      options: { position: 'bottomright'}
    }));

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'legend' );

      const labels = [
        {name: 'Dirt Road', color: DIRT_ITINERARY_COLOR},
        {name: 'Bike Road', color: PROTECTED_ITINERARY_COLOR},
        {name: 'Regular Road', color: ROAD_ITINERARY_COLOR},
        {name: 'Pedestrian Road', color: PEDESTRIAN_ITINERARY_COLOR},
      ];


      div.innerHTML = '<div style="background-color: white"><b>Legend</b></div>';
      for (let i = 0; i < labels.length; i++) {
        div.innerHTML += `<i style="background-color: ${labels[i].color}; height: 10px; width: 10px;>"> &nbsp; &nbsp; </i>` + '  ' +  labels[i].name + '<br/>';
      }

      div.style.backgroundColor = "#FFF"
      div.style.padding = "20px"

      return div;
    };

    legend.addTo(this.map);
  }


  @HostListener('window:resize')
  onWindowResize() {

    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    this.map.off();
    this.map.remove();
    this.initializeMap();
    this.loadCenterOnUserSubscription()
    this.loadAmenitiesResultSubscription()
    this.loadMapClickSubscription()
    this.loadItinerarySubscription()
    this.loadNewItineraryUserInfosSubscription()
    this.loadIsLoadingNewItinerarySubscription()
  }


    ngOnDestroy(): void {
      this.currentPositionSubscription.unsubscribe();
      this.centerOnUserSubscription.unsubscribe();
      this.amenitiesResultSubscription.unsubscribe();
      this.mapClickSubscription.unsubscribe();
      this.itinerarySubscription.unsubscribe();
      this.newItineraryUserInfosSubscription.unsubscribe();
      this.isLoadingNewItinerarySubscription.unsubscribe();

      this.map.off();
      this.map.remove();
  }

}
