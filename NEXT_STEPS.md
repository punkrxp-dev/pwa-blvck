# PUNK | BLVCK - Próximas Ações (Roadmap)

Este documento centraliza as tarefas pendentes e melhorias planejadas para o projeto, garantindo conformidade e evolução contínua sob o **Protocolo NΞØ**.

## ⚖️ Conformidade Legal (LGPD)
- [ ] **Documentação:** Criar arquivos de Políticas de Privacidade e Termos de Uso adequados à LGPD.
- [ ] **Integração no Footer:** Adicionar links discretos (ex: "Privacidade", "Termos") no componente `Footer.tsx`.
- [ ] **Banner de Cookies:** Avaliar necessidade de um aviso de consentimento de cookies para conformidade plena.

## 🏢 Intranet / Hub de Conteúdo (Inside BLVCK)
- [ ] **Espaço de Conteúdo:** Criar uma área restrita (intranet) para membros.
- [ ] **Memórias & Eventos:** Implementar galeria para fotos do último evento e detalhes exclusivos das experiências passadas.
- [ ] **Blog Discreto:** Espaço para artigos detalhados sobre performance, estilo de vida e novidades da marca.

## 🚀 Infraestrutura e Deployment
- [ ] **Resolução de Permissões Git:** Corrigir erro 403 no `git push`.
    - Opção A: Validar credenciais locais do usuário `neomello`.
    - Opção B: Configurar remote via HTTPS com o Token disponível no `.env`.
- [ ] **Release Tagging:** Criar tag de virada de fase (ex: `v1.2.0-pwa-refined`) assim que o push for bem-sucedido.
- [ ] **Vercel/CI-CD:** Verificar se o build automático no Vercel está refletindo as mudanças de PostCSS/Tailwind recém-implementadas.

## 🎨 UI/UX Refinements
- [ ] **Validação de Imagens:** Monitorar o carregamento do novo teaser de eventos em dispositivos reais.
- [ ] **Timer/Chrono:** Testar feedback sonoro em iOS (safari requer interação prévia para liberar áudio).

---
*Gerado por Antigravity em 18 de Janeiro de 2026*
