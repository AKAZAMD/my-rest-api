/*
Note: Semua Kode ini Sendirian di Koding Oleh Akazamd
Dan sedikit bantuan chatgpt untuk menyempurnakanya
Jangan Dijual !!
*/


const express = require("express");
const app = express();
const port = 80;
const ling = require("knights-canvas");
const fs = require("fs");
const pino = require("pino");
const chalk = require("chalk");
const { shortText } = require("limit-text-js");
const ytdl = require('ytdl-core');
const { millify } = require("millify");
const canvasGif = require('canvas-gif');
const Canvas = require('canvas');
const isUrl = require("is-url");
const logger = pino();
const OpenAI = require("openai");
const cheerio = require("cheerio");
const cookie = require("cookie");
const axios = require('axios')
const FormData = require("form-data");
const isImageURL = require('image-url-validator').default
global.openai = "your apikey openai";
global.apikey = ['namalu2', 'namalu'];
global.hugging = "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";
app.use(express.json());

async function getBuffer(url, options){
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}

async function post(url, formdata = {}, cookies) {
  let encode = encodeURIComponent;
  let body = Object.keys(formdata)
    .map((key) => {
      let vals = formdata[key];
      let isArray = Array.isArray(vals);
      let keys = encode(key + (isArray ? "[]" : ""));
      if (!isArray) vals = [vals];
      let out = [];
      for (let valq of vals) out.push(keys + "=" + encode(valq));
      return out.join("&");
    })
    .join("&");
  return await fetch(`${url}?${body}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "GoogleBot",
      Cookie: cookies,
    },
  });
}
async function textpro2(url, text1, text2) {
  if (!/^https:\/\/textpro\.me\/.+\.html$/.test(url))
    throw new Error("URL Salah!!");
  const geturl = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  });
  const caritoken = await geturl.text();
  const $ = cheerio.load(caritoken);
  const token = $('input[name="token"]').attr("value");
  const form = new FormData();

  for (let texts of text1) form.append("text1[]", texts);
  for (let texts of text2) form.append("text2[]", texts);

  form.append("submit", "Go");
  form.append("token", token);
  form.append("build_server", "https://textpro.me");
  form.append("build_server_id", 1);
  const geturl2 = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      ...form.getHeaders(),
    },
    body: form.getBuffer(),
  });
  const caritoken2 = await geturl2.text();
  const token2 = /<div.*?id="form_value".+>(.*?)<\/div>/.exec(caritoken2);
  if (!token2) throw new Error("Token Tidak Ditemukan!!");
  const prosesimage = await post(
    "https://textpro.me/effect/create-image",
    JSON.parse(token2[1]),
    ''
  );
  const hasil = await prosesimage.json();
  const hasilImage = `https://textpro.me${hasil.fullsize_image}`
  const result = await getBuffer(hasilImage);
  return result;
}
async function textpro(url, text) {
  if (!/^https:\/\/textpro\.me\/.+\.html$/.test(url))
    throw new Error("Url Salah!!");
  const geturl = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  });
  const caritoken = await geturl.text();
  let hasilcookie = geturl.headers
    .get("set-cookie")
    .split(",")
    .map((v) => cookie.parse(v))
    .reduce((a, c) => {
      return { ...a, ...c };
    }, {});
  hasilcookie = {
    __cfduid: hasilcookie.__cfduid,
    PHPSESSID: hasilcookie.PHPSESSID,
  };
  hasilcookie = Object.entries(hasilcookie)
    .map(([name, value]) => cookie.serialize(name, value))
    .join("; ");
  const $ = cheerio.load(caritoken);
  const token = $('input[name="token"]').attr("value");
  const form = new FormData();
  if (typeof text === "string") text = [text];
  for (let texts of text) form.append("text[]", texts);
  form.append("submit", "Go");
  form.append("token", token);
  form.append("build_server", "https://textpro.me");
  form.append("build_server_id", 1);
  const geturl2 = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      Cookie: hasilcookie,
      ...form.getHeaders(),
    },
    body: form.getBuffer(),
  });
  const caritoken2 = await geturl2.text();
  const token2 = /<div.*?id="form_value".+>(.*?)<\/div>/.exec(caritoken2);
  if (!token2) throw new Error("Token Tidak Ditemukan!!");
  const prosesimage = await post(
    "https://textpro.me/effect/create-image",
    JSON.parse(token2[1]),
    hasilcookie
  );
  const hasil = await prosesimage.json();
  const hassil = `https://textpro.me${hasil.fullsize_image}`
  const result = await getBuffer(hassil)
  return result
}
async function photooxy(url, text) {
  const geturl = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  });
  const caritoken = await geturl.text();
  let hasilcookie = geturl.headers
    .get("set-cookie")
    .split(",")
    .map((v) => cookie.parse(v))
    .reduce((a, c) => {
      return { ...a, ...c };
    }, {});
  hasilcookie = {
    __cfduid: hasilcookie.__cfduid,
    PHPSESSID: hasilcookie.PHPSESSID,
  };
  hasilcookie = Object.entries(hasilcookie)
    .map(([name, value]) => cookie.serialize(name, value))
    .join("; ");
  const $ = cheerio.load(caritoken);
  const token = $('input[name="token"]').attr("value");
  const form = new FormData();
  if (typeof text === "string") text = [text];
  for (let texts of text) form.append("text[]", texts);
  form.append("submit", "Go");
  form.append("token", token);
  form.append("build_server", "https://e2.yotools.net");
  form.append("build_server_id", 2);
  const geturl2 = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      Cookie: hasilcookie,
      ...form.getHeaders(),
    },
    body: form.getBuffer(),
  });
  const caritoken2 = await geturl2.text()
  const $$ = cheerio.load(caritoken2)
  const token2 = $$("#form_value").text()
  if (!token2) throw new Error("Token Tidak Ditemukan!!");
  const prosesimage = await post(
    "https://photooxy.com/effect/create-image",
    JSON.parse(token2),
    hasilcookie
  );
  const hasil = await prosesimage.json();
  const hassil = `https://e2.yotools.net/${hasil.image}`
  const result = await getBuffer(hassil)
  return result
}
app.get('/404', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Halaman Tidak Ditemukan</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        #particles-js {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: black;
            pointer-events: none;
        }

        .heading {
            text-align: center;
            color: blue;
            max-width: 600px;
            margin: 0 auto;
        }

        .title {
            font-size: 5rem;
            margin-bottom: 40px;
        }

        .button-container {
            text-align: center;
            animation: slideIn 2s linear;
        }

        .back-button {
            display: inline-block;
            padding: 15px 30px;
            font-size: 24px;
            background-color: #00ff00;
            color: #000;
            border-radius: 50px;
            cursor: pointer;
            opacity: 1;
            animation: fadeOut 2s linear infinite alternate; /* Mengatur animasi menghilang dan muncul */
        }

        @keyframes slideIn {
            0% {
                transform: translateX(-100%);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0;
            }
        }
    </style>
</head>
<body>
    <div id="particles-js"></div>
    <div class="heading">
        <h1 class="title">Halaman Tidak Ditemukan</h1>
        <div class="button-container">
            <a class="back-button" href="/docs">Kembali ke Docs</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script>
        window.addEventListener('load', function () {
            particlesJS("particles-js", {
                "particles": {
                    "number": {
                        "value": 100,
                        "density": {
                            "enable": true,
                            "value_area": 600
                        }
                    },
                    "color": {
                        "value": "#00ff00"
                    },
                    "shape": {
                        "type": "circle"
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": true
                    },
                    "size": {
                        "value": 3,
                        "random": true
                    },
                    "move": {
                        "enable": true,
                        "speed": 20
                    }
                }
            });
        });
    </script>
</body>
</html>
`
);
});
app.get('/', (req, res) => {
		res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta name="google-site-verification" content="oIx98k_QqyFoTp4rm_SopYhsPI_cungtn3fA5NFV5KM" />
    <meta charset="UTF-8">
    <title>Akazamd</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        #particles-js {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: black;
            pointer-events: none; 
        }

        .heading {
            text-align: left;
            color: blue;
            max-width: 600px;
            margin: 0 auto;
        }

        .title {
            font-size: 7rem; 
            margin-bottom: 40px;
        }
        .links {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            max-width: 120px;
            margin: 0 auto;
            font-size: 4rem;
            padding: 0 20px;
        }

        .animated-link {
            text-decoration: none;
            padding: 15px 30px;
            font-size: 24px;
            background-color: #00ff00;
            color: #000;
            border-radius: 50px;
            transition: transform 0.3s ease-in-out;
        }

        .animated-link:hover {
            transform: scale(1.1);
        }

        .animated-link.left-to-right {
            animation: leftToRight 2s ease-in-out 1;
        }

        .animated-link.right-to-left {
            animation: rightToLeft 2s ease-in-out 1;
        }

        @keyframes leftToRight {
            0% {
                transform: translateX(-100%);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes rightToLeft {
            0% {
                transform: translateX(100%);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @media screen and (max-width: 768px) {
            .links {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div id="particles-js"></div>
    <div class="heading">
        <h1 class="title">AKAZAMD</h1>
        <div class="links">
            <a class="animated-link right-to-left" href="docs">Documentasi</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script>
        window.addEventListener('load', function () {
            particlesJS("particles-js", {
                "particles": {
                    "number": {
                        "value": 100,
                        "density": {
                            "enable": true,
                            "value_area": 600
                        }
                    },
                    "color": {
                        "value": "#00ff00"
                    },
                    "shape": {
                        "type": "circle"
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": true
                    },
                    "size": {
                        "value": 3,
                        "random": true
                    },
                    "move": {
                        "enable": true,
                        "speed": 20
                    }
                }
            });
        });
    </script>
</body>
</html>

`);
});


app.get('/docs', (req, res) => {
		res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
<meta name="google-site-verification" content="oIx98k_QqyFoTp4rm_SopYhsPI_cungtn3fA5NFV5KM" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AKAZA_MD</title>
     <link rel="preconnect" href="https://fonts.googleapis.com">

        
        <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap" rel="stylesheet">
        <style>
html {
            margin: 0;
            padding: 0;
background: rgb(1, 8, 9); 

         background-repeat: round;
            width: 100%;
            height: 100%;
        }

body {
  margin: 0;
  padding: 0;
  font-family: 'Comic Neue', cursive;
  background: rgb(1, 8, 9); 
}

.wrapper {
  width: 1100px;
  margin: auto;
  position: relative;
}

.besar {
    font-size: 2rem;
}
.logo a {
    display: block;
    width: 100px; /* Sesuaikan ukuran yang Anda inginkan */
    height: 100px; /* Sesuaikan ukuran yang Anda inginkan */
    line-height: 100px; /* Sesuaikan ukuran yang Anda inginkan */
    text-align: center;
    text-decoration: none;
    border: 2px solid white; /* Tambahkan garis putih sebagai border */
    color: white; /* Warna teks putih */
    font-family: 'Rubik Mono One', sans-serif; /* Sesuaikan font yang Anda inginkan */
    margin-top: 10px; /* Tambahkan margin-top sesuai kebutuhan Anda */
}

.menu {
  float: right;
}

nav {
  width: 100%;
  margin: 0px;
  display: center;
  line-height: 80px;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: -1000;
  border-bottom: 1px solid #364f6b;
}

nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

nav ul li {
  float: left;
}

nav ul li a {
  color: black;
  font-weight: bold;
  text-align: center;
  padding: 0px 16px 0px 16px;
  text-decoration: none;
}

nav ul li a:hover {
  text-decoration: underline;
}

section {
  margin: auto;
  display: flex;
  margin-bottom: 50px;
}

.kolom {
  margin-top: 50px;
  margin-bottom: 50px;
}

.kolom .deskripsi {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
font-family: 'Montserrat', sans-serif;
}

h2 {
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 20px;
  width: 100%;
  line-height: 50px;
  color: white;
}

a.tbl-biru {
  background: #3f72af;
  border-radius: 20px;
  margin-top: 20px;
  padding: 15px 20px 15px 20px;
  color: #FFFFFF;
  cursor: pointer;
  font-weight: bold;
}

a.tbl-biru:hover {
  background: #fc5185;
  text-decoration: none;
}

a.tbl-pink {
  background: #fc5185;
  border-radius: 20px;
  margin-top: 20px;
  padding: 15px 20px 15px 20px;
  color: #FFFFFF;
  cursor: pointer;
  font-weight: bold;
}

a.tbl-pink:hover {
  background: #3f72af;
  text-decoration: none;
}

p {
  margin: 5px 0px 4px 0px;
  padding: 5px 0px 4px 0px;
}

.tengah {
  text-align: center;
  width: 100%;
}

#contact {
  padding: 50px 0px 50px 0px;
}

.footer {
  width: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin: auto;
}

.footer-section {
  width: 20%;
  margin: 0 auto;
}

h3 {
  font-weight: 800;
  font-size: 30px;
  margin-bottom: 20px;
  color: black;
  width: 100%;
  line-height: 50px;
}

/* ----------------- */

#copyright {
  text-align: center;
  width: 100%;
  padding: 50px 0px 50px 0px;
  margin-top: 50px;
}

@media screen and (max-width: 640px) {
  .footer {
    display: inline-block
  }
}

@media screen and (max-width: 991.98px) {
  .wrapper {
    width: 90%;
  }

  .logo a {
    display: block;
    width: 100%;
    text-align: center;
  }

  nav .menu {
    width: 100%;
    margin: 0;
  }

  nav .menu ul {
    text-align: center;
    margin: auto;
    line-height: 60px;
  }

  nav .menu ul li {
    display: inline-block;
    float: none;
  }

  section {
    display: block;
  }

  section img {
    display: block;
    width: 100%;
    height: auto;
  }
}








/* nav */

.nz {
  position: fixed;
  top: 0;
  /*left: -100%;*/
  right: -100%;
  height: 100%;
  width: 100%;
  background: #000;
  background: linear-gradient(90deg, #f92c78, #4114a1);
  /* background: linear-gradient(375deg, #1cc7d0, #2ede98); */
  /* background: linear-gradient(-45deg, #e3eefe 0%, #efddfb 100%);*/
  transition: all 0.6s ease-in-out;
  z-index: 20;
}

#active:checked~.nz {
  /*left: 0;*/
  right: 0;
}

.menu-btn {
  position: absolute;
  z-index: 21;
  right: 10px;
  /*left: 20px; */
  top: 20px;
  height: 50px;
  width: 50px;
  text-align: center;
  line-height: 60px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  /*color: #fff;*/
  background: linear-gradient(90deg, #f92c78, #4114a1);*/
  background: linear-gradient(375deg, rgba(28,199,208,0.4), rgba(12,55,200,0.2)); 
  /* background: linear-gradient(-45deg, #e3eefe 0%, #efddfb 100%);*/
  transition: all 0.5s ease-in-out;
}

.menu-btn span,
.menu-btn:before,
.menu-btn:after {
  content: "";
  position: absolute;
  top: calc(50% - 1px);
  left: 30%;
  width: 40%;
  border-bottom: 2px solid #000;
  transition: transform .6s cubic-bezier(0.215, 0.61, 0.355, 1);
  z-index: 21;
}

.menu-btn:before {
  transform: translateY(-8px);
}

.menu-btn:after {
  transform: translateY(8px);
}


.close {
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: background .6s;
}

/* closing animation */
#active:checked+.menu-btn span {
  transform: scaleX(0);
}

#active:checked+.menu-btn:before {
  transform: rotate(45deg);
  border-color: #fff;
}

#active:checked+.menu-btn:after {
  transform: rotate(-45deg);
  border-color: #fff;
}

.nz ul {
  position: absolute;
  top: 60%;
  left: 50%;
  height: 90%;
  transform: translate(-50%, -50%);
  list-style: none;
  text-align: center;
}

.nz ul li {
  height: 10%;
  margin: 15px 0;
}

.nz ul li a {
  text-decoration: none;
  font-size: 30px;
  font-weight: 500;
  padding: 5px 30px;
  color: #fff;
  border-radius: 50px;
  position: absolute;
  line-height: 50px;
  margin: 5px 30px;
  opacity: 0;
  transition: all 0.3s ease;
  transition: transform .6s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.nz ul li a:after {
  position: absolute;
  content: "";
  background: #fff;
  /*background: linear-gradient(#14ffe9, #ffeb3b, #ff00e0);*/
  /*background: linear-gradient(375deg, #1cc7d0, #2ede98);*/
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 50px;
  transform: scaleY(0);
  z-index: -1;
  transition: transform 0.3s ease;
}

.nz ul li a:hover:after {
  transform: scaleY(1);
}

.nz ul li a:hover {
  color: #1a73e8;
}

input[type="checkbox"] {
  display: none;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  text-align: center;
  width: 100%;
  color: #202020;
}

.content .title {
  font-size: 40px;
  font-weight: 700;
}

.content p {
  font-size: 35px;
  font-weight: 600;
}

#active:checked~.nz ul li a {
  opacity: 1;
}

.nz ul li a {
  transition: opacity 1.2s, transform 1.2s cubic-bezier(0.215, 0.61, 0.355, 1);
  transform: translateX(100px);
}

#active:checked~.nz ul li a {
  transform: none;
  transition-timing-function: ease, cubic-bezier(.1, 1.3, .3, 1);
  /* easeOutBackを緩めた感じ */
  transition-delay: .6s;
  transform: translateX(-100px);
}

}
.full-wrapper {
  z-index: 999;
}



/*scrolll*/



 
    html
    {
        scroll-behavior: smooth;
    }
 
    body
    {
        font-family: Arial, Helvetica, sans-serif;
    }
 
    section
    {
        border-radius: 100%;
        padding: 25px;
        
    }
 
 
    #halaman2
    {
        background-color: whitesmoke;
        width: 100px;
        height: 100px;
        text-align: center;
        text-rendering: auto;
        text-decoration: none;
        color: rgba(27, 175, 27, 0.315);
    }
    #keatas
    {
text-align: center;
text-decoration: none;

    }
    /*video*/
.fullscreen-bg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    z-index: 102039388;
}
 
.bg-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
 
@media (min-aspect-ratio: 16/9) {
    .bg-video {
        height: 300%;
        top: -100%;
    }
}
 
@media (max-aspect-ratio: 16/9) {
    .bg-video {
        width: 300%;
        left: -100%;
    }
}
 
@media (max-width: 767px) {
    .fullscreen-bg {
        background: url('poster.jpg') center center / cover no-repeat;
    }
 
    .bg-video {
        display: none;
    }
}
.row{
  display:flex;
  justify-content:center;
  margin-top:1rem;
}
.mr-2{
  margin-right: 0.5rem;
}
.akaza1{
    font-family: Comic Sans MS;  
    font-size: 1rem;   
    background: rgb(99, 75, 75);  
    color: white;  
    border: brown 0.2rem solid; 
    border-radius: 0.5rem; 
    padding: 0.8rem 1.8rem; 
    margin-top: 1rem; 
    text-decoration: none; 
    text-align: center;
    display: flex;
}

.akaza1:hover{
   opacity:0.9;
}
.ini_text {
color: white;
    text-decoration:none; 
font-family: Comic Sans MS; 
}
</style>
</head>
<body>
 
    <section id="halaman1">
<div class="full-wrapper">
    <input type="checkbox" id="active">
    <label for="active" class="menu-btn"><span></span></label>
    <label for="active" class="close"></label>
    <div class="nz">
      <ul>
<li><a href="./index.html">Home</a></li>
<li><a href="./artikel/loading2.html">articel</a></li>
<li><a href="#">Gallery</a></li>
<li><a href="https://wa.me/6283843362676">Feedback</a></li>
</ul>
</div>
      <h1>
            <div class="logo besar"><a href='#'>AKAZA_MD</a>
            </div>   
            </h1>
         
  <div class="wrapper">  
        <section id="home">
            <div class="kolom">
                <h2 class="deskripsi">WELCOME TO AKAZA MD </h2>
            </div>
        </section>
<div class="ini_text">

     <div data-aos="fade-right" data-aos-anchor-placement="top-center" data-aos-easing="ease-out" data-aos-duration="1000">Dapatkan Akses ke Rest-Api Ini Secara Gratis Tanpa ada Biaya Sama sekali.</div>
</div>
    <div data-aos="fade-right" data-aos-anchor-placement="top-center" data-aos-easing="ease-out" data-aos-duration="1000">Aku akan Selalu Mengupdate Web ini Secara Bertahap</div>
<div class="ini_text">
    <div data-aos="fade-right" data-aos-anchor-placement="top-center" data-aos-easing="ease-out" data-aos-duration="1000">Jika Kalian ingin mensupport project ini silahkan Donate saja.</div>

    <div data-aos="fade-right" data-aos-anchor-placement="top-center" data-aos-easing="ease-out" data-aos-duration="1000">Link Donate (belum buat) </div>
    </div>
</div>
      <h2><a href="https://www.youtube.com/@akazamd909" class="akaza1">YOUTUBE_OFFICIAL</a>
                   <h2><a href="https://chat.whatsapp.com/F0xsURDzqHz4pUbmkCaVO2" class="akaza1">GROUP_OFFICIAL</a></h2>
<div class="ini_text">
             <div data-aos="fade-right" data-aos-anchor-placement="top-center" data-aos-easing="ease-out" data-aos-duration="1000">Peringatan Jika Ada Orang Yang mengaku sebagai pemilik Rest-Api ini Kecuali nomor owner di tombol di bawah maka itu bukan</div>
</div>
<section id="courses">

            <div class="kolom">
               <h2> <a href="https://wa.me/6283843362676"class="akaza1">OWNER</a></h2>
                  <h2> <a href="/welcome?username=akaza&guildName=Almd&guildIcon=https://telegra.ph/file/c8307b624a194c2a056b8.jpg&memberCount=1000&avatar=https://telegra.ph/file/c8307b624a194c2a056b8.jpg&bg=https://telegra.ph/file/c8307b624a194c2a056b8.jpg"class="akaza1">Welcome-Maker</a></h2>
                  <h2> <a href="/leave?username=akaza&guildName=Almd&guildIcon=https://telegra.ph/file/c8307b624a194c2a056b8.jpg&memberCount=1000&avatar=https://telegra.ph/file/c8307b624a194c2a056b8.jpg&bg=https://telegra.ph/file/c8307b624a194c2a056b8.jpg"class="akaza1">Leave-Maker</a></h2>
                  <h2> <a href="/verif?username=akaza&guildName=Almd&guildIcon=https://telegra.ph/file/c8307b624a194c2a056b8.jpg&memberCount=1000&avatar=https://telegra.ph/file/c8307b624a194c2a056b8.jpg&bg=https://telegra.ph/file/c8307b624a194c2a056b8.jpg"class="akaza1">Verif-maker</a></h2>                  
          <h2> <a href="/ytmp4?link=https://youtu.be/1FOKz0xpt8Y?si=LYMLYCToRuZAO9i8l"class=akaza1>Youtube-Download-mp4</text-to-images></a></h2>
                           <h2> <a href="/scraper-textpro2?text=akaza&text2=hooh&link=https://textpro.me/create-logo-style-marvel-studios-ver-metal-972.html"class=akaza1>Scraper textpro 2</a></h2>
                           <h2> <a href="/scraper-textpro?text=akaza&link=https://textpro.me/neon-light-text-effect-with-galaxy-style-981.html"class=akaza1>Scraper textpro 1</a></h2>
   <h2> <a href="/ytmp3?link=https://youtu.be/1FOKz0xpt8Y?si=LYMLYCToRuZAO9i8l"class=akaza1>Youtube-Download-mp3</text-to-images></a></h2>
                                <h2> <a href="/attp?text=akazamd"class=akaza1>attp</a></h2>
<h2> <a href="/ttp?text=akazamd"class=akaza1>ttp</a></h2>
<h2> <a href="/ai-midjourney?text=highly%20detailed,%20intricate,%204k,%208k,%20sharp%20focus,%20detailed%20hair,%20detailed&apikey=api%20lu"class=akaza1>ai-midjourney</a></h2>
                              <h2> <a href="/welcome2?name=gimana&grub=nama_grup&member=10&pp=https://telegra.ph/file/c8307b624a194c2a056b8.jpg&bg=https://i.ibb.co/tYgwwT2/images-2.jpg"class=akaza1>Welcome2</a></h2>
                                         <h2> <a href="/tebakbendera?"class=akaza1>tebakbendera</a></h2>
                                         <h2> <a href="/api-ai?text=apa+itu+ikan"class=akaza1>ai</a></h2>
                                         <h2> <a href="/api-bardai?text=apa+kamu+bard"class=akaza1>bard</a></h2>
            </div>
        </section>
        <section id="tutors">
            <div class="tengah">
                <div class="kolom">
                    <p class="deskripsi">YANG MAU kontribusi SILAHKAN DONATE KE NOMER DI BAWAH</p>
                    <p class="deskripsi">DANA:83843362676</p>
                    <p class="deskripsi">PULSA:083843362676</p>
                    <p class="deskripsi">GOPAY:083843362676</p>
<p class="deskripsi">Note gw gk maksa</p>
                </div>
                <section id="tutors">
                    <div class="tengah">
                        <div class="kolom">
                </div>
                <section id="tutors">
                    <div class="tengah">
                        <div class="kolom">

<h2> <a href="https://abad.id"class="akaza1">Insipirated</a></h2>
    </div>
</div>
    <div id="copyright">
        <div class="wrapper">
            &copy; 2023 <b>AKAZA_MD</b> All Rights Reserved.
        </div>
    </div>
     <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
  <script src="https://unpkg.com/aos@next/dist/aos.js"></script> 
<script>   
     AOS.init(); 
</script>
</body>
</html>
`);
});

app.get("/welcome", generateImage("welcome"));

app.get("/leave", generateImage("leave"));

app.get("/verif", generateImage("verification"));

app.get("/ytmp4", handleYTDownload("mp4"));

app.get("/ytmp3", handleYTDownload("mp3"));
function generateImage(type) {
  return (req, res) => {
    const user = req.query.user || "anonimus";
    logger.info(chalk.blue(`User ${user} accessed route ${type}.`));

    const { username, guildName, guildIcon, memberCount, avatar, bg } = req.query;

    if (type === "verification" && (!username || !avatar || !bg)) {
      logger.error(chalk.red(`/${type} request is incomplete.`));
      res.status(400).send("Fill in all the required parameters.");
      return;
    }

    if (type !== "verification" && (!username || !guildName || !guildIcon || !memberCount || !avatar || !bg)) {
      logger.error(chalk.red(`/${type} request is incomplete.`));
      res.status(400).send("Fill in all the required parameters.");
      return;
    }

    async function generateImage() {
      let imageBuilder;

      if (type === "welcome") {
        imageBuilder = new ling.Welcome()
          .setUsername(username)
          .setGuildName(guildName)
          .setGuildIcon(guildIcon)
          .setMemberCount(memberCount)
          .setAvatar(avatar)
          .setBackground(bg);
      } else if (type === "leave") {
        imageBuilder = new ling.Goodbye()
          .setUsername(username)
          .setGuildName(guildName)
          .setGuildIcon(guildIcon)
          .setMemberCount(memberCount)
          .setAvatar(avatar)
          .setBackground(bg);
      } else if (type === "verification") {
        imageBuilder = new ling.Verification()
          .setUsername(username)
          .setGuildName(guildName)
          .setGuildIcon(guildIcon)
          .setMemberCount(memberCount)
          .setAvatar(avatar)
          .setBackground(bg);
      }

      const image = await imageBuilder.toAttachment();

      const imageData = image.toBuffer();
      fs.writeFileSync(`./${type}.png`, imageData);
      res.sendFile(__dirname + `/${type}.png`);
    }

    generateImage();
  };
}
app.get("/scraper-textpro", async (req, res) => {
  const { text, link } = req.query;

  if (!text || !link) {
    res.status(400).send("Both 'text' and 'link' parameters are required.");
    return;
  }

  try {
    const image = await textpro(link, text);
    res.contentType("image/jpeg").send(image);
  } catch (err) {
    res.status(500).send("Error generating TextPro image.");
  }
});
app.get("/scraper-textpro2", async (req, res) => {
  const { text, text2, link } = req.query;

  if (!text || !link) {
    res.status(400).send("Both 'text' and 'link' parameters are required.");
    return;
  }

  try {
    const image = await textpro(link, [text, text2]);
    res.contentType("image/jpeg").send(image);
  } catch (err) {
    res.status(500).send("Error generating TextPro2 image.");
  }
});

function handleYTDownload(format) {
  return async (req, res) => {
    const { link } = req.query;

    if (!link) {
      logger.error(chalk.red(`URL parameter is missing.`));
      res.status(400).json({ error: "URL parameter is required." });
      return;
    }

    const user = req.query.user || "anonimus";
    logger.info(chalk.blue(`User ${user} requested ${format.toUpperCase()} download for ${link}.`));

    try {
      let result;
      if (format === "mp4") {
        result = await ytMp4(link);
      } else if (format === "mp3") {
        result = await ytMp3(link);
      }

      if (result) {
        const response = {
          title: result.title,
          result: result.result,
          quality: result.quality,
          size: result.size,
          thumb: result.thumb,
          views: result.views,
          channel: result.channel,
          uploadDate: result.uploadDate,
          desc: result.desc,
        };

        res.json(response);
      } else {
        logger.error(chalk.red(`Failed to fetch or process ${format.toUpperCase()} download for ${link}.`));
        res.status(500).json({ error: `Failed to fetch or process ${format.toUpperCase()} download.` });
      }
    } catch (error) {
      logger.error(chalk.red(`An error occurred while processing ${format.toUpperCase()} download for ${link}.`));
      res.status(500).json({ error: `An error occurred while processing ${format.toUpperCase()} download.` });
    }
  };
}

function bytesToSize(bytes) {
  return new Promise((resolve, reject) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) resolve(`${bytes} ${sizes[i]}`);
    resolve(`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`);
  });
}
function ytMp4(url) {
  return new Promise(async (resolve, reject) => {
    ytdl.getInfo(url).then(async (getUrl) => {
      let result = [];
      for (let i = 0; i < getUrl.formats.length; i++) {
        let item = getUrl.formats[i];
        if (item.container == 'mp4' && item.hasVideo == true && item.hasAudio == true) {
          let { qualityLabel, contentLength } = item;
          let bytes = await bytesToSize(contentLength);
          result[i] = {
            video: item.url,
            quality: qualityLabel,
            size: bytes
          };
        }
      }
      let resultFix = result.filter(x => x.video != undefined && x.size != undefined && x.quality != undefined);
      let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].video}`);
      let tinyUrl = tiny.data;
      let title = getUrl.videoDetails.title;
      let desc = getUrl.videoDetails.description;
      let views = millify(getUrl.videoDetails.viewCount);
      let channel = getUrl.videoDetails.ownerChannelName;
      let uploadDate = getUrl.videoDetails.uploadDate;
      let thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
      resolve({
        title,
        result: tinyUrl,
        quality: resultFix[0].quality,
        size: resultFix[0].size,
        thumb,
        views,
        channel,
        uploadDate,
        desc
      });
    }).catch(err => {
      resolve();
    });
  });
}

function ytMp3(url) {
  return new Promise((resolve, reject) => {
    ytdl.getInfo(url).then(async (getUrl) => {
      let result = [];
      for (let i = 0; i < getUrl.formats.length; i++) {
        let item = getUrl.formats[i];
        if (item.mimeType == 'audio/webm; codecs=\"opus\"') {
          let { contentLength } = item;
          let bytes = await bytesToSize(contentLength);
          result[i] = {
            audio: item.url,
            size: bytes
          };
        }
      }
      let resultFix = result.filter(x => x.audio != undefined && x.size != undefined);
      let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].audio}`);
      let tinyUrl = tiny.data;
      let title = getUrl.videoDetails.title;
      let desc = getUrl.videoDetails.description;
      let views = millify(getUrl.videoDetails.viewCount);
      let channel = getUrl.videoDetails.ownerChannelName;
      let uploadDate = getUrl.videoDetails.uploadDate;
      let thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
      resolve({
        title,
        result: tinyUrl,
        size: resultFix[0].size,
        thumb,
        views,
        channel,
        uploadDate,
        desc
      });
    }).catch(err => {
      resolve();
    });
  });
}
app.get("/api-ai", async (req, res) => {
  const { text } = req.query;

  if (!text) {
    res.status(400).json({ status: false, message: "Parameter 'text' diperlukan." });
    return;
  }

  try {
    const openai = new OpenAI({
      apiKey: global.openai,
    });
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    const answer = response.choices[0].text;
    res.json({
      status: true,
      creator: "akaza",
      result: answer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Sedang dalam perbaikan" });
  }
});

app.get("/api-bardai", async (req, res) => {
  const { text } = req.query;

  if (!text) {
    res.status(400).json({ status: false, message: "Parameter 'text' diperlukan." });
    return;
  }

  try {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateInfo = now.toLocaleDateString('id-ID', options);
    const openai = new OpenAI({
      apiKey: global.openai,
    });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `info: kamu mengetahui bahwa waktu saat ini adalah ${dateInfo}
info: kamu mengetahui bahwa setiap hari Minggu adalah hari libur untuk pelajar
info: kamu adalah bard-ai, google-bard, google bard, bard googleyang dibuat oleh google
info: jika orang menanyakan model kamu apa maka kamu menjawab model aku Bard-Ai
info: jika seseorang menyuruh untuk mengucapkan selamat atau apapun ke orang lain maka ucapkan lah
pertanyaan: ${text}`,
        },
        {
          role: 'system',
          content: 'kamu adalah Google bard',
        },
      ],
    });

    const answer = response.choices[0].message.content;
    res.json({
      status: true,
      creator: "akaza",
      result: answer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Sedang dalam perbaikan" });
  }
});
app.get('/welcome2', async (req, res, next) => {
    var name = req.query.name;
    var grup = req.query.gpname;
    var member = req.query.member;
    var pp = req.query.pp;
    var bg = req.query.bg;

    var imgpp = await isImageURL(pp);
    var bgimg = await isImageURL(bg);

    if (!name || !grup || !member || !pp || !bg || !imgpp || !bgimg) {
        return res.json({ status: false, creator: 'akaza', message: "[!] Invalid parameters or image URLs." });
    }

    Canvas.registerFont('./fitur/font/Creme.ttf', { family: 'creme' });

    var welcomeCanvas = {};
    welcomeCanvas.create = Canvas.createCanvas(1024, 500);
    welcomeCanvas.context = welcomeCanvas.create.getContext('2d');
    welcomeCanvas.context.font = '72px creme';
    welcomeCanvas.context.fillStyle = '#ffffff';

    await Canvas.loadImage("./welcome2.jpg").then(async (img) => {
        welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500);
    });

    let can = welcomeCanvas;

    await Canvas.loadImage(bg).then((bg) => {
        can.context.drawImage(bg, 320, 0, 709, 360);
    });

    let canvas = welcomeCanvas;
    canvas.context.beginPath();
    canvas.context.arc(174, 279, 115, 0, Math.PI * 2, true);
    canvas.context.stroke();
    canvas.context.fill();
    canvas.context.font = '100px creme';
    canvas.context.textAlign = 'center';
    canvas.context.fillText("Welcome", 670, 140);
    canvas.context.font = '100px Helvetica';
    canvas.context.fillText("____   ____", 670, 160);
    canvas.context.fillText("✩", 670, 215);
    canvas.context.font = '100px creme';
    canvas.context.fillText(shortText(grup, 17), 670, 300);
    canvas.context.font = '40px creme';
    canvas.context.textAlign = 'start';
    canvas.context.fillText(shortText(name, 40), 420, 420);
    canvas.context.font = '35px creme';
    canvas.context.fillText(`${shortText(member, 10)} th member`, 430, 490);
    canvas.context.beginPath();
    canvas.context.arc(174, 279, 110, 0, Math.PI * 2, true);
    canvas.context.closePath();
    canvas.context.clip();

    await Canvas.loadImage(pp).then((pp) => {
        canvas.context.drawImage(pp, 1, 150, 300, 300);
    });

    res.set({ 'Content-Type': 'image/png' });
    res.send(canvas.create.toBuffer());
});
app.get('/attp', async (req, res, next) => {
  try {
    const text = req.query.text;
    const response = await fetch(`https://api.erdwpe.com/api/maker/attp?text=${text}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync('./attp.gif', Buffer.from(buffer));
    res.sendFile(__dirname + '/attp.gif');
  } catch (error) {
    next(error);
  }
});
async function Draw(prompt) {
  const response = await fetch("https://api-inference.huggingface.co/models/prompthero/openjourney-v4", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${global.hugging}`,
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return buffer;
}
app.get("/goodbay2", async (req, res, next) => {
try {
var name = req.query.name;
 var gpname = req.query.gpname;
var member = req.query.member
var pp = req.query.pp;
var bg = req.query.bg;
let hooh = await fetch(`https://api.erdwpe.com/api/maker/goodbye1?name=${name}&gpname=${gpname}&member=${member}&pp=${pp}&bg=${pp}`)
const buffer = await hooh.arrayBuffer();
    fs.writeFileSync('./goodbay2.png', Buffer.from(buffer));
    res.sendFile(__dirname + '/goodbay2.png');
  } catch (error) {
    next(error);
  }
});

app.get("/ai-midjourney", async (req, res, next) => {
  try {
    var text = req.query.text;
    var apikey = req.query.apikey;

    if (!apikey || !global.apikey.includes(apikey)) {
      logger.error(chalk.red(`URL parameter is missing or invalid apikey.`));
      res.status(400).json({ Note: "Apikey mu mana fitur ini premium beli ke 6283843362676 murah 2k aja seminggu" });
      return;
    }

    const img = await Draw(text);
    fs.writeFileSync('./midjourney.png', img);
    res.sendFile(__dirname + '/midjourney.png'); // Memperbaiki path dengan '/' di awal
  } catch (error) {
    next(error);
  }
});

app.get('/ttp', async (req, res, next) => {
try {
var text = req.query.text;
let hasil = await fetch(`https://api.erdwpe.com/api/maker/ttp?text=${text}`)
const buffer = await hasil.arrayBuffer();
    fs.writeFileSync('./ttp.png', Buffer.from(buffer));
    res.sendFile(__dirname + '/ttp.png');
  } catch (error) {
    next(error);
  }
});
app.get('/scraper-textpro2', async (req, res) => {
  const text1 = req.query.text;
  const text2 = req.query.text2;
  const link = req.query.link;

  try {
    const imageBuffer = await textpro2(link, text1, text2);
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});
app.get('/tebakbendera', async (req, res, next) => {
	let ra = await axios.get('https://raw.githubusercontent.com/AKAZAMD/AKAZAMDbotz/main/scraper/bendera.json')
    let j = await ra.data;
	let ha = j[Math.floor(Math.random() * j.length)]
  res.json({
	status: true,
	creator: `Akazamd`,
	result: ha
})

})
app.use(function (err, req, res, next) {
  res.render("/404");
});
app.listen(port, () => {
  logger.info(chalk.green(`Server is running on port ${port}.`));
});
