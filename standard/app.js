if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
console.log(process.env.SECRET)
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const multer = require('multer')
const {storage} = require('./cloudinary')

var upload = multer({storage})

const Property = require('./models/property')
const dbUrl = "mongodb+srv://Jasim:7m6GvX1BJbMZhTLk@cluster0.9ugwp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// 'mongodb://localhost:27017/property'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const allProperties = await  Property.find({}).sort([['_id', -1]]).limit(4)

    res.render('index',{allProperties})
});

app.get('/contact', (req, res) => {
    res.render('contact')
});
app.get('/about', (req, res) => {
    res.render('about')
}); 
app.get('/addProperty', (req,res)=>{
    res.render('addProperty')
})

app.get('/gallery', async (req,res)=>{
    const allProperties = await Property.find({})
    res.render('gallery', {allProperties})
})
app.post('/addProperty', upload.array('image'), async (req,res)=>{
    var body = req.body
    const property = new Property(req.body.property)
    property.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    await property.save()
    console.log("file", req.files)
    console.log("property", property)
    res.redirect("/addProperty")

})
const port =  process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})