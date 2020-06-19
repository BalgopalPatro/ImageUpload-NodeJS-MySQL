const express = require('express');
const app = express();
const engines = require('consolidate');
const bodyparser = require('body-parser');
const fs = require('fs')
const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/images'});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
})

app.post('/upload', upload.single('img'), (req, res) => {
    console.log(req.file);
    if(req.file) {
        var tmp_path = req.file.path;

        /** The original name of the uploaded file
            stored in the variable "originalname". **/
        var target_path = 'uploads/' + req.file.originalname;
      
        /** A better way to copy the uploaded file. **/
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function() { res.render('complete'); });
        src.on('error', function(err) { res.render('error'); });
        res.json(req.file);
    }
    else throw 'error';
});

app.listen(3000)