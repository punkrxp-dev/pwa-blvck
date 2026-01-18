import { WeatherData } from '../types';
import logger from '../utils/logger';

// Interfaces para APIs externas
interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: number;
}

interface GeolocationError {
  code: number;
  message: string;
}

interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

interface ReverseGeocodeResponse {
  results: Array<{
    components: {
      city?: string;
      town?: string;
      village?: string;
      state?: string;
      country?: string;
    };
  }>;
}

// Configurações
const API_KEY = process.env.OPENWEATHER_API_KEY as string;
const UNITS = process.env.WEATHER_UNITS as string || 'metric';
const LANG = process.env.WEATHER_LANG as string || 'pt_br';
const GEOLOCATION_TIMEOUT = parseInt(process.env.GEOLOCATION_TIMEOUT as string) || 10000;
const CACHE_DURATION = parseInt(process.env.WEATHER_CACHE_DURATION as string) || 30;

// Chaves de cache
const LOCATION_CACHE_KEY = 'punk_blvck_location';
const WEATHER_CACHE_KEY = 'punk_blvck_weather';

class WeatherService {
  private geolocationWatchId: number | null = null;

  /**
   * Solicita permissão e obtém localização atual do usuário
   */
  async getCurrentLocation(): Promise<{ lat: number; lon: number; accuracy: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        logger.error('Geolocalização não suportada', {}, 'WeatherService');
        reject(new Error('Geolocalização não suportada neste navegador'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: 5 * 60 * 1000 // 5 minutos
      };

      navigator.geolocation.getCurrentPosition(
        async (position: GeolocationPosition) => {
          try {
            const location = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              accuracy: position.coords.accuracy
            };

            // Cache da localização
            this.cacheLocation(location);

            logger.info('Location obtained successfully', {
              lat: location.lat.toFixed(4),
              lon: location.lon.toFixed(4),
              accuracy: Math.round(location.accuracy)
            }, 'WeatherService');

            resolve(location);
          } catch (error) {
            logger.error('Erro ao processar localização', { error }, 'WeatherService');
            reject(error);
          }
        },
        (error: GeolocationError) => {
          logger.error('Erro de geolocalização', {
            code: error.code,
            message: error.message
          }, 'WeatherService');

          let errorMessage = 'Erro ao obter localização';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada pelo usuário';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível';
              break;
            case error.TIMEOUT:
              errorMessage = 'Timeout ao obter localização';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  /**
   * Obtém localização do cache ou fallback
   */
  getCachedLocation(): { lat: number; lon: number; accuracy: number } | null {
    try {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      // Cache válido por 1 hora
      if (Date.now() - timestamp > 60 * 60 * 1000) {
        localStorage.removeItem(LOCATION_CACHE_KEY);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  /**
   * Cache da localização
   */
  private cacheLocation(location: { lat: number; lon: number; accuracy: number }) {
    try {
      localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
        data: location,
        timestamp: Date.now()
      }));
    } catch (error) {
      logger.warn('Falha ao armazenar localização em cache', { error }, 'WeatherService');
    }
  }

  /**
   * Obtém nome da cidade através de coordenadas (reverse geocoding)
   * Usando OpenStreetMap Nominatim (gratuito)
   */
  async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'PUNK-BLVCK-App/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: any = await response.json();

      // Extrair cidade/estado do resultado
      const address = data.address || {};
      const city = address.city || address.town || address.village || address.municipality;
      const state = address.state;

      if (city && state) {
        return `${city}, ${state}`;
      } else if (city) {
        return city;
      } else if (state) {
        return state;
      } else {
        return data.display_name?.split(',')[0] || 'Localização desconhecida';
      }
    } catch (error) {
      logger.warn('Falha no geocoding reverso, usando coordenadas', { error }, 'WeatherService');
      return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }
  }

  /**
   * Busca dados do clima da OpenWeatherMap API
   */
  async fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
    // Forçar dados mockados em desenvolvimento para testar traduções
    if (!API_KEY || process.env.NODE_ENV === 'development') {
      if (!API_KEY) {
        logger.warn('Chave da API OpenWeather não configurada, usando dados mockados', {}, 'WeatherService');
      }
      return this.getMockWeatherData();
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;
      logger.debug('Fetching weather data', { url: url.replace(API_KEY, '[API_KEY]') }, 'WeatherService');

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: OpenWeatherResponse = await response.json();

      // Converter dados da API para nosso formato
      const weatherData: WeatherData = {
        temp: Math.round(data.main.temp),
        condition: this.translateWeatherCondition(data.weather[0].main, data.weather[0].description),
        city: data.name,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6) // m/s para km/h
      };

      logger.info('Weather data fetched successfully', {
        temp: weatherData.temp,
        condition: weatherData.condition,
        city: weatherData.city
      }, 'WeatherService');

      return weatherData;
    } catch (error) {
      logger.error('Falha ao buscar dados do clima', { error }, 'WeatherService');
      throw error;
    }
  }

  /**
   * Traduz condições do tempo da API para português
   */
  private translateWeatherCondition(main: string, description: string): string {
    // Traduções específicas para descrições comuns da API
    const descriptionTranslations: { [key: string]: string } = {
      'clear sky': 'céu limpo',
      'few clouds': 'poucas nuvens',
      'scattered clouds': 'nuvens dispersas',
      'broken clouds': 'nuvens quebradas',
      'overcast clouds': 'nublado',
      'light rain': 'chuva fraca',
      'moderate rain': 'chuva moderada',
      'heavy rain': 'chuva forte',
      'light intensity drizzle': 'garoa fraca',
      // Traduções específicas que a API pode retornar
      'Sunny': 'Ensolarado',
      'sunny': 'ensolarado',
      'clear': 'céu limpo',
      'clouds': 'nublado',
      'rain': 'chuva',
      'drizzle': 'garoa',
      'thunderstorm': 'tempestade',
      'snow': 'neve',
      'mist': 'névoa',
      'fog': 'neblina',
      'haze': 'neblina'
    };

    // Traduções baseadas no campo main da API
    const mainTranslations: { [key: string]: string } = {
      'Clear': 'Céu Limpo',
      'Clouds': 'Nublado',
      'Rain': 'Chuva',
      'Drizzle': 'Garoa',
      'Thunderstorm': 'Tempestade',
      'Snow': 'Neve',
      'Mist': 'Névoa',
      'Fog': 'Neblina',
      'Haze': 'Neblina',
      'Dust': 'Poeira',
      'Sand': 'Areia',
      'Ash': 'Cinzas',
      'Squall': 'Temporal',
      'Tornado': 'Tornado'
    };

    // Primeiro tenta traduzir pela descrição completa
    const lowerDescription = description.toLowerCase();
    if (descriptionTranslations[lowerDescription]) {
      return this.capitalizeFirstLetter(descriptionTranslations[lowerDescription]);
    }

    // Verificar se é uma condição simples que precisa ser traduzida
    const simpleCondition = description.toLowerCase();
    if (descriptionTranslations[simpleCondition]) {
      return this.capitalizeFirstLetter(descriptionTranslations[simpleCondition]);
    }

    // Depois tenta traduzir pelo campo main
    if (mainTranslations[main]) {
      return mainTranslations[main];
    }

    // Se já estiver em português, retorna como está
    if (description.includes(' ') && mainTranslations[main]) {
      return mainTranslations[main];
    }

    // Log para debug se não encontrou tradução
    console.warn(`Condição climática não traduzida: "${description}" (main: "${main}")`);

    // Capitalizar primeira letra se não encontrou tradução
    return this.capitalizeFirstLetter(description);
  }

  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Dados mockados para quando a API não estiver configurada
   */
  private getMockWeatherData(): WeatherData {
    const mockCities = [
      { city: 'Goiânia, GO', temp: 31, condition: 'Sunny', humidity: 42, windSpeed: 10 }, // Testar tradução
      { city: 'São Paulo, SP', temp: 28, condition: 'Nublado', humidity: 65, windSpeed: 15 },
      { city: 'Rio de Janeiro, RJ', temp: 32, condition: 'Ensolarado', humidity: 55, windSpeed: 12 },
      { city: 'Belo Horizonte, MG', temp: 29, condition: 'Parcialmente Nublado', humidity: 48, windSpeed: 8 }
    ];

    const randomCity = mockCities[Math.floor(Math.random() * mockCities.length)];
    return {
      temp: randomCity.temp,
      condition: randomCity.condition,
      city: randomCity.city,
      humidity: randomCity.humidity,
      windSpeed: randomCity.windSpeed
    };
  }

  /**
   * Obtém dados do clima com cache
   */
  async getWeatherData(): Promise<WeatherData> {
    // Verificar cache primeiro
    const cached = this.getCachedWeather();
    if (cached) {
      logger.debug('Using cached weather data', {}, 'WeatherService');
      return cached;
    }

    try {
      // Obter localização
      let location = this.getCachedLocation();

      if (!location) {
        logger.info('Requesting user location', {}, 'WeatherService');
        location = await this.getCurrentLocation();
      }

      // Buscar dados do clima
      const weatherData = await this.fetchWeatherData(location.lat, location.lon);

      // Tentar obter nome da cidade se não veio da API
      if (!weatherData.city || weatherData.city === '') {
        weatherData.city = await this.reverseGeocode(location.lat, location.lon);
      }

      // Cache dos dados
      this.cacheWeather(weatherData);

      return weatherData;
    } catch (error) {
      logger.error('Falha ao obter dados do clima', { error }, 'WeatherService');

      // Fallback para dados cached ou mock
      const cached = this.getCachedWeather();
      if (cached) {
        return cached;
      }

      return this.getMockWeatherData();
    }
  }

  /**
   * Obtém dados do clima do cache
   */
  getCachedWeather(): WeatherData | null {
    try {
      const cached = localStorage.getItem(WEATHER_CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const cacheDuration = CACHE_DURATION * 60 * 1000; // minutos para ms

      if (Date.now() - timestamp > cacheDuration) {
        localStorage.removeItem(WEATHER_CACHE_KEY);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  /**
   * Cache dos dados do clima
   */
  private cacheWeather(data: WeatherData) {
    try {
      localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      logger.warn('Falha ao armazenar dados do clima em cache', { error }, 'WeatherService');
    }
  }

  /**
   * Limpa todos os caches
   */
  clearCache() {
    try {
      localStorage.removeItem(LOCATION_CACHE_KEY);
      localStorage.removeItem(WEATHER_CACHE_KEY);
      logger.info('Weather cache cleared', {}, 'WeatherService');
    } catch (error) {
      logger.warn('Falha ao limpar cache do clima', { error }, 'WeatherService');
    }
  }

  /**
   * Verifica se a geolocalização está disponível
   */
  isGeolocationAvailable(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Solicita permissão de geolocalização
   */
  async requestGeolocationPermission(): Promise<boolean> {
    if (!this.isGeolocationAvailable()) {
      return false;
    }

    try {
      // Tentar obter localização para verificar permissão
      await this.getCurrentLocation();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Exportar instância singleton
export const weatherService = new WeatherService();
export default weatherService;