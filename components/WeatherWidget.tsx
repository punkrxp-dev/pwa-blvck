import React, { useState, useEffect, useCallback } from 'react';
import GlassCard from './GlassCard';
import SkeletonLoader from './SkeletonLoader';
import { Sun, MapPin, AlertCircle, Navigation, RefreshCw } from 'lucide-react';
import { WeatherData } from '../types';
import logger from '../utils/logger';
import weatherService from '../services/weatherService';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  const loadWeatherData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);
      setIsRefreshing(true);

      logger.debug('Carregando dados do clima', {}, 'WeatherWidget');

      const weatherData = await weatherService.getWeatherData();

      setWeather(weatherData);
      setLocationPermission(true);

      logger.info('Dados do clima carregados com sucesso', {
        temp: weatherData.temp,
        condition: weatherData.condition,
        city: weatherData.city
      }, 'WeatherWidget');

    } catch (err: any) {
      logger.error('Falha ao carregar dados do clima', { error: err.message }, 'WeatherWidget');

      const errorMessage = err.message || 'Erro ao carregar dados do clima';
      setError(errorMessage);

      // Verificar se é erro de permissão de localização
      if (errorMessage.includes('permissão') || errorMessage.includes('negada')) {
        setLocationPermission(false);
      } else {
        setLocationPermission(null);
      }

      // Tentar usar dados cached como fallback
      const cached = weatherService.getCachedWeather();
      if (cached) {
        setWeather(cached);
        logger.info('Usando dados do clima em cache como fallback', { temp: cached.temp }, 'WeatherWidget');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    logger.info('Atualização manual do clima solicitada', {}, 'WeatherWidget');
    // Limpar cache antes de recarregar
    weatherService.clearCache();
    loadWeatherData(false);
  }, [loadWeatherData]);

  const handleRequestLocation = useCallback(async () => {
    try {
      setError(null);
      logger.info('Solicitando permissão de localização', {}, 'WeatherWidget');

      const granted = await weatherService.requestGeolocationPermission();
      setLocationPermission(granted);

      if (granted) {
        await loadWeatherData(false);
      } else {
        setError('Permissão de localização necessária para dados precisos');
      }
    } catch (err: any) {
      logger.error('Falha na solicitação de permissão de localização', { error: err.message }, 'WeatherWidget');
      setError('Erro ao solicitar permissão de localização');
    }
  }, [loadWeatherData]);

  useEffect(() => {
    loadWeatherData();

    // Debug: adicionar função global para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      (window as any).clearWeatherCache = () => {
        weatherService.clearCache();
        loadWeatherData(false);
        console.log('Cache do clima limpo e dados recarregados');
      };
      console.log('💡 Debug: Use clearWeatherCache() no console para limpar cache');
    }
  }, [loadWeatherData]);

  return (
    <GlassCard span="col-1" className="bg-gradient-to-br from-white/[0.02] to-transparent">
      <div className="flex items-center justify-between text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5">
          <MapPin size={10} className="glow-orange text-[#FF5F1F]" />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase truncate max-w-[80px]" title={weather?.city || 'Carregando...'}>
            {weather?.city || 'CARREGANDO...'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {error && (
            <AlertCircle size={10} className="text-red-400" title={error} />
          )}
          {locationPermission === false && (
            <button
              onClick={handleRequestLocation}
              className="p-1 hover:text-[#FF5F1F] transition-colors"
              title="Permitir localização"
              aria-label="Permitir acesso à localização"
            >
              <Navigation size={10} />
            </button>
          )}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-1 hover:text-[#FF5F1F] transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
            title="Atualizar clima"
            aria-label="Atualizar dados do clima"
          >
            <RefreshCw size={10} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow py-2">
        {isLoading && !weather ? (
          <div className="flex flex-col items-center space-y-3">
            <SkeletonLoader className="h-12 w-16" />
            <SkeletonLoader className="h-3 w-12" />
          </div>
        ) : (
          <>
            <div className="relative">
              <h2 className="text-5xl font-black tracking-tighter leading-none italic">
                {weather?.temp ?? '--'}<span className="text-2xl align-top font-light ml-0.5">°</span>
              </h2>
              {isRefreshing && (
                <div className="absolute -top-1 -right-1">
                  <RefreshCw size={12} className="animate-spin text-[#FF5F1F]" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-black text-[#FF5F1F] uppercase tracking-[0.25em] mt-2 opacity-80">
              {weather?.condition ?? '---'}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
        <Sun size={16} className="text-[var(--text-muted)]" strokeWidth={1.5} />
        <div className="flex gap-3">
           <div className="flex flex-col items-end">
             <span className="text-[7px] font-bold opacity-20 uppercase">UMID.</span>
             <span className="text-[10px] font-black tabular-nums">{weather?.humidity ?? '0'}%</span>
           </div>
           <div className="flex flex-col items-end">
             <span className="text-[7px] font-bold opacity-20 uppercase">VENTO</span>
             <span className="text-[10px] font-black tabular-nums">{weather?.windSpeed ?? '0'}km</span>
           </div>
        </div>
      </div>

      {error && (
        <div className="mt-2 text-center">
          <p className="text-[8px] text-red-400 leading-tight" title={error}>
            {error.length > 30 ? `${error.substring(0, 27)}...` : error}
          </p>
        </div>
      )}
    </GlassCard>
  );
};

export default WeatherWidget;