# Renovação cinematográfica

Vitrine em HTML, CSS e JavaScript, sem dependências adicionais ou etapa de build. Para visualizar, execute `python -m http.server 4173 --bind 127.0.0.1` na raiz.

## Recursos

- Smartphone ilustrativo em geometria CSS 3D, com frente, traseira, laterais e bordas. Controle por slider/teclado e botão frente/traseira.
- Representação estilizada, sem fidelidade a um modelo comercial específico. Não é um arquivo GLB nem uma digitalização de iPhone.
- Movimentos na rolagem e entrada das seções respeitam `prefers-reduced-motion`.
- Imagens locais existentes carregadas sob demanda e menu responsivo.
- Links WhatsApp por categoria. Sem JavaScript, os links abrem diretamente o contato. Nenhuma mensagem é enviada automaticamente.
- Condições comerciais preservadas: 5% no Pix, até 12x e venda sob encomenda, com confirmação na cotação.

## Verificação

- Sintaxe JavaScript e integridade do diff.
- Prévia no navegador: imagens carregadas, sem erros no console e sem rolagem horizontal no desktop e em 390 px.
- Rotação frente/traseira e slider sincronizados.
- Menu móvel, navegação para a coleção e fechamento automático.
- Destino e mensagens dos links de cotação conferidos, sem enviar mensagens.

## Publicação

Mantenha a configuração estática da Vercel. Revise a prévia da branch antes de integrar a alteração à `main`. Não há checkout, estoque ou pagamento integrado.

Para apresentar um modelo exato de aparelho, substitua a ilustração por fotos ou modelos 3D autorizados desse produto.
