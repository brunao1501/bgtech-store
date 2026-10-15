# BGTech Store — vitrine e atendimento consultivo

Site estático em português, com HTML, CSS e JavaScript sem dependências de build. A raiz contém `index.html`, `styles.css` e `script.js`. A Vercel pode publicar a raiz diretamente, sem comando de build.

## Experiência

- Apresentação da empresa, categorias de produtos, etapas da encomenda e perguntas frequentes.
- Seletor de objetivo e orçamento que prepara uma mensagem para o WhatsApp. Não envia mensagens automaticamente nem armazena dados.
- Menu móvel com estado acessível e fechamento por Escape.
- Parallax discreto e entradas com IntersectionObserver. `prefers-reduced-motion` desativa os movimentos; a narrativa permanece estática em telas móveis.
- Conteúdo e links essenciais funcionam sem JavaScript.

## Conteúdo e contatos

WhatsApp: +55 11 92019-3443. Instagram: @bgtechstore. URL configurada: https://bgtech-store.vercel.app/.

Valores, disponibilidade, entrega, documentação e garantia são confirmados em atendimento. Não há checkout, estoque em tempo real, depoimentos ou estatísticas inventadas. Condições comerciais exibidas: 5% no Pix e até 12x no cartão.

## Imagens

Os arquivos em `assets/products` são imagens oficiais dos produtos, armazenadas localmente. As URLs de origem estão em `assets/products/SOURCES.md`. A identidade da BGTech Store foi preservada a partir dos arquivos existentes. Fontes DM Sans e Manrope são carregadas do Google Fonts, com fontes locais de fallback.

`cinematic.css` e `cinematic.js` pertencem à versão anterior e não são mais carregados. Foram mantidos para referência histórica.

## Verificação da proposta

Sintaxe JavaScript e referências locais verificadas. Verificação de links internos, IDs, textos alternativos e links externos. Fluxos de menu, preparação de mensagem e preferência de movimento testados em ambiente de simulação DOM. Revisão visual em navegador ainda necessária antes de aprovar a publicação em produção.
