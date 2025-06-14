import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs-extra';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, '../downloads');
fs.ensureDirSync(downloadsDir);

// API endpoint for scraping
app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Validate URL
    new URL(url);
    
    const domain = new URL(url).hostname;
    const outputDir = path.join(downloadsDir, domain);
    
    // Ensure output directory exists
    fs.ensureDirSync(outputDir);
    
    // Prepare wget command with proper spacing
    const wgetCommand = `wget --mirror --convert-links --adjust-extension --page-requisites --no-parent      --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"  --directory-prefix="${outputDir}" ${url}`;

    console.log(`Starting scrape for: ${url}`);
    console.log(`Output directory: ${outputDir}`);
    console.log(`Command: ${wgetCommand}`);

    // Execute wget command
    exec(wgetCommand, { timeout: 300000 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Wget error: ${error}`);
        return res.status(500).json({ 
          error: 'Scraping failed', 
          details: error.message 
        });
      }

      console.log(`Scraping completed for: ${domain}`);
      res.json({
        success: true,
        message: 'Scraping completed successfully',
        domain: domain,
        outputDir: outputDir,
        stdout: stdout,
        stderr: stderr
      });
    });

  } catch (error) {
    res.status(400).json({ 
      error: 'Invalid URL', 
      details: error.message 
    });
  }
});

// API endpoint for downloading scraped content as ZIP
app.get('/api/download/:domain', async (req, res) => {
  const { domain } = req.params;
  
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  const domainDir = path.join(downloadsDir, domain);
  
  try {
    // Check if directory exists
    if (!fs.existsSync(domainDir)) {
      return res.status(404).json({ error: 'Scraped content not found for this domain' });
    }

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${domain}-scraped.zip"`);

    // Create zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Handle archive errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({ error: 'Failed to create zip archive' });
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add directory to archive
    archive.directory(domainDir, domain);

    // Finalize the archive
    await archive.finalize();

    console.log(`ZIP download completed for domain: ${domain}`);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'Download failed', 
      details: error.message 
    });
  }
});

// API endpoint to list available downloads
app.get('/api/downloads', async (req, res) => {
  try {
    const downloads = [];
    
    if (fs.existsSync(downloadsDir)) {
      const dirs = fs.readdirSync(downloadsDir);
      
      for (const dir of dirs) {
        const dirPath = path.join(downloadsDir, dir);
        const stats = fs.statSync(dirPath);
        
        if (stats.isDirectory()) {
          // Calculate directory size
          const getDirectorySize = (dirPath) => {
            let size = 0;
            const files = fs.readdirSync(dirPath);
            
            for (const file of files) {
              const filePath = path.join(dirPath, file);
              const fileStats = fs.statSync(filePath);
              
              if (fileStats.isDirectory()) {
                size += getDirectorySize(filePath);
              } else {
                size += fileStats.size;
              }
            }
            
            return size;
          };

          const size = getDirectorySize(dirPath);
          
          downloads.push({
            domain: dir,
            createdAt: stats.mtime,
            size: size,
            sizeFormatted: formatBytes(size)
          });
        }
      }
    }

    res.json({ downloads });
  } catch (error) {
    console.error('Error listing downloads:', error);
    res.status(500).json({ error: 'Failed to list downloads' });
  }
});

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    downloadsDir: downloadsDir
  });
});

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Scrapper The Master server running on port ${PORT}`);
  console.log(`📁 Downloads will be saved to: ${downloadsDir}`);
  console.log(`🌐 Server accessible at: http://0.0.0.0:${PORT}`);
});
