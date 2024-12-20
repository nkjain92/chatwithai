# ChatWithAI - Modern AI Chat Interface

A modern, responsive AI chat application built with Next.js 14, TypeScript, and the latest React features. This project provides a clean and intuitive interface for interacting with AI models, similar to ChatGPT but with additional customization options and features.

## 🌟 Features

- **Modern Tech Stack**

  - Next.js 14 with App Router
  - React 19 with Server Components
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Shadcn UI for beautiful components

- **Advanced Chat Capabilities**

  - Real-time streaming responses
  - Markdown support with code highlighting
  - Conversation history management
  - Error handling and retry mechanism

- **User Experience**

  - Clean and intuitive interface
  - Dark/Light mode support
  - Responsive design for all devices
  - Persistent conversations
  - Custom settings for AI responses

- **State Management**
  - Redux Toolkit for global state
  - Local storage persistence
  - Efficient state updates with RTK

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/nkjain92/chatwithai.git
cd chatwithai
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:

```env
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── chat/          # Chat-related components
│   └── ui/            # UI components
├── store/             # Redux store setup
│   ├── slices/        # Redux slices
│   └── hooks.ts       # Custom Redux hooks
└── lib/               # Utility functions
```

## 🔧 Configuration

The application can be configured through the settings panel, where you can adjust:

- AI model parameters
- Interface preferences
- Response settings
- Theme preferences

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
