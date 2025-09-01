# Real-time Chat Application
# Real-time Chat Application

![GitHub license](https://img.shields.io/github/license/seu-usuario/chat-app)
![GitHub last commit](https://img.shields.io/github/last-commit/seu-usuario/chat-app)

A modern real-time chat application built with React, Supabase, and TailwindCSS. This application allows users to register, login, and exchange messages in real-time with other users.

![Chat App Demo](./public/demo.gif)

---

## Features

- 🔐 User authentication (Register/Login)
- 💬 Real-time messaging
- 👥 User list with online status
- 📱 Responsive design
- 🎨 Modern UI with TailwindCSS
- 🔄 Message history persistence

---

## Tech Stack

- **Frontend**: React
- **Backend/Database**: Supabase
- **Styling**: TailwindCSS
- **Authentication**: JWT
- **API Client**: Axios
- **Real-time**: Supabase Realtime
- **Build Tool**: Vite

---

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

---

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

---

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd chat-app
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

---

## Supabase Setup

1. **Create a new project** em [Supabase](https://app.supabase.com/).
2. **Configure as tabelas** usando o SQL Editor do Supabase:

    ```sql
    create table messages_chat (
      id uuid default gen_random_uuid() primary key,
      sender_id uuid not null,
      receiver_id uuid not null,
      content text not null,
      created_at timestamp with time zone default now()
    );
    ```

3. **Ative o Realtime** na tabela `messages_chat` (Database > Replication > Adicionar tabela).
4. **Configure as políticas RLS** para permitir leitura e escrita apenas para usuários autenticados.

---

## Project Structure

```text
chat-app/
├── src/
│   ├── components/
│   │   ├── Chat.jsx        # Main chat component
│   │   ├── Login.jsx       # Authentication component
│   │   ├── Message.jsx     # Individual message component
│   │   └── UserList.jsx    # Users list component
│   ├── services/
│   │   ├── api.js          # API service
│   │   └── supabase.jsx    # Supabase client
│   ├── App.jsx
│   └── main.jsx
├── query/                   # SQL queries for database setup
├── public/
└── vite.config.js
```

---

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Features in Detail

### Authentication
- User registration with username/password
- JWT-based authentication
- Session persistence

### Chat Features
- Real-time message updates
- Message history
- User list with online status
- Mobile-responsive design
- Message timestamps
- Unread message indicators

### UI/UX
- Clean and modern interface
- Responsive design for mobile and desktop
- Loading states and error handling
- User-friendly notifications

---

## Example Usage

1. **Register** a new user.
2. **Login** with your credentials.
3. **Select** a user from the user list to start chatting.
4. **Send and receive** messages in real-time.

---

## Roadmap

- [ ] Notificações push
- [ ] Suporte a grupos/salas
- [ ] Upload de arquivos/imagens
- [ ] Melhorias de acessibilidade
- [ ] Temas claro/escuro

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Contact

For questions or suggestions, open an issue or contact [your-email@example.com](mailto:your-email@example.com).

---

## License

This project is licensed under the MIT
A modern real-time chat application built with React, Supabase, and TailwindCSS. This application allows users to register, login, and exchange messages in real-time with other users.

## Features

- 🔐 User authentication (Register/Login)
- 💬 Real-time messaging
- 👥 User list with online status
- 📱 Responsive design
- 🎨 Modern UI with TailwindCSS
- 🔄 Message history persistence

## Tech Stack

- **Frontend**: React
- **Backend/Database**: Supabase
- **Styling**: TailwindCSS
- **Authentication**: JWT
- **API Client**: Axios
- **Real-time**: Supabase Realtime
- **Build Tool**: Vite

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
chat-app/
├── src/
│   ├── components/
│   │   ├── Chat.jsx        # Main chat component
│   │   ├── Login.jsx       # Authentication component
│   │   ├── Message.jsx     # Individual message component
│   │   └── UserList.jsx    # Users list component
│   ├── services/
│   │   ├── api.js          # API service
│   │   └── supabase.jsx    # Supabase client
│   ├── App.jsx
│   └── main.jsx
├── query/                   # SQL queries for database setup
├── public/
└── vite.config.js
```

## Database Schema

The application uses two main tables:

1. `users` - Managed by Supabase Auth
2. `messages_chat`:
```sql
create table messages_chat (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid not null,
  receiver_id uuid not null,
  content text not null,
  created_at timestamp with time zone default now()
);
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Features in Detail

### Authentication
- User registration with username/password
- JWT-based authentication
- Session persistence

### Chat Features
- Real-time message updates
- Message history
- User list with online status
- Mobile-responsive design
- Message timestamps
- Unread message indicators

### UI/UX
- Clean and modern interface
- Responsive design for mobile and desktop
- Loading states and error handling
- User-friendly notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the