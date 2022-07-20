const express = require('express');
const mongoose = require('mongoose');
const Catly = require('./models/urls');
const app = express();
const URL = "https://catly.vuhuy09.repl.co"
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
let format = /[^a-z0-9]/gi
app.set('view engine', 'ejs')
app.use(express.urlencoded({
    extended: false
}))
app.get('/', async (req, res) => {
    let options = {
        alert: false,
        message: "",
        title: "",
        icon: "",
        url: URL
    }
    res.render("index", options)
})
app.get('/create', async (req, res) => {
    res.redirect("/")
})
app.post('/create', async (req, res) => {
    let options
    if (format.test(req.body.key)) {
        options = {
            alert: req.body ? true : false,
            message: `Key must not contain special character`,
            title: "Creation failed",
            icon: "error",
            url: URL
        }
    } else {
        let createnew = await createNewURl(req.body.url, req.body.key)
        options = {
            alert: req.body ? true : false,
            message: createnew == 401 ? `${req.body.key} already exist!` : `Your url: ${URL}/${req.body.key}`,
            title: createnew == 401 ? "Failed to create" : "Successfully created!",
            icon: createnew == 200 ? "Success" : "Error",
            url: URL
        }
    }
    res.render("index", options)
})

app.get('/:key', async (req, res) => {
    let catlydata = await Catly.findOne({
        key: req.params.key
    })
    if (!catlydata) return res.sendStatus(404)

    catlydata.clicks++
    catlydata.save()

    res.redirect(catlydata.url)
})

app.listen(process.env.PORT || 5000);

async function createNewURl(url, key) {
    if (!url || !key) return 401
    let catlydata = await Catly.findOne({
        key: key
    })
    if (!catlydata) {
        catlydata = Catly({
            url: encodeURI(url),
            click: 0,
            key: key
        })
        await catlydata.save()
        return 200
    } else {
        return 401
    }
}

//Catly 2022
