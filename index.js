// Panggil express
const express = require('express');

// menggunakan package express
const app = express()

// import package bcrypt
const bcrypt = require('bcrypt');

// import package express flash & session
const flash = require('express-flash')
const session = require('express-session')

// use express flash
app.use(flash());

// use express session
app.use(
    session({
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 2,
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
);

// set up database
const db = require('./connection/db')
const upload = require('./middlewares/uploadFile');

// body parser
const bodyParser = require('body-parser')

// gunakan static folder
app.use('/public', express.static(__dirname + '/public'))
app.use('/uploads', express.static(__dirname + '/uploads'));

// body parser | mengambil value dari hasil submit form khusus untuk body aja 
app.use(bodyParser.urlencoded({ extended: false }))

//set hbs  
let hbs = require('hbs');


// loaded direktori partials
hbs.registerPartials(__dirname + '/views/partials');

// port server`
const port = 1000;
app.listen(port, () => {
    console.log(`Listening to server : ${port}`);
})

// atur view engine
app.set('view engine', 'hbs');

// Array dengan nilai default
const projects = [];
// {
//     projectName: 'Indonesia',
//     startDate: "17-12-2022",
//     endDate: "19-12-s2022",
//     duration: '3 Bulan',
//     description: 'Dapet emas',
//     technologies: ['nextjs.png', 'typescript.png', 'node-js-brands.svg', 'react-brands.svg'],
//     author: 'Woon',
//     time: '23 May 2022 09: 25 WIB',
//     upload: 'bruno.png',
//     post_at: '2022-05-23T02:26:27.403Z'
// }

const isLogin = true

// endpoint 

// db.connect(function(err, _, done) {
//     if (err) throw err

//     console.log('BERHASIL TERHUBUNG KEDATABASE!');
//     done()
// })

app.get('/', function(req, res) {
    res.render('index2', {
        title: "My Home",
        isLogin: req.session.isLogin,
        user: req.session.user
    })
})

app.get('/add', function(req, res) {

    if (req.session.isLogin != true) {
        req.flash('warning', 'Please Login...');
        return res.redirect('/login');
    }

    res.render('addmyproject', {
        isLogin: req.session.isLogin,
        user: req.session.user
    })
})
app.post('/add', upload.single('image'), function(req, res) {
    let data = req.body
        // date1 = new Date(data.startDate)
        // date2 = new Date(data.endDate)

    // duration = date2.getDate() - date1.getDate()
    // let monthDistance = duration / (1000 * 3600 * 23 * 30);

    let project = {
        projectName: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        technologies: data.technologies,
        author: req.session.user,
        post_at: new Date(),
        duration: getDistanceTime(data.startDate, data.endDate),
        upload: req.file.filename,
        userId: req.session.user.id
    }

    db.connect((err, client, done) => {
        if (err) throw err

        let query = `INSERT INTO tb_projects("projectName", "startDate", "endDate", description, technologies, upload,author_id) VALUES ('${project.projectName}','${project.startDate}','${project.endDate}','${project.description}','{${project.technologies}}','${project.upload}','${project.userId}')`;

        client.query(query, (result, err) => {
            // if (err) throw err
            res.redirect('/project')
        })
        done()
    })

})


app.get('/update/:id', function(req, res) {
    let id = req.params.id


    db.connect((err, client, done) => {
        if (err) throw err

        let query = `SELECT id, "projectName", TO_CHAR("startDate", 'yyyy-mm-dd') as startDate, TO_CHAR("endDate", 'yyyy-mm-dd') as endDate, description, technologies FROM tb_projects WHERE id=${id}`
        client.query(query, (err, result) => {
            done()
            if (err) throw err

            let blogs = result.rows[0];
            console.log(blogs);

            function technologies(arr, obj) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] == obj) {
                        return true;
                    }
                }
            }

            let tech = {
                nodeJs: technologies(blogs.technologies, 'node-js-brands.svg'),
                reactJs: technologies(blogs.technologies, 'react-brands.svg'),
                nextJs: technologies(blogs.technologies, 'nextjs.png'),
                typeScript: technologies(blogs.technologies, 'typescript.png')
            }
            console.log(tech);
            res.render('updatemyproject', { title: 'UPDATE MY PROJECT', blog: blogs, tech, isLogin: req.session.isLogin, user: req.session.user })
        })
    })


})

app.post('/update/:id', upload.single('image'), function(req, res) {
    let id = req.params.id;
    let myData = {
        projectName: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        description: req.body.description,
        technologies: req.body.technologies,
        upload: req.file.filename,
        post_at: new Date()
    }

    db.connect((err, client, done) => {
        if (err) throw err

        const query = `UPDATE tb_projects
        SET "projectName"='${myData.projectName}', "startDate"='${myData.startDate}', "endDate"='${myData.endDate}', description='${myData.description}', technologies='{${myData.technologies}}', upload = '${myData.upload}'
        WHERE id = ${id}`;
        console.log(query);
        client.query(query, (err, result) => {
            done()
                // if (err) throw err

            res.redirect('/project')
        })
    })



})

app.get('/delete/:id', function(req, res) {
    let id = req.params.id

    db.connect((err, client, done) => {
        if (err) throw err

        const query = `DELETE FROM tb_projects
        WHERE id=${id}`

        client.query(query, (err, result) => {
            done()
            if (err) throw err
            req.flash('success', 'Data berhasil dihapus!')
            res.redirect('/project')
        })
    })

})


app.get('/project', function(req, res) {

    db.connect(function(err, client, done) {
        if (err) throw err;

        let query = '';
        if (req.session.isLogin == true) {
            query = `SELECT tb_projects.*, tb_users.id as "user_id", tb_users.name, tb_users.email
            FROM tb_projects
            LEFT JOIN tb_users
            ON tb_projects.author_id = tb_users.id 
            WHERE tb_projects.author_id = ${req.session.user.id}
            ORDER BY tb_projects.id DESC`;
        } else {
            query = `SELECT tb_projects.*, tb_users.id as "user_id", tb_users.name, tb_users.email
            FROM tb_projects
            LEFT JOIN tb_users
            ON tb_projects.author_id = tb_users.id
            ORDER BY tb_projects.id DESC`;
        }

        client.query(query, function(err, result) {
            console.log(result);
            if (err) throw err;
            const dataProjects = result.rows;
            const newBlog = dataProjects.map((blog) => {
                blog.time = getFullTime(blog.time)
                blog.duration = getDistanceTime(blog.startDate, blog.endDate)
                blog.isLogin = req.session.isLogin
                blog.name = blog.name ? blog.name : 'Anonymous';
                blog.upload = blog.upload ? '/uploads/' + blog.upload : '/public/img/default.jpg';

                return blog;
            });
            // console.log(newBlog);
            res.render('project', { isLogin: req.session.isLogin, projects: newBlog, user: req.session.user, title: 'MY PROJECTS' });
        })
        done();
    })

});

app.get('/detail-project/:id', (req, res) => {
    const id = req.params.id;

    db.connect(function(err, client, done) {
        if (err) throw err;
        const query = `SELECT tb_projects.*, tb_users.id as "user_id", tb_users.name, tb_users.email
        FROM tb_projects
        LEFT JOIN tb_users
        ON tb_projects.author_id = tb_users.id
        WHERE tb_projects.id = ${id}`;

        client.query(query, function(err, result) {
            if (err) throw err;
            console.log(result.rows[0]);
            const project = result.rows[0];
            project.time = getFullTime(project.time)

            project.duration = getDistanceTime(project.startDate, project.endDate)

            res.render('detail-project1', { project, isLogin: req.session.isLogin, user: req.session.user, title: 'DETAIL PROJECT' });
        });

        done();
    });
});

app.get('/register', (req, res) => {

    res.render('register', { isLogin: req.session.isLogin, user: req.session.user })
})

app.post('/register', (req, res) => {
    let { name, email, password } = req.body
    const hash = bcrypt.hashSync(password, 10);
    // console.log(name);
    // console.log(email);
    // console.log(password);
    db.connect((err, client, done) => {
        if (err) throw err
        const query = `INSERT INTO tb_users (name,email,password) VALUES('${name}','${email}','${hash}')`

        client.query(query, (err, result) => {
            done()
            if (err) throw err

            req.flash('success', 'Akun anda berhasil terdaftar!')
            res.redirect('login')
        })

    })
})


app.get('/login', (req, res) => {

    res.render('login')
})

app.post('/login', (req, res) => {

    let { email, password } = req.body
        // console.log(password);
    db.connect((err, client, done) => {
        if (err) throw err

        let query = `SELECT * FROM tb_users WHERE email='${email}'`

        client.query(query, (err, result) => {
            done()
            if (err) throw err

            if (result.rowCount == 0) {
                req.flash('warning', 'Email anda tidak ditemukan!')
                return res.redirect('/login')
            }
            console.log(result);
            let pass = result.rows[0].password
            let data = result.rows[0]
            let matching = bcrypt.compareSync(password, pass);
            if (matching) {
                req.session.isLogin = true
                req.session.user = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                }

                req.flash('success', 'Login berhasil!')
                res.redirect('/project')
            } else {
                req.flash('warning', 'Password yang anda masukkan salah!')
                res.redirect('/login')
            }
        })
    })
})

app.get('/logout', function(req, res) {
    req.session.destroy()
    res.redirect('/project')
})

app.get('/contact', function(req, res) {
    res.render('contact', { isLogin: req.session.isLogin, user: req.session.user })
})


const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function getDistanceTime(time, time2) {
    // console.log(typeof time);
    date1 = new Date(time)
    date2 = new Date(time2)
    const final = (date2 - date1)
        //convert to day
    const miliseconds = 1000
    const secondInMinute = 60
    const minuteInHour = 60
    const secondInHour = secondInMinute * minuteInHour // 3600
    const hourInDay = 23
    const dayInMonth = 30
    const monthInYear = 12

    let monthDistance = final / (miliseconds * secondInHour * hourInDay * dayInMonth);
    let yearDistance = final / (miliseconds * secondInHour * hourInDay * dayInMonth * monthInYear)

    if (yearDistance >= 1) {
        const time = Math.floor(yearDistance) + ' years ago'
        return time
    } else {
        if (monthDistance >= 1) {
            const time = Math.floor(monthDistance) + ' months ago'
            return time
        } else {
            let dayDistance = Math.floor(final / (1000 * 3600 * 23))
            if (dayDistance >= 1) {
                return dayDistance + ' days ago'
            } else {
                let hourDistance = Math.floor(final / (1000 * 3600 * 23))
                if (hourDistance >= 1) {
                    return hourDistance + ' hours ago'
                } else {
                    let minuteDistance = Math.floor(final / (miliseconds * secondInMinute))
                    if (minuteDistance >= 0) {
                        return minuteDistance + ' minutes ago'
                            // } else {
                            //     let secondDistance = Math.floor(final / (miliseconds))
                            //     if(secondDistance >= 0){
                            //     return secondDistance + ' seconds ago'
                            // }
                    }
                }
            }
        }
    }
}

function getFullTime(time) {
    time = new Date(time);
    const date = time.getDate();
    const monthIndex = time.getMonth();
    const year = time.getFullYear();
    let hour = time.getHours();
    let minute = time.getMinutes();

    if (hour < 10) {
        hour = '0' + hour;
    }

    if (minute < 10) {
        minute = '0' + minute;
    }

    const fullTime = `${date} ${month[monthIndex]} ${year} ${hour}:${minute} WIB`;

    return fullTime;
}