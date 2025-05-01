# EasyFix - Appliance Maintenance Reporting System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D6.0.0-green)

EasyFix is a modern web application for managing and tracking appliance maintenance reports in residential halls. Built with Next.js and MongoDB, it provides an intuitive interface for users to submit, track, and manage maintenance requests for washers and dryers.

## 🌟 Features

- **Real-time Report Submission**
  - Quick and easy maintenance report creation
  - Support for both washers and dryers
  - Automatic timestamp tracking

- **Smart Filtering & Search**
  - Filter by appliance type and residence hall
  - Date range-based report filtering
  - Advanced search capabilities

- **Optimized Performance**
  - Efficient database indexing
  - Prepared statements for complex queries
  - Batch operations with transaction support

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Real-time updates
  - Interactive filtering interface
  - Beautiful, modern UI components with shadcn/ui

## 🛠 Tech Stack

- **Frontend**
  - Next.js 15.1.5
  - React 19.0.0
  - Tailwind CSS
  - shadcn/ui components
  - Lucide React icons

- **Backend**
  - MongoDB 6.12.0
  - Mongoose 8.10.0
  - Node.js

- **Development Tools**
  - ESLint
  - PostCSS
  - TypeScript

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0.0
- npm or yarn package manager

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/easyfix.git
   cd easyfix
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your MongoDB connection string and other configurations.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Structure

The application uses MongoDB with optimized indexes for performance. For detailed information about the database structure and indexes, see:
- [Database Documentation](./DB_DOCUMENTATION.md)
- [Index Documentation](./INDEX_DOCUMENTATION.md)

## 📁 Project Structure

```
easyfix/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   └── styles/          # CSS styles
├── lib/                 # Utility functions
├── models/             # Mongoose models
├── public/            # Static files
└── ...configuration files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

## 📞 Support

For support, email support@easyfix.com or join our Slack channel.
