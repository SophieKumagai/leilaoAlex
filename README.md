# 🏷️ Projeto de Leilão em Tempo Real com WebSocket

Este projeto implementa uma **plataforma de leilão online** que permite acompanhar e realizar lances em tempo real, utilizando **WebSocket** para comunicação bidirecional entre cliente e servidor.

---

## 🚀 Tecnologias Utilizadas

* **Node.js**
* **Socket.IO** (WebSocket)
* **HTML/CSS/JavaScript** (Frontend simples)

---

## 📝 Funcionalidades

✅ Comunicação em tempo real com WebSocket

✅ Criação e gerenciamento de leilões

✅ Lances simultâneos por múltiplos usuários

✅ Interface para visualização dos lances em tempo real

✅ Feedback ao usuário (lance aceito, superado, etc.)

---

## 🛠️ Como Executar o Projeto

### 1. Clone o repositório:

```bash
git clone https://github.com/SophieKumagai/leilaoAlex.git
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Execute o servidor:

```bash
node server.js
```

### 4. Acesse no navegador:

```
http://localhost:5500/
```

---

## 📡 Como Funciona o WebSocket

* Ao acessar a plataforma, o cliente estabelece uma conexão WebSocket com o servidor.
* Sempre que um usuário dá um lance, a informação é enviada via WebSocket.
* O servidor transmite esse lance a todos os outros clientes conectados em tempo real.
* O maior lance é atualizado na interface instantaneamente.

---

## 👥 Equipe de Desenvolvimento

* Ana Beatriz De Almeida Romera - 3ºF
* Camilla Ucci de Menezes - 3ºF
* João Victor Diniz Araujo - 3ºF
* Nícolas Albano Ruoco - 3ºF
* Samira de Souza Campos - 3ºF
* Sophie Satie Yuki Kumagai - 3ºF

---

## 📄 Licença

Este projeto é apenas para fins acadêmicos e de aprendizado.

---
