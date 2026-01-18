# 🌤️ Configuração da API de Clima - PUNK | BLVCK

Este documento explica como configurar a API de clima com dados em tempo real baseados na localização GPS do usuário.

## 📋 Pré-requisitos

- Conta gratuita no [OpenWeatherMap](https://openweathermap.org/)
- Permissões de geolocalização habilitadas no navegador

## 🔧 Configuração

### 1. Cadastro no OpenWeatherMap

1. Acesse [https://openweathermap.org/](https://openweathermap.org/)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Após confirmar o email, faça login
4. Vá para [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys)
5. Copie sua API Key (chave gratuita)

### 2. Configuração das Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cp env.example .env
   ```

2. Edite o arquivo `.env` e adicione sua chave da API:
   ```env
   # OpenWeatherMap API Key (gratuita)
   VITE_OPENWEATHER_API_KEY=sua_api_key_aqui

   # Configurações opcionais
   VITE_WEATHER_UNITS=metric
   VITE_WEATHER_LANG=pt_br
   VITE_GEOLOCATION_TIMEOUT=10000
   VITE_WEATHER_CACHE_DURATION=30
   ```

### 3. Teste a Configuração

Execute o projeto e verifique se os dados do clima aparecem:

```bash
make dev
```

Abra o navegador em `http://localhost:3000` e permita a localização quando solicitado.

## 🌍 Como Funciona

### Geolocalização (GPS)
- Usa a **Geolocation API** do navegador
- Solicita permissão do usuário automaticamente
- Cache de localização por 1 hora
- Timeout configurável (padrão: 10 segundos)

### API de Clima
- **OpenWeatherMap API** (gratuita)
- Dados em tempo real baseados na localização
- Cache inteligente (30 minutos)
- Fallback automático para dados offline

### Reverse Geocoding
- Converte coordenadas GPS em nomes de cidades
- Usa **OpenStreetMap Nominatim** (gratuito)
- Nomes de cidades em português

## ⚙️ Configurações Disponíveis

| Variável | Descrição | Padrão | Valores |
|----------|-----------|---------|---------|
| `VITE_OPENWEATHER_API_KEY` | Chave da API OpenWeatherMap | - | String |
| `VITE_WEATHER_UNITS` | Unidades de temperatura | `metric` | `metric`, `imperial`, `kelvin` |
| `VITE_WEATHER_LANG` | Idioma dos dados | `pt_br` | `pt_br`, `en`, `es`, etc. |
| `VITE_GEOLOCATION_TIMEOUT` | Timeout GPS (ms) | `10000` | Número |
| `VITE_WEATHER_CACHE_DURATION` | Cache clima (min) | `30` | Número |

## 🔒 Segurança e Privacidade

### Dados Coletados
- **Localização GPS**: Apenas coordenadas latitude/longitude
- **Dados do clima**: Temperatura, umidade, vento, condições
- **Nenhum dado pessoal**: Não coletamos nomes, emails ou histórico

### Armazenamento Local
- Cache local no navegador (localStorage)
- Dados expirados automaticamente
- Não enviamos dados para servidores próprios

### Permissões
- Geolocalização solicitada apenas quando necessário
- Usuário pode negar permissão a qualquer momento
- Funciona com dados mockados se GPS indisponível

## 🚨 Troubleshooting

### "API Key não configurada"
- Verifique se o arquivo `.env` existe
- Confirme se a variável `VITE_OPENWEATHER_API_KEY` está definida
- Reinicie o servidor de desenvolvimento

### "Permissão de localização negada"
- Clique no ícone de localização 🔄 no widget de clima
- Permita localização nas configurações do navegador
- Verifique se o site usa HTTPS (requerido para GPS)

### "Erro de rede"
- Verifique conexão com internet
- API pode estar temporariamente indisponível
- Dados cached serão usados como fallback

### "Cidade não aparece"
- Problema de geocoding (OpenStreetMap)
- Coordenadas podem estar em área não mapeada
- Fallback mostra coordenadas numéricas

## 📊 Limites da API Gratuita

### OpenWeatherMap Free Tier
- **60 chamadas/minuto**
- **1.000.000 chamadas/mês**
- **Dados atuais + previsão 5 dias**
- **Sem dados históricos**

Se precisar de mais chamadas, considere o plano pago.

## 🔄 Atualização Manual

Para forçar atualização dos dados:

1. Clique no botão 🔄 (refresh) no widget de clima
2. Ou limpe o cache do navegador
3. Ou execute: `make clean` e `make dev`

## 📞 Suporte

Para problemas com APIs:
- [OpenWeatherMap Docs](https://openweathermap.org/api)
- [Geolocation API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [PUNK | BLVCK Issues](https://github.com/your-repo/issues)

---

**PUNK | BLVCK** — Dados precisos, experiência impecável. ⚡📍