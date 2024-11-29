const fs = require('fs');
const zlib = require('zlib');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'drv1z32zg',
    api_key: '536474374565656',
    api_secret: 'ebWhJQESHUbv9eTSA88RN-Acnsc',
});

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const originalName = file.originalname;
        const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
        return {
            folder: 'uploads',
            resource_type: 'raw',
            public_id: `${baseName}`,
            format: 'gz', // Save as compressed gzip file
        };
    },
});

// Middleware to compress file before Multer processes it
const compressFile = (req, res, next) => {
    if (!req.file) return next(); // Skip if no file

    const inputPath = req.file.path;
    const outputPath = `${inputPath}.gz`;

    // Compress file using gzip
    const gzip = zlib.createGzip();
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    input.pipe(gzip).pipe(output).on('finish', () => {
        req.file.path = outputPath; // Replace original file path with compressed path
        req.file.originalname = `${req.file.originalname}.gz`; // Update file name
        next();
    });
};

// Set up Multer
const upload = multer({ storage: storage });

// Route with compression
const app = express();
app.post('/upload', upload.single('file'), compressFile, (req, res) => {
    res.send('File uploaded and compressed successfully!');
});
