# Scrapper The Master

A professional web scraping tool with an advanced terminal interface, built with React, TypeScript, and Docker.

## Features

- **Complete Website Mirroring**: Download entire websites with all assets
- **Animated Terminal Interface**: Beautiful, colorful terminal with real-time output
- **Docker Support**: Easy deployment with Docker and Docker Compose
- **Responsive Design**: Works perfectly on all devices
- **Professional UI**: Modern design with glassmorphism effects

## Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd scrapper-the-master
```

2. Build and run with Docker Compose:
```bash
docker-compose up --build
```

3. Access the application at `http://localhost:3000`

### Manual Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. For production, build and serve:
```bash
npm run build
npm run preview
```

## Usage

1. Enter a website URL in the input field
2. Click "Start Scraping" to begin the process
3. Watch the animated terminal as it downloads the website
4. Files are saved to the `downloads` directory

## Wget Command

The application uses this wget command for comprehensive scraping:

```bash
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent \
  --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36" \
  <URL>
```

## Docker Deployment

### Production Deployment

1. **Basic Deployment**:
```bash
docker build -t scrapper-master .
docker run -p 3000:3000 -v $(pwd)/downloads:/app/downloads scrapper-master
```

2. **With Docker Compose** (includes Nginx reverse proxy):
```bash
docker-compose up -d
```

3. **Environment Variables**:
```bash
# Optional environment variables
NODE_ENV=production
PORT=3000
```

### SSL Configuration

For HTTPS support, place your SSL certificates in the `ssl` directory:
- `ssl/cert.pem` - SSL certificate
- `ssl/key.pem` - SSL private key

## File Structure

```
scrapper-the-master/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── UrlInput.tsx
│   │   ├── TerminalWindow.tsx
│   │   └── Stats.tsx
│   ├── App.tsx
│   └── main.tsx
├── server/
│   └── index.js
├── downloads/          # Scraped websites stored here
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── README.md
```

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Node.js, Express
- **Containerization**: Docker, Docker Compose
- **Web Server**: Nginx (for production)
- **Scraping**: wget command-line tool

## Author

Created by **Sainudeen Safar**

- LinkedIn: [linkedin.com/in/sainudeensafar](https://linkedin.com/in/sainudeensafar)

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For support and questions, please visit the GitHub repository or connect on LinkedIn.