declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      fitBounds(bounds: LatLngBounds): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }

    class LatLngBounds {
      constructor();
      extend(point: LatLng): void;
      getCenter(): LatLng;
    }

    class Marker {
      constructor(opts: MarkerOptions);
    }

    class Polyline {
      constructor(opts: PolylineOptions);
    }

    namespace geometry {
      namespace spherical {
        function computeDistanceBetween(from: LatLng, to: LatLng): number;
        function computeHeading(from: LatLng, to: LatLng): number;
        function interpolate(from: LatLng, to: LatLng, fraction: number): LatLng;
        function computeOffset(from: LatLng, distance: number, heading: number): LatLng;
      }
    }

    enum MapTypeId {
      TERRAIN = 'terrain'
    }

    interface MapOptions {
      zoom?: number;
      center?: LatLng;
      mapTypeId?: MapTypeId;
      styles?: MapTypeStyle[];
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers?: MapTypeStyler[];
    }

    interface MapTypeStyler {
      color?: string;
    }

    interface MarkerOptions {
      position: LatLng;
      map: Map;
      title?: string;
      icon?: MarkerIcon;
    }

    interface MarkerIcon {
      url: string;
      scaledSize?: Size;
    }

    class Size {
      constructor(width: number, height: number);
    }

    interface PolylineOptions {
      path: LatLng[];
      geodesic?: boolean;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      map: Map;
    }
  }
}

export {};