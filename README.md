# 📲 Projeto Contábil Mobile

Este é um aplicativo mobile desenvolvido com **React Native (Expo CLI Bare Workflow)** voltado para a área contábil. O objetivo principal é realizar e visualizar movimentações contábeis, mesmo em modo **offline**, com envio posterior ao backend.

---

## 🚀 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo CLI (Bare Workflow)](https://docs.expo.dev/bare/using-expo-client/)
- [TypeScript](https://www.typescriptlang.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [axios](https://axios-http.com/)
- [NetInfo](https://github.com/react-native-netinfo/react-native-netinfo)
- [DropDownPicker](https://github.com/hossein-zare/react-native-dropdown-picker)

---

## 📂 Estrutura do Projeto

```plaintext
📁 auth
 └── Login.tsx            → Tela de autenticação (admin ou via API)

📁 tabs
 ├── homeScreen.tsx       → Tela inicial do app
 ├── FormScreen.tsx       → Cadastro de movimentações contábeis
 └── SavedDataScreen.tsx  → Visualização e envio dos dados salvos localmente

```
## 🔐 Login

Login offline (modo admin):

- **Email:** `admin@fasipe.com`  
- **Senha:** `senhaAdm`

Login via API:

- Requisição a `/login` com os campos:
  - `LOGUSUARIO`
  - `SENHAUSUA`

---

## 🧾 Cadastro de Movimentações

Formulário com os seguintes campos:

- Plano de Contas (**obrigatório**)
- Ordem de Compra (**obrigatório**)
- Item da Venda (**opcional**)
- Valor Débito (**obrigatório**)
- Valor Crédito (**obrigatório**)

Funcionalidades:

- 🎯 Máscara de moeda no formato **R$**
- ✅ Validação de campos obrigatórios
- 💾 Salvamento automático em **AsyncStorage**
- 📉 Limite de 3 entradas offline
- 🔁 Envio automático ao backend quando conectado

---

## 💾 Offline e Sincronização

- Se o dispositivo estiver **offline**, os dados do formulário são salvos em `AsyncStorage`.
- Há uma tela dedicada para visualizar os dados salvos localmente, com as opções de:
  - 🗑 **Excluir individualmente**
  - 📤 **Enviar todos os dados para o servidor** (`/movimentacoes`)

---

## 🏠 Tela Inicial (Home)

- Verifica o **status da conexão** com a internet.
- Exibe uma saudação ao usuário.
- Mostra uma descrição resumida do projeto.
- Permite o **logout**, que remove os dados locais de autenticação.

---

## 🌐 Endpoints de API utilizados

- `POST /login`
- `GET /planoconta`
- `GET /ordemcompra`
- `GET /itemvenda`
- `POST /movimentacoes`

> 📍 **Endereço base da API:** `http://160.20.22.99:5280`

---

## ✅ Funcionalidades Concluídas

- [x] Login offline e online
- [x] Tela de boas-vindas com status da rede
- [x] Cadastro de movimentações com persistência offline
- [x] Listagem dos dados locais
- [x] Envio manual dos dados salvos localmente
- [x] Validação e formatação de valores

---

## 🧠 Considerações

Este projeto foi idealizado para funcionar mesmo em situações com **baixa ou nenhuma conectividade**, garantindo que os dados possam ser armazenados localmente e enviados posteriormente ao servidor.

---

## 🛠️ Instalação e Execução

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
npm install
npx expo start
```
