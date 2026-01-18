# Makefile para PUNK | BLVCK
# Presence is the new power

# Incluir configurações adicionais
include .makefile

.PHONY: help install dev build preview clean lint format test audit docs serve deploy backup health status

# Variáveis
NODE_MODULES_EXISTS := $(shell test -d node_modules && echo 1 || echo 0)
DIST_EXISTS := $(shell test -d dist && echo 1 || echo 0)

# Comando padrão
help: ## Mostra esta ajuda
	$(call show_banner)
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)💡 Dica: Use 'make <comando>' para executar$(NC)"

# Instalação e dependências
install: ## Instala todas as dependências
	@echo "$(BLUE)📦 Instalando dependências...$(NC)"
	@if [ $(NODE_MODULES_EXISTS) -eq 1 ]; then \
		echo "$(YELLOW)⚠️  node_modules já existe. Pulando instalação.$(NC)"; \
	else \
		npm install; \
		echo "$(GREEN)✅ Dependências instaladas com sucesso!$(NC)"; \
	fi

install-ci: ## Instala dependências para CI (sem devDependencies)
	@echo "$(BLUE)📦 Instalando dependências para CI...$(NC)"
	npm ci --only=production

# Desenvolvimento
dev: check-deps ## Inicia servidor de desenvolvimento
	@echo "$(BLUE)🚀 Iniciando servidor de desenvolvimento...$(NC)"
	@echo "$(YELLOW)📱 Acesse: http://localhost:3000$(NC)"
	npm run dev

# Build e produção
build: check-deps clean ## Cria build otimizado para produção
	@echo "$(BLUE)🔨 Criando build de produção...$(NC)"
	npm run build
	@echo "$(GREEN)✅ Build concluído! Arquivos em ./dist/$(NC)"
	@ls -la dist/

preview: build ## Preview do build de produção localmente
	@echo "$(BLUE)👀 Iniciando preview do build...$(NC)"
	@echo "$(YELLOW)📱 Acesse: http://localhost:4173$(NC)"
	npm run preview

# Qualidade de código
lint: check-deps ## Executa linting do código
	@echo "$(BLUE)🔍 Executando linting...$(NC)"
	@if command -v eslint >/dev/null 2>&1; then \
		npx eslint . --ext .ts,.tsx,.js,.jsx; \
		echo "$(GREEN)✅ Linting concluído!$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  ESLint não encontrado. Instalando temporariamente...$(NC)"; \
		npx eslint . --ext .ts,.tsx,.js,.jsx || echo "$(RED)❌ Erro no linting$(NC)"; \
	fi

format: check-deps ## Formata código com Prettier
	@echo "$(BLUE)💅 Formatando código...$(NC)"
	@if command -v prettier >/dev/null 2>&1; then \
		npx prettier --write .; \
		echo "$(GREEN)✅ Código formatado!$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Prettier não encontrado. Instalando temporariamente...$(NC)"; \
		npx prettier --write .; \
	fi

type-check: check-deps ## Verifica tipos TypeScript
	@echo "$(BLUE)🔍 Verificando tipos TypeScript...$(NC)"
	npx tsc --noEmit
	@echo "$(GREEN)✅ Tipos verificados!$(NC)"

# Segurança
audit: check-deps ## Executa auditoria de segurança das dependências
	@echo "$(BLUE)🔒 Executando auditoria de segurança...$(NC)"
	npm audit
	@echo "$(GREEN)✅ Auditoria concluída!$(NC)"

audit-fix: check-deps ## Corrige vulnerabilidades automaticamente
	@echo "$(BLUE)🔧 Corrigindo vulnerabilidades...$(NC)"
	npm audit fix
	@echo "$(GREEN)✅ Correções aplicadas!$(NC)"

# Limpeza
clean: ## Remove arquivos de build e cache
	@echo "$(BLUE)🧹 Limpando arquivos...$(NC)"
	@if [ $(DIST_EXISTS) -eq 1 ]; then \
		rm -rf dist/; \
		echo "$(GREEN)✅ Pasta dist/ removida$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Pasta dist/ não encontrada$(NC)"; \
	fi
	rm -rf .vite/ node_modules/.vite/
	@echo "$(GREEN)✅ Cache limpo!$(NC)"

clean-all: clean ## Limpa tudo incluindo node_modules
	@echo "$(BLUE)🧹 Limpando tudo...$(NC)"
	rm -rf node_modules/ package-lock.json
	@echo "$(GREEN)✅ Tudo limpo! Execute 'make install' para reinstalar$(NC)"

# Testes (se houver)
test: check-deps ## Executa testes (se configurados)
	@echo "$(BLUE)🧪 Executando testes...$(NC)"
	@if [ -f "jest.config.js" ] || [ -f "jest.config.ts" ] || grep -q '"test"' package.json; then \
		npm test; \
	else \
		echo "$(YELLOW)⚠️  Nenhum framework de teste configurado$(NC)"; \
	fi

test-watch: check-deps ## Executa testes em modo watch
	@echo "$(BLUE)👀 Executando testes em modo watch...$(NC)"
	npm run test:watch || npm test -- --watch

# Documentação
docs: ## Abre documentação
	@echo "$(BLUE)📖 Abrindo documentação...$(NC)"
	@if command -v open >/dev/null 2>&1; then \
		open README.md; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open README.md; \
	else \
		echo "$(YELLOW)📄 Leia o README.md para documentação$(NC)"; \
	fi

# Servidor local
serve: build ## Serve arquivos de produção localmente
	@echo "$(BLUE)🌐 Servindo arquivos de produção...$(NC)"
	@if command -v python3 >/dev/null 2>&1; then \
		cd dist && python3 -m http.server 8080; \
	elif command -v python >/dev/null 2>&1; then \
		cd dist && python -m http.server 8080; \
	else \
		echo "$(RED)❌ Python não encontrado. Instale Python ou use 'make preview'$(NC)"; \
		exit 1; \
	fi

# Deploy (placeholder - configure conforme necessário)
deploy: build ## Deploy para produção (configure conforme necessário)
	@echo "$(BLUE)🚀 Fazendo deploy...$(NC)"
	@echo "$(YELLOW)⚠️  Deploy não configurado. Configure este comando conforme sua plataforma.$(NC)"
	@echo "$(YELLOW)💡 Exemplos: Vercel, Netlify, GitHub Pages, etc.$(NC)"
	@echo "$(GREEN)✅ Build pronto em ./dist/$(NC)"

# Utilitários
check-deps: ## Verifica se dependências estão instaladas
	@if [ $(NODE_MODULES_EXISTS) -eq 0 ]; then \
		echo "$(RED)❌ Dependências não encontradas!$(NC)"; \
		echo "$(YELLOW)💡 Execute: make install$(NC)"; \
		exit 1; \
	fi

setup-weather: ## Configura API de clima (cria .env se não existir)
	@echo "$(BLUE)🌤️ Configurando API de clima...$(NC)"
	@if [ ! -f ".env" ]; then \
		cp env.example .env; \
		echo "$(GREEN)✅ Arquivo .env criado a partir de env.example$(NC)"; \
		echo "$(YELLOW)⚠️  Edite o arquivo .env com sua chave da OpenWeatherMap API$(NC)"; \
		echo "$(BLUE)📖 Leia: WEATHER_API_SETUP.md para instruções completas$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Arquivo .env já existe$(NC)"; \
	fi

check-weather: ## Verifica configuração da API de clima
	@echo "$(BLUE)🌤️ Verificando configuração de clima...$(NC)"
	@if [ ! -f ".env" ]; then \
		echo "$(RED)❌ Arquivo .env não encontrado$(NC)"; \
		echo "$(YELLOW)💡 Execute: make setup-weather$(NC)"; \
		exit 1; \
	fi
	@if ! grep -q "VITE_OPENWEATHER_API_KEY" .env 2>/dev/null; then \
		echo "$(RED)❌ VITE_OPENWEATHER_API_KEY não configurada$(NC)"; \
		echo "$(YELLOW)💡 Edite o arquivo .env$(NC)"; \
		exit 1; \
	fi
	@if grep -q "your_openweather_api_key_here" .env 2>/dev/null; then \
		echo "$(RED)❌ API key ainda não configurada (valor padrão)$(NC)"; \
		echo "$(YELLOW)💡 Substitua 'your_openweather_api_key_here' pela sua chave real$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✅ API de clima configurada corretamente!$(NC)"

size: build ## Mostra tamanho do bundle
	@echo "$(BLUE)📊 Analisando tamanho do bundle...$(NC)"
	@npx vite-bundle-analyzer dist/assets/*.js || echo "$(YELLOW)⚠️  Instale vite-bundle-analyzer para análise detalhada$(NC)"
	@du -sh dist/
	@find dist/ -name "*.js" -exec du -sh {} \;

status: ## Mostra status completo do projeto
	$(call show_banner)
	$(call show_status)

info: status ## Alias para status (compatibilidade)

health: ## Verifica saúde do projeto
	$(call health_check)

backup: ## Cria backup de arquivos importantes
	$(call backup_files)

# Desenvolvimento rápido
setup: install ## Configuração completa para desenvolvimento
	@echo "$(BLUE)⚡ Configuração completa concluída!$(NC)"
	@echo "$(GREEN)🚀 Execute 'make dev' para iniciar$(NC)"

# CI/CD
ci: install-ci lint type-check test build ## Pipeline completo de CI
	@echo "$(BLUE)🔄 Executando pipeline CI...$(NC)"
	@echo "$(GREEN)✅ CI concluído com sucesso!$(NC)"

# Atalhos convenientes
b: build ## Alias para build
d: dev ## Alias para dev
c: clean ## Alias para clean
i: install ## Alias para install