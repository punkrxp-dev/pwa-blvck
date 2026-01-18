# Configuração de Vídeos Autenticados - Cloudinary

Este guia explica como configurar os vídeos do Cloudinary para funcionar de forma autenticada via API route.

## ⧉ Por que usar API route?

O Cloudinary pode bloquear acesso direto aos vídeos por questões de segurança e bandwidth. A solução é criar uma API route no Vercel que:
- Autentica as requisições usando suas credenciais
- Faz proxy dos vídeos de forma segura
- Adiciona cache para melhor performance

## ⧗ Configuração Local

1. **Obtenha suas credenciais do Cloudinary**:
   - Acesse: https://cloudinary.com/console
   - Copie seu `API Key` e `API Secret`

2. **Configure o arquivo `.env`**:
   ```bash
   CLOUDINARY_API_KEY=seu_api_key_aqui
   CLOUDINARY_API_SECRET=seu_api_secret_aqui
   ```

3. **Teste localmente**:
   ```bash
   npm run dev
   ```

## ⟁ Configuração na Vercel

### Passo 1: Adicionar Variáveis de Ambiente

1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `CLOUDINARY_API_KEY` | Seu API Key | Production, Preview, Development |
| `CLOUDINARY_API_SECRET` | Seu API Secret | Production, Preview, Development |

### Passo 2: Redeploy

Após adicionar as variáveis, faça um novo deploy:
- Via Git: Faça um novo commit e push
- Via Dashboard: Clique em "Redeploy" no último deployment

## ⧇ Como Funciona

### Fluxo de Requisição

```
Usuário clica no programa
    ↓
Frontend solicita: /api/video?video=v1768730141/hyrox_ebkdrr.mp4
    ↓
API route autentica com Cloudinary
    ↓
Cloudinary retorna vídeo autenticado
    ↓
API faz proxy do vídeo para o usuário
```

### Estrutura de Arquivos

```
api/
└── video.ts          # API route para proxy de vídeos

components/
├── AgendaWidget.tsx  # Lista de programas com vídeos
└── ProgramVideoModal.tsx  # Modal para exibir vídeos
```

## ⦿ Troubleshooting

### Vídeo não carrega

1. **Verifique as variáveis de ambiente**:
   - Confirme que `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET` estão configuradas
   - Certifique-se de que não há espaços extras

2. **Verifique os logs da Vercel**:
   - Acesse: Deployments → [Seu Deploy] → Functions
   - Procure por erros na função `/api/video`

3. **Teste a API diretamente**:
   ```
   https://seu-dominio.vercel.app/api/video?video=v1768730141/hyrox_ebkdrr.mp4
   ```

### Erro 500

- Verifique se as credenciais do Cloudinary estão corretas
- Confirme que o vídeo existe no Cloudinary

### Erro 400

- Verifique se o parâmetro `video` está sendo passado corretamente
- Formato esperado: `v[timestamp]/[public_id].mp4`

## ◯ Performance

A API route inclui:
- **Cache headers**: `max-age=31536000` (1 ano)
- **Immutable**: Vídeos não mudam após upload
- **Streaming**: Vídeos são transmitidos diretamente (não carregados na memória)

---

**PUNK | BLVCK // PRESENCE IS THE NEW POWER**
