import * as React from 'react';
import { ErrorInfo, ReactNode } from 'react';
import GlassCard from './GlassCard';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import logger from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para que a próxima renderização mostre a UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro
    logger.error('ErrorBoundary capturou um erro', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    }, 'ErrorBoundary');

    // Callback opcional para tratamento adicional
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    logger.info('Usuário tentou refazer após erro', {}, 'ErrorBoundary');
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    logger.info('Usuário voltou para home após erro', {}, 'ErrorBoundary');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback customizada
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de fallback padrão
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)]">
          <GlassCard className="max-w-md w-full text-center">
            <div className="flex flex-col items-center space-y-4">
              {/* Ícone de erro */}
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-400" />
              </div>

              {/* Título e mensagem */}
              <div className="space-y-2">
                <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-wider">
                  Oops! Algo deu errado
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Desculpe pelo inconveniente. Ocorreu um erro inesperado, mas não se preocupe - isso não afetou seus dados.
                </p>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-punk-gold text-punk-black rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-punk-gold/90 transition-colors active:scale-95"
                >
                  <RefreshCw size={14} />
                  Tentar Novamente
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--glass-bg-light)] border border-[var(--glass-border-light)] text-[var(--text-primary)] rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[var(--bg-secondary)] transition-colors active:scale-95"
                >
                  <Home size={14} />
                  Voltar ao Início
                </button>
              </div>

              {/* Detalhes técnicos (apenas em desenvolvimento) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="w-full mt-4 text-left">
                  <summary className="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] transition-colors">
                    Detalhes técnicos (desenvolvimento)
                  </summary>
                  <div className="mt-2 p-3 bg-black/20 rounded-lg text-xs font-mono text-red-300 overflow-auto max-h-32">
                    <div className="font-bold mb-1">Erro:</div>
                    <div className="mb-2">{this.state.error.message}</div>
                    {this.state.error.stack && (
                      <>
                        <div className="font-bold mb-1">Stack:</div>
                        <pre className="whitespace-pre-wrap text-[10px]">{this.state.error.stack}</pre>
                      </>
                    )}
                  </div>
                </details>
              )}
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;