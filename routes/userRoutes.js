const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const authenticationController = require('../controllers/authenticationController');
const auth = require('../middlewares/auth'); // Ensure auth middleware is imported correctly


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Get All Users
router.get('/users', userController.getAllUsers);


// Update All Users
router.put('/users', auth, userController.updateAllUsers);


// Delete All Users
router.delete('/users', auth, userController.deleteAllUsers);


//Public Routes

// router.post('/register', authenticationController.register)
router.post('/login', authenticationController.login)

router.post('/register', authenticationController.register);
router.get('/register', authenticationController.getUsers);
router.delete('/register/:id', authenticationController.deleteUser);
router.put('/register/:id', authenticationController.editUser);

//Protected Routes
// create user
router.post('/users', auth, upload.single('photo'), userController.createUser);

// get user by ID
router.get('/users/:id', auth, userController.getUser);

// Update User by ID
router.put('/users/:id', auth, userController.updateUser);

// Delete User by ID
router.delete('/users/:id', auth, userController.deleteUser);





module.exports = router;
