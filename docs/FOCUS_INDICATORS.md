# 🎯 Focus Indicators - Guia de Acessibilidade

## 📋 Visão Geral

Os indicadores de foco foram implementados para melhorar a acessibilidade do PUNK | BLVCK, permitindo que usuários que navegam com teclado vejam claramente qual elemento está focado.

## 🎨 Estilos Implementados

### **Indicadores Globais**
```css
:focus-visible {
  outline: 2px solid var(--punk-orange);
  outline-offset: 2px;
  border-radius: 0.5rem;
}
```

### **Botões Específicos**
```css
button:focus-visible,
[role="button"]:focus-visible {
  outline: 2px solid var(--punk-orange);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(255, 95, 31, 0.1);
}
```

### **Links**
```css
a:focus-visible {
  outline: 2px solid var(--punk-orange);
  outline-offset: 2px;
  border-radius: 0.25rem;
}
```

### **Formulários**
```css
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--punk-orange);
  outline-offset: 2px;
  border-radius: 0.375rem;
  box-shadow: 0 0 0 4px rgba(255, 95, 31, 0.1);
}
```

## 🧪 Como Testar

### **Navegação por Teclado**
1. **Tab**: Move para o próximo elemento focável
2. **Shift + Tab**: Move para o elemento anterior
3. **Enter/Space**: Ativa botões e links
4. **Arrow Keys**: Navega em listas e carrosséis

### **Elementos Testáveis**
- ✅ **Theme Toggle** (canto superior direito)
- ✅ **Botões do Timer** (play/pause/reset)
- ✅ **Botões do Clima** (atualizar/localização)
- ✅ **Controles do Instagram** (setas de navegação)
- ✅ **Botões do PWA** (instalar/fechar)

### **Verificação Visual**
- **Cor**: Outline laranja (#FF5F1F)
- **Espessura**: 2px solid
- **Offset**: 2px do elemento
- **Shadow**: Para botões (rgba(255, 95, 31, 0.1))

## ♿ Benefícios de Acessibilidade

### **WCAG 2.1 Compliance**
- **2.4.7 Focus Visible**: Indicadores visuais claros
- **2.4.3 Focus Order**: Ordem lógica de navegação
- **1.4.11 Non-text Contrast**: Contraste adequado

### **Experiência do Usuário**
- **Navegação eficiente** com teclado
- **Feedback visual** claro
- **Inclusão** para usuários com deficiências motoras
- **Consistência** em todos os dispositivos

## 🔧 Implementação Técnica

### **Tecnologia Usada**
- **CSS**: `:focus-visible` para foco programático
- **Variáveis CSS**: `var(--punk-orange)` para consistência
- **Responsive**: Adapta em diferentes tamanhos de tela

### **Compatibilidade**
- ✅ **Chrome/Edge**: Suporte nativo
- ✅ **Firefox**: Suporte nativo
- ✅ **Safari**: Suporte nativo
- ✅ **Mobile**: Funciona com navegação touch

### **Performance**
- **CSS-only**: Sem JavaScript adicional
- **Leve**: Mínimo impacto na performance
- **Cacheable**: Parte do CSS principal

## 📱 Teste em Dispositivos

### **Desktop**
1. Abra o app no navegador
2. Pressione **Tab** para navegar
3. Verifique indicadores visuais

### **Mobile**
1. Use navegador mobile (Chrome/Safari)
2. Toque em elementos para foco
3. Verifique indicadores touch

### **Screen Readers**
1. Use NVDA/JAWS (Windows) ou VoiceOver (Mac)
2. Navegue com teclado
3. Verifique anúncios de elementos

## 🚀 Melhorias Futuras

### **Avançadas**
- **Focus Traps** em modais
- **Skip Links** para navegação rápida
- **Focus Management** em SPAs

### **Customização**
- **Themes**: Indicadores adaptáveis ao tema
- **Animations**: Transições suaves nos indicadores
- **Sizes**: Indicadores adaptáveis ao zoom

---

**🎯 Status**: Focus indicators totalmente implementados e testáveis!