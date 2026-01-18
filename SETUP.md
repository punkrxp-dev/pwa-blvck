# Configuração Técnica - PUNK | BLVCK

Este arquivo contém as instruções técnicas, arquitetura e processos de desenvolvimento para o projeto PUNK | BLVCK.

---

## ⟁ Tecnologias

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Glassmorphism
- **Audio**: Web Audio API (com fallbacks)
- **Performance**: Lazy loading + Caching + Error Boundaries
- **Security**: CSP + Sanitização + SafeImage component
- **Accessibility**: WCAG compliant + ARIA labels

## ⧇ Segurança

Este projeto implementa as melhores práticas de segurança:

- ⦿ **CSP (Content Security Policy)** completo
- ⦿ **Zero vulnerabilidades** conhecidas (npm audit)
- ⦿ **Sanitização** de todas as entradas
- ⦿ **SafeImage** component com fallbacks
- ⦿ **Error Boundaries** para crash prevention
- ⦿ **Memory leak protection**
- ⦿ **AudioContext** seguro com fallbacks

## ⧇ Arquitetura

```
⧉ components/
├── ErrorBoundary.tsx     # Global error handling
├── SafeImage.tsx         # Secure image loading
├── WeatherWidget.tsx     # Cached weather component
├── TimerWidget.tsx       # Audio-enabled timer
├── EventsWidget.tsx      # Next event teaser
├── AgendaWidget.tsx      # Training programs
├── Header.tsx           # Status header
├── Footer.tsx           # Contact footer
└── GlassCard.tsx        # Glassmorphism UI
⧉ utils/
└── logger.ts            # Production logging
⧉ hooks/
└── useGyroscope.ts      # Device orientation logic
```

## ⟁ Instalação e Execução

**Pré-requisitos:** Node.js 18+, Make (opcional)

### Usando Make (Recomendado)

```bash
# Clone o repositório
git clone <repository-url>
cd punk-blvck

# Setup completo (instala dependências)
make setup

# Desenvolvimento
make dev

# Build para produção
make build
```

### Usando NPM (Alternativo)

```bash
# Instale dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## ⦿ Comandos Make Disponíveis

| Comando | Descrição |
|---------|-----------|
| `make help` | Mostra todos os comandos disponíveis |
| `make install` | Instala dependências |
| `make dev` | Servidor de desenvolvimento |
| `make build` | Build otimizado para produção |
| `make audit` | Auditoria de segurança |
| `make lint` | Executa linting |
| `make format` | Formata código com Prettier |

## ◯ Configuração da API de Clima

1. **API Gratuita**: Cadastre-se em [OpenWeatherMap](https://openweathermap.org/)
2. **Configure variáveis**: Copie `env.example` para `.env`
3. **Adicione chave**: `VITE_OPENWEATHER_API_KEY=sua_chave_aqui`

⧉ **Guia completo**: Veja [WEATHER_API_SETUP.md](docs/WEATHER_API_SETUP.md) para instruções detalhadas.

## ⧇ Performance

- **Bundle Size**: ~500KB (Otimizado)
- **Build Time**: ~1.5s
- **Zero Layout Shift**: Otimizado para Core Web Vitals
- **Sincronização**: Localização via GPS com fallback imediato

## ◯ Acessibilidade

- ⦿ **WCAG 2.1 AA** compliant
- ⦿ **Screen reader** support
- ⦿ **Keyboard navigation** completa
- ⦿ **Focus management** adequado
- ⦿ **Color contrast** verificado

---

**NΞØ Protocol // Marketing na Blockchain**
