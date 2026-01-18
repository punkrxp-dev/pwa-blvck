import React, { useState, useEffect, useCallback } from 'react';
import GlassCard from './GlassCard';
import SkeletonLoader from './SkeletonLoader';
import ModalLocationPermission from './ModalLocationPermission';
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
  const [showLocationModal, setShowLocationModal] = useState(false);

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

  const handleRequestLocation = useCallback(() => {
    logger.info('Abrindo modal de permissão de localização', {}, 'WeatherWidget');
    setShowLocationModal(true);
  }, []);

  const handleAllowLocation = useCallback(async () => {
    try {
      setShowLocationModal(false);
      setError(null);
      logger.info('Usuário permitiu localização, solicitando permissão nativa', {}, 'WeatherWidget');

      const granted = await weatherService.requestGeolocationPermission();
      setLocationPermission(granted);

      if (granted) {
        await loadWeatherData(false);
      } else {
        setError('Permissão de localização negada. Use o botão atualizar para tentar novamente.');
      }
    } catch (err: any) {
      logger.error('Falha na solicitação de permissão de localização', { error: err.message }, 'WeatherWidget');
      setError('Erro ao acessar localização. Verifique as permissões do navegador.');
    }
  }, [loadWeatherData]);

  const handleDenyLocation = useCallback(() => {
    logger.info('Usuário negou permissão de localização no modal', {}, 'WeatherWidget');
    setShowLocationModal(false);
    setError('Localização necessária para dados climáticos precisos. Use o botão atualizar para tentar novamente.');
  }, []);

  const handleCloseLocationModal = useCallback(() => {
    logger.info('Usuário fechou modal de permissão de localização', {}, 'WeatherWidget');
    setShowLocationModal(false);
  }, []);

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
        <div className="flex items-center gap-1.5 flex-1 min-w-0 mr-2">
          <MapPin size={14} className="glow-gold text-punk-gold shrink-0" />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase truncate" title={weather?.city || 'Carregando...'}>
            {(weather?.city?.split(',')[0] || 'CARREGANDO...')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {error && (
            <span title={error}>
              <AlertCircle size={14} className="text-red-400" />
            </span>
          )}
          {locationPermission === false && (
            <button
              onClick={handleRequestLocation}
              className="p-1.5 hover:text-punk-gold transition-colors"
              title="Permitir localização"
              aria-label="Permitir acesso à localização"
            >
              <Navigation size={14} />
            </button>
          )}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-1.5 hover:text-punk-gold transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
            title="Atualizar clima"
            aria-label="Atualizar dados do clima"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow py-1">
        {isLoading && !weather ? (
          <div className="flex flex-col items-center space-y-2">
            <SkeletonLoader className="h-10 w-14" />
            <SkeletonLoader className="h-2 w-10" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative">
              <h2 className="text-4xl font-black tracking-tighter leading-none italic">
                {weather?.temp ?? '--'}<span className="text-xl align-top font-light ml-0.5">°</span>
              </h2>
              {isRefreshing && (
                <div className="absolute -top-1 -right-1">
                  <RefreshCw size={12} className="animate-spin text-punk-gold" />
                </div>
              )}
            </div>
            <span className="text-[9px] font-black text-punk-gold uppercase tracking-[0.2em] mt-1.5 opacity-80">
              {weather?.condition ?? '---'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)] mt-auto bg-black/5 -mx-4 px-4 py-1.5">
        <div className="flex items-center gap-1.5 opacity-60">
          <Sun size={14} className="text-punk-gold" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{weather?.condition ?? 'CLEAN'}</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-400 opacity-60" />
            <span className="text-[12px] font-black tabular-nums">{weather?.humidity ?? '0'}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Navigation size={10} className="text-punk-steel rotate-45" />
            <span className="text-[12px] font-black tabular-nums">{weather?.windSpeed ?? '0'}km</span>
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

      <ModalLocationPermission
        isOpen={showLocationModal}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
        onClose={handleCloseLocationModal}
      />
    </GlassCard>
  );
};

export default WeatherWidget;