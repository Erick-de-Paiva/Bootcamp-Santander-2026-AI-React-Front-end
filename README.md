# 🚀 Planej.ai - Educador Financeiro com IA

Aplicação web inteligente de planejamento financeiro pessoal desenvolvida com React, TypeScript, Tailwind CSS e integrada à API do Gemini (IA Generativa). O projeto transforma dados preenchidos pela pessoa usuária em um diagnóstico financeiro personalizado, completo com análise de viabilidade, sugestões práticas, ideias de renda extra e recomendações de investimento.

---

## ✨ Funcionalidades Principais

* **Formulário Multi-etapas guiado:** Coleta de renda, custos fixos, dívidas e objetivos financeiros.
* **Diagnóstico com IA:** Análise estruturada gerada pelo Google Gemini com base nos dados do usuário.
* **Indicador de Viabilidade:** Classificação visual se a meta é viável, se precisa de ajustes ou se é inviável no prazo.
* **💬 Chat Interativo com o Educador Financeiro (Melhoria Implementada):** O usuário pode fazer perguntas de acompanhamento e tirar dúvidas diretamente no card de insights, mantendo uma conversa consultiva com a IA.
* **Persistência Local (localStorage):** O histórico de simulações e as mensagens do chat são salvos localmente para que o usuário não perca sua conversa.
* **Tema Claro e Escuro:** Suporte completo a diferentes preferências visuais.
* **Tratamento de Estados:** Feedback visual de carregamento (loading) e tratamento de erros nas requisições.

---

## 🛠️ Tecnologias Utilizadas

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React (Ícones)
* Google Gemini API (IA Generativa)

---

## ⚙️ Como Executar o Projeto Localmente

Siga os passos abaixo para rodar o projeto na sua máquina:

1. Clone o repositório:
git clone https://github.com/Erick-de-Paiva/Bootcamp-Santander-2026-Al-React-Front-end.git
cd Bootcamp-Santander-2026-Al-React-Front-end/educador-financeiro

2. Instale as dependências:
npm install

3. Configure as variáveis de ambiente:
- Crie um arquivo chamado .env na raiz da pasta educador-financeiro.
- Adicione sua chave da API do Gemini:
VITE_GEMINI_API_KEY=sua_chave_aqui

4. Inicie o servidor de desenvolvimento:
npm run dev

5. Acesse no navegador: http://localhost:5173/

---

## 🧠 Melhoria Implementada

Nesta versão, além do fluxo base do desafio, implementei a funcionalidade de Conversar com o Educador Financeiro. Após receber os insights iniciais da simulação, a pessoa usuária tem acesso a um chat em tempo real no rodapé do card de IA. A aplicação mantém o contexto da meta financeira e salva todo o histórico de perguntas e respostas no localStorage, garantindo uma experiência contínua, fluida e interativa.

---

## 📚 O que foi aprendido

Durante o desenvolvimento deste desafio, foi possível praticar e consolidar conceitos essenciais no ecossistema Front-End moderno:
* Integração de aplicações React com inteligência artificial generativa via API.
* Manipulação e estruturação de prompts para contextos específicos.
* Gerenciamento de estados complexos e persistência de dados no navegador (localStorage).
* Tratamento robusto de erros e estados de carregamento.
* Criação de interfaces responsivas e componentizadas com Tailwind CSS.