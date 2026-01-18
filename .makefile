# Arquivo de configuração adicional para Makefile
# Este arquivo contém configurações específicas do projeto

# Configurações do projeto
PROJECT_NAME := PUNK | BLVCK
PROJECT_VERSION := $(shell grep '"version"' package.json | cut -d'"' -f4)
NODE_VERSION := $(shell node --version)
NPM_VERSION := $(shell npm --version)

# Cores ANSI para output colorido
RESET := \033[0m
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
PURPLE := \033[0;35m
CYAN := \033[0;36m
WHITE := \033[1;37m

# Emoji para melhor visualização
CHECK := ✅
CROSS := ❌
WARNING := ⚠️
INFO := ℹ️
GEAR := ⚙️
ROCKET := 🚀
CLEAN := 🧹
PACKAGE := 📦
LOCK := 🔒
TEST := 🧪
DOCS := 📖
BUILD := 🔨
EYE := 👀

# Configurações de build
BUILD_DIR := dist
CACHE_DIR := .vite
NODE_MODULES := node_modules
SOURCE_DIR := src

# Portas padrão
DEV_PORT := 3000
PREVIEW_PORT := 4173
SERVE_PORT := 8080

# Configurações de CI/CD
CI_NODE_MODULES_EXISTS := $(shell test -d $(NODE_MODULES) && echo 1 || echo 0)
CI_BUILD_EXISTS := $(shell test -d $(BUILD_DIR) && echo 1 || echo 0)

# URLs importantes
DEV_URL := http://localhost:$(DEV_PORT)
PREVIEW_URL := http://localhost:$(PREVIEW_PORT)
SERVE_URL := http://localhost:$(SERVE_PORT)

# Configurações de qualidade de código
HAS_ESLINT := $(shell command -v eslint >/dev/null 2>&1 && echo 1 || echo 0)
HAS_PRETTIER := $(shell command -v prettier >/dev/null 2>&1 && echo 0 || echo 0)
HAS_JEST := $(shell test -f jest.config.js -o -f jest.config.ts && echo 1 || echo 0)

# Configurações de deploy (personalize conforme necessário)
DEPLOY_PLATFORM := vercel  # Opções: vercel, netlify, github-pages, custom
DEPLOY_COMMAND := npx vercel --prod

# Configurações de análise de bundle
BUNDLE_ANALYZER := vite-bundle-analyzer
HAS_BUNDLE_ANALYZER := $(shell command -v $(BUNDLE_ANALYZER) >/dev/null 2>&1 && echo 1 || echo 0)

# Configurações de documentação
README_FILE := README.md
CHANGELOG_FILE := CHANGELOG.md
DOCS_DIR := docs

# Configurações de backup
BACKUP_DIR := .backup
BACKUP_FILES := $(README_FILE) $(CHANGELOG_FILE) package.json tsconfig.json vite.config.ts

# Função para verificar se comando existe
define check_command
	@if ! command -v $(1) >/dev/null 2>&1; then \
		echo "$(RED)$(CROSS) Comando '$(1)' não encontrado$(RESET)"; \
		echo "$(YELLOW)$(INFO) Instale $(1) ou verifique seu PATH$(RESET)"; \
		exit 1; \
	fi
endef

# Função para mostrar banner
define show_banner
	@echo "$(BLUE)╔══════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(BLUE)║$(RESET) $(PURPLE)$(PROJECT_NAME)$(RESET) $(CYAN)v$(PROJECT_VERSION)$(RESET)$(BLUE)                                ║$(RESET)"
	@echo "$(BLUE)║$(RESET) $(WHITE)'Presence is the new power'$(RESET)$(BLUE)                              ║$(RESET)"
	@echo "$(BLUE)╚══════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
endef

# Função para mostrar status
define show_status
	@echo "$(BLUE)$(INFO) Status do projeto:$(RESET)"
	@echo "  $(CYAN)Node.js:$(RESET) $(NODE_VERSION)"
	@echo "  $(CYAN)NPM:$(RESET) $(NPM_VERSION)"
	@echo "  $(CYAN)Dependências:$(RESET) $(if $(filter 1,$(CI_NODE_MODULES_EXISTS)),$(GREEN)$(CHECK) Instaladas$(RESET),$(RED)$(CROSS) Faltando$(RESET))"
	@echo "  $(CYAN)Build:$(RESET) $(if $(filter 1,$(CI_BUILD_EXISTS)),$(GREEN)$(CHECK) Pronto$(RESET),$(RED)$(CROSS) Pendente$(RESET))"
	@echo "  $(CYAN)ESLint:$(RESET) $(if $(filter 1,$(HAS_ESLINT)),$(GREEN)$(CHECK) Disponível$(RESET),$(YELLOW)$(WARNING) Não encontrado$(RESET))"
	@echo "  $(CYAN)Prettier:$(RESET) $(if $(filter 0,$(HAS_PRETTIER)),$(GREEN)$(CHECK) Disponível$(RESET),$(YELLOW)$(WARNING) Não encontrado$(RESET))"
	@echo ""
endef

# Função para backup de arquivos importantes
define backup_files
	@echo "$(BLUE)$(GEAR) Criando backup de arquivos importantes...$(RESET)"
	@mkdir -p $(BACKUP_DIR)
	@cp -r $(BACKUP_FILES) $(BACKUP_DIR)/ 2>/dev/null || true
	@echo "$(GREEN)$(CHECK) Backup criado em $(BACKUP_DIR)/"
endef

# Função para verificar saúde do projeto
define health_check
	@echo "$(BLUE)$(GEAR) Executando verificação de saúde...$(RESET)"
	@if [ $(CI_NODE_MODULES_EXISTS) -eq 0 ]; then \
		echo "$(RED)$(CROSS) Dependências não instaladas$(RESET)"; \
		exit 1; \
	fi
	@if [ $(CI_BUILD_EXISTS) -eq 0 ]; then \
		echo "$(YELLOW)$(WARNING) Build não encontrado$(RESET)"; \
	fi
	@echo "$(GREEN)$(CHECK) Projeto saudável!$(RESET)"
endef