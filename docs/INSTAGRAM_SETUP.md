# 📸 Configuração do Instagram - PUNK | BLVCK

Este guia explica como configurar e atualizar as imagens do Instagram no carrossel interativo do PUNK | BLVCK.

## 🎯 Visão Geral

O componente `CommunityInstagramWidget` exibe um carrossel rotativo de posts do Instagram **sem necessidade de API**. As imagens são públicas e acessíveis diretamente via URLs.

## 📋 Estrutura dos Dados

Cada post do Instagram é representado por um objeto com as seguintes propriedades:

```typescript
{
  id: number,              // ID único do post
  imageUrl: string,        // URL direta da imagem
  likes: number,          // Número de curtidas
  comments: number,       // Número de comentários
  caption: string,        // Caption/legenda em destaque
  alt: string            // Texto alternativo para acessibilidade
}
```

## 🔄 Como Atualizar as Imagens

### 1. Localizar o Arquivo

Edite o arquivo: `src/components/CommunityInstagramWidget.tsx`

### 2. Encontrar o Array `instagramPosts`

```typescript
const instagramPosts = [
  // Posts atuais aqui...
];
```

### 3. Obter URLs das Imagens

#### Método 1: URL Direta do Instagram

1. Abra o post no Instagram
2. Clique com botão direito na imagem
3. "Copiar endereço da imagem"
4. Use a URL copiada

#### Método 2: URL do Unsplash (Fallback)

Use imagens do [Unsplash](https://unsplash.com) com temas fitness:

```javascript
imageUrl: 'https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&q=80&w=800&h=600'
```

### 4. Atualizar Estatísticas

```javascript
likes: 247,      // Número real de curtidas
comments: 12,    // Número real de comentários
```

### 5. Criar Captions Impactantes
```javascript
caption: 'FORÇA COM MÉTODO'  // Use frases do manifesto
```

## 🎨 Exemplos de Configuração

### Post Atual (Exemplo Completo)

```javascript
{
  id: 1,
  imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800&h=600',
  likes: 247,
  comments: 12,
  caption: 'FORÇA COM MÉTODO',
  alt: 'Treino intenso na academia PUNK BLVCK'
}
```

### Posts Sugeridos para @PUNK.BLVCK

```javascript
const instagramPosts = [
  {
    id: 1,
    imageUrl: '[URL_REAL_DO_INSTAGRAM]',
    likes: 312,
    comments: 18,
    caption: 'FORÇA COM MÉTODO',
    alt: 'Treino de musculação intensa'
  },
  {
    id: 2,
    imageUrl: '[URL_REAL_DO_INSTAGRAM]',
    likes: 289,
    comments: 15,
    caption: 'PRESENCE IS POWER',
    alt: 'Equipe PUNK BLVCK em ação'
  },
  {
    id: 3,
    imageUrl: '[URL_REAL_DO_INSTAGRAM]',
    likes: 445,
    comments: 22,
    caption: 'FORÇA COM RESULTADOS',
    alt: 'Transformação física impressionante'
  },
  {
    id: 4,
    imageUrl: '[URL_REAL_DO_INSTAGRAM]',
    likes: 198,
    comments: 9,
    caption: 'LUXURY FITNESS',
    alt: 'Ambiente sofisticado da academia'
  }
];
```

## ⚙️ Configurações do Carrossel

### Tempo de Rotação

```typescript
const ROTATION_TIME = 6000; // 6 segundos
```

### Número Máximo de Posts
```typescript
const MAX_POSTS = 4; // Recomendado: 3-5 posts
```

## 🔧 Funcionalidades Técnicas

### Auto-Rotação

- **Intervalo**: 6 segundos entre transições
- **Pausa**: Para quando mouse sobre o componente
- **Loop**: Navegação circular infinita

### Navegação Manual

- **Botões**: Anterior/Próximo aparecem no hover
- **Indicadores**: Dots para ir diretamente a um post
- **Acessibilidade**: Labels ARIA completos

### Performance

- **Lazy Loading**: Imagens carregam sob demanda
- **Fallback**: Imagem padrão se URL falhar
- **Cache**: Service Worker armazena imagens

## 🚨 Solução de Problemas

### Imagem não Carrega

```javascript
onError={(e) => {
  // Fallback automático
  (e.target as HTMLImageElement).src = 'fallback-image.jpg';
}}
```

### Links do Instagram Quebrados

- **Solução**: Use URLs do Unsplash como fallback
- **Verificação**: Teste URLs em navegação anônima
- **Alternativa**: Use CDN próprio para imagens

### Estatísticas Desatualizadas

- **Atualização**: Edite manualmente likes/comments
- **Automação**: Considere script para buscar dados reais

## 📊 Métricas de Engajamento

### Posições Estratégicas

1. **Post 1**: Mais visual (primeira impressão)
2. **Post 2**: Mais engajador (alta interação)
3. **Post 3**: Mais impactante (transformação)
4. **Post 4**: Call-to-action (ambiente sofisticado)

### Captions por Posição

- **Posição 1**: "FORÇA COM MÉTODO" (introdução)
- **Posição 2**: "PRESENCE IS POWER" (filosofia)
- **Posição 3**: "FORÇA COM RESULTADOS" (resultado)
- **Posição 4**: "LUXURY FITNESS" (diferencial)

## 🔄 Processo de Atualização

### Checklist de Atualização

- [ ] Obter URLs das novas imagens
- [ ] Verificar estatísticas atuais
- [ ] Criar captions impactantes
- [ ] Testar carregamento das imagens
- [ ] Build e deploy
- [ ] Verificar no dispositivo móvel

### Frequência Recomendada
- **Semanal**: Para manter conteúdo fresco
- **Imediata**: Após posts importantes
- **Sazonal**: Para campanhas especiais

## 🎯 Próximos Passos

### Melhorias Futuras
- **API Instagram**: Para dados reais automatizados
- **Stories**: Integração com stories destacados
- **Vídeos**: Suporte a posts em vídeo
- **Analytics**: Tracking de engajamento

### Integrações Possíveis
- **Instagram Business**: API oficial para métricas reais
- **Meta Pixel**: Tracking de conversões
- **Social Proof**: Badges de verificação

---

**Dica**: Mantenha sempre 4 posts para experiência otimizada!

**Para dúvidas**: Verifique o console do navegador para logs de debug.

<div align="center">

**Author:** NEØ Protocol  
**Last Updated:** 2026-01-17  
  <i>"Expand until silence becomes structure."</i>
</div>