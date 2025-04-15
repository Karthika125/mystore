# MyStore - E-commerce Admin Dashboard

An admin dashboard for managing an e-commerce platform built with Next.js, Supabase, and Tailwind CSS.

## Features

- User authentication with Supabase
- Product management
- Category management
- Order management
- Cart functionality
- Toast notifications
- Responsive UI design

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **State Management**: React Context, React Query
- **Backend/Database**: Supabase
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI, shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Karthika125/mystore.git
cd mystore
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is open source and available under the [MIT License](LICENSE).
