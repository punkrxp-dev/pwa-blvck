
export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'run' | 'training' | 'social';
}

export interface WeatherData {
  temp: number;
  condition: string;
  city: string;
  humidity: number;
  windSpeed: number;
}

export interface LocationData {
  lat: number;
  lon: number;
  accuracy: number;
  city?: string;
  country?: string;
}

export interface WeatherAPIConfig {
  apiKey: string;
  units: 'metric' | 'imperial' | 'kelvin';
  lang: string;
  cacheDuration: number;
  geolocationTimeout: number;
}
