const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保 uploads 文件夹存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置文件存储设置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // 照片将保存在 server/uploads 目录下
    },
    filename: function (req, file, cb) {
        // 防止重名，使用时间戳+随机数生成唯一文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// 文件类型与格式过滤
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // 如果格式不符，抛出特定错误供路由捕获
        cb(new Error('INVALID_TYPE'), false);
    }
};

// 创建 multer 实例
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 限制 50MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
