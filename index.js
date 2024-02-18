/*
Note: Semua Kode ini Sendirian di Koding Oleh Akazamd
Dan sedikit bantuan chatgpt untuk menyempurnakanya
Jangan Dijual !!
*/


const express = require("express");
const app = express();
const port = 3001;
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
const path = require('path');
const favicon = require('serve-favicon');
const { youtubedl } = require('scraper');
const yts = require("yt-search");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const isImageURL = require('image-url-validator').default
global.openai = "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";
global.apikey = ['namalu22', 'Rest-Api-Premium1'];
global.hugging = "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";
app.use(express.json());

app.use(express.static(publicDirectoryPath));

async function faviconi() {
  const iconBuffer = await (await fetch("https://raw.githubusercontent.com/AKAZAMD/style-rest-api/main/icon.ico")).buffer();
  app.use(favicon(Buffer.from(iconBuffer)));
}


faviconi();


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const igdl = async (urlku) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        "https://snapinsta.tv/core/ajax.php",
        new URLSearchParams({
          url: urlku,
          host: "instagram",
        }),
        {
          headers: {
            accept: "*/*",
            cookie:
              "PHPSESSID=a457b241510ae4498043da9e765de30c; _gid=GA1.2.1007159517.1698108684; _gat_gtag_UA_209171683_55=1; _no_tracky_101422226=1; _ga_N43B1RQRDX=GS1.1.1698108684.1.1.1698108695.0.0.0; _ga=GA1.1.1466088105.1698108684",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
          },
        }
      );

      const $ = cheerio.load(response.data);
      const mediaURL = $(
        "div.row > div.col-md-12 > div.row.story-container.mt-4.pb-4.border-bottom"
      )
        .map((_, el) => {
          return (
            "https://snapinsta.tv/" +
            $(el).find("div.col-md-8.mx-auto > a").attr("href")
          );
        })
        .get();

      const res = {
        status: 200,
        media: mediaURL,
      };

      console.log(res);
      resolve(res);
    } catch (e) {
      console.log(e);
      reject({
        status: 400,
        message: "error",
      });
    }
  });
};
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
async function ssweb (url, device = 'desktop')  {
		return new Promise((resolve, reject) => {
			 const base = 'https://www.screenshotmachine.com'
			 const param = {
			   url: url,
			   device: device,
			   cacheLimit: 0
			 }
			 axios({url: base + '/capture.php',
				  method: 'POST',
				  data: new URLSearchParams(Object.entries(param)),
				  headers: {
					   'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
				  }
			 }).then((data) => {
				  const cookies = data.headers['set-cookie']
				  if (data.data.status == 'success') {
					   axios.get(base + '/' + data.data.link, {
							headers: {
								 'cookie': cookies.join('')
							},
							responseType: 'arraybuffer'
					   }).then(({ data }) => {
							resolve(data)
					   })
				  } else {
					   reject()
				  }
			 }).catch(reject)
		})
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
    res.send(`<p> NOT FOUND<p>
    <a href="/">BACK HOME<a>
`
);
});

app.get('/', (req, res) => {
		res.send(`
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akazamd - APIs</title>
<meta name="google-site-verification" content="oIx98k_QqyFoTp4rm_SopYhsPI_cungtn3fA5NFV5KM" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.11/typed.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"/>
    <meta name="description" content="Akaza-RestApi Adalah Rest api gratis untuk semua orang dengan fitur melimpah tanpa login">
<link rel="shortcut icon" type="image/x-icon" href="https://i.ibb.co/Rz3Bjpg/whats-ur-opinion-about-akaza-v0-ecynlgmlf5jb1.jpg" />
  <link rel="icon" sizes="192x192" href="https://i.ibb.co/Rz3Bjpg/whats-ur-opinion-about-akaza-v0-ecynlgmlf5jb1.jpg" />
</head>
<body>
    <div class="scroll-up-btn">
        <i class="fas fa-angle-up"></i>
    </div>
    <nav class="navbar">
        <div class="max-width">
            <div class="logo"><a href="#">Akaza <span>MD</span></a></div>
            <ul class="menu">
                <li><a href="/" class="menu-btn">Home</a></li>
                <li><a href="/docs" class="menu-btn">Documentation</a></li>
                <li><a href="/404" class="menu-btn">Portofolio</a></li>
            </ul>
            <div class="menu-btn">
                <i class="fas fa-bars"></i>
            </div>
        </div>
    </nav>

    <!-- home section start -->
    <section class="home" id="home">
        <div class="max-width">
            <div class="home-content">
                <div class="text-1">Hello, My Name Is</div>
                <div class="text-2">Akazamd</div>
                <div class="text-3">hobi ku adalah<span class="typing"></span></div>
                <a href="/docs">Documentation</a>
            </div>
        </div>
    </section>

    <!-- footer section start -->
    <footer>
        <span>Copyright <span class="far fa-copyright"></span> 2023 <a href="/about">akazamd</a>. All rights reserved.</span>
    </footer>

    <script>
    $(document).ready(function(){
    $(window).scroll(function(){
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        $('html').css("scrollBehavior", "auto");
    });
    $('.navbar .menu li a').click(function(){
        $('html').css("scrollBehavior", "smooth");
    });
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });
    var typed = new Typed(".typing", {
        strings: ["main Game", "Nonton Youtube"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });
    var typed = new Typed(".typing-2", {
        strings: ["main Game", "Nonton Youtube"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
                nav: false
            },
            600:{
                items: 2,
                nav: false
            },
            1000:{
                items: 3,
                nav: false
            }
        }
    });
});
	</script>
</body>
<style>
	/*  import google fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Ubuntu:wght@400;500;700&display=swap');

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
}
html{
    scroll-behavior: smooth;
}

/* custom scroll bar */
::-webkit-scrollbar {
    width: 10px;
}
::-webkit-scrollbar-track {
    background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
    background: #888;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* all similar content styling codes */
section{
    padding: 100px 0;
}
.max-width{
    max-width: 1300px;
    padding: 0 80px;
    margin: auto;
}
.about, .services, .skills, .teams, .contact, footer{
    font-family: 'Poppins', sans-serif;
}
.about .about-content,
.services .serv-content,
.skills .skills-content,
.contact .contact-content{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
}
section .title{
    position: relative;
    text-align: center;
    font-size: 40px;
    font-weight: 500;
    margin-bottom: 60px;
    padding-bottom: 20px;
    font-family: 'Ubuntu', sans-serif;
}
section .title::before{
    content: "";
    position: absolute;
    bottom: 0px;
    left: 50%;
    width: 180px;
    height: 3px;
    background: #111;
    transform: translateX(-50%);
}
section .title::after{
    position: absolute;
    bottom: -8px;
    left: 50%;
    font-size: 20px;
    color: crimson;
    padding: 0 5px;
    background: #fff;
    transform: translateX(-50%);
}

/* navbar styling */
.navbar{
    position: fixed;
    width: 100%;
    z-index: 999;
    padding: 30px 0;
    font-family: 'Ubuntu', sans-serif;
    transition: all 0.3s ease;
}
.navbar.sticky{
    padding: 15px 0;
    background: crimson;
}
.navbar .max-width{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.navbar .logo a{
    color: #fff;
    font-size: 35px;
    font-weight: 600;
}
.navbar .logo a span{
    color: crimson;
    transition: all 0.3s ease;
}
.navbar.sticky .logo a span{
    color: #fff;
}
.navbar .menu li{
    list-style: none;
    display: inline-block;
}
.navbar .menu li a{
    display: block;
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    margin-left: 25px;
    transition: color 0.3s ease;
}
.navbar .menu li a:hover{
    color: crimson;
}
.navbar.sticky .menu li a:hover{
    color: #fff;
}

/* menu btn styling */
.menu-btn{
    color: #fff;
    font-size: 23px;
    cursor: pointer;
    display: none;
}
.scroll-up-btn{
    position: fixed;
    height: 45px;
    width: 42px;
    background: crimson;
    right: 30px;
    bottom: 10px;
    text-align: center;
    line-height: 45px;
    color: #fff;
    z-index: 9999;
    font-size: 30px;
    border-radius: 6px;
    border-bottom-width: 2px;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
}
.scroll-up-btn.show{
    bottom: 30px;
    opacity: 1;
    pointer-events: auto;
}
.scroll-up-btn:hover{
    filter: brightness(90%);
}


/* home section styling */
.home{
    display: flex;
    background: url("https://media.tenor.com/-9rym9F112EAAAAd/ocean.gif") no-repeat center;
    height: 100vh;
    color: #fff;
    min-height: 500px;
    background-size: cover;
    background-attachment: fixed;
    font-family: 'Ubuntu', sans-serif;
}
.home .max-width{
  width: 100%;
  display: flex;
}
.home .max-width .row{
  margin-right: 0;
}
.home .home-content .text-1{
    font-size: 27px;
}
.home .home-content .text-2{
    font-size: 75px;
    font-weight: 600;
    margin-left: -3px;
}
.home .home-content .text-3{
    font-size: 40px;
    margin: 5px 0;
}
.home .home-content .text-3 span{
    color: crimson;
    font-weight: 500;
}
.home .home-content a{
    display: inline-block;
    background: crimson;
    color: #fff;
    font-size: 25px;
    padding: 12px 36px;
    margin-top: 20px;
    font-weight: 400;
    border-radius: 6px;
    border: 2px solid crimson;
    transition: all 0.3s ease;
}
.home .home-content a:hover{
    color: crimson;
    background: none;
}

/* about section styling */
.about .title::after{
    content: "who i am";
}
.about .about-content .left{
    width: 45%;
}
.about .about-content .left img{
    height: 400px;
    width: 400px;
    object-fit: cover;
    border-radius: 6px;
}
.about .about-content .right{
    width: 55%;
}
.about .about-content .right .text{
    font-size: 25px;
    font-weight: 600;
    margin-bottom: 10px;
}
.about .about-content .right .text span{
    color: crimson;
}
.about .about-content .right p{
    text-align: justify;
}
.about .about-content .right a{
    display: inline-block;
    background: crimson;
    color: #fff;
    font-size: 20px;
    font-weight: 500;
    padding: 10px 30px;
    margin-top: 20px;
    border-radius: 6px;
    border: 2px solid crimson;
    transition: all 0.3s ease;
}
.about .about-content .right a:hover{
    color: crimson;
    background: none;
}

/* services section styling */
.services, .teams{
    color:#fff;
    background: #111;
}
.services .title::before,
.teams .title::before{
    background: #fff;
}
.services .title::after,
.teams .title::after{
    background: #111;
    content: "what i provide";
}
.services .serv-content .card{
    width: calc(33% - 20px);
    background: #222;
    text-align: center;
    border-radius: 6px;
    padding: 50px 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}
.services .serv-content .card:hover{
    background: crimson;
}
.services .serv-content .card .box{
    transition: all 0.3s ease;
}
.services .serv-content .card:hover .box{
    transform: scale(1.05);
}
.services .serv-content .card i{
    font-size: 50px;
    color: crimson;
    transition: color 0.3s ease;
}
.services .serv-content .card:hover i{
    color: #fff;
}
.services .serv-content .card .text{
    font-size: 25px;
    font-weight: 500;
    margin: 10px 0 7px 0;
}

/* skills section styling */

.skills .title::after{
    content: "what i know";
}
.skills .skills-content .column{
    width: calc(50% - 30px);
}
.skills .skills-content .left .text{
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
}
.skills .skills-content .left p{
    text-align: justify;
}
.skills .skills-content .left a{
    display: inline-block;
    background: crimson;
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    padding: 8px 16px;
    margin-top: 20px;
    border-radius: 6px;
    border: 2px solid crimson;
    transition: all 0.3s ease;
}
.skills .skills-content .left a:hover{
    color: crimson;
    background: none;
}
.skills .skills-content .right .bars{
    margin-bottom: 15px;
}
.skills .skills-content .right .info{
    display: flex;
    margin-bottom: 5px;
    align-items: center;
    justify-content: space-between;
}
.skills .skills-content .right span{
    font-weight: 500;
    font-size: 18px;
}
.skills .skills-content .right .line{
    height: 5px;
    width: 100%;
    background: lightgrey;
    position: relative;
}
.skills .skills-content .right .line::before{
    content: "";
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    background: crimson;
}
.skills-content .right .html::before{
    width: 90%;
}
.skills-content .right .css::before{
    width: 60%;
}
.skills-content .right .js::before{
    width: 80%;
}
.skills-content .right .php::before{
    width: 50%;
}
.skills-content .right .mysql::before{
    width: 70%;
}

/* teams section styling */
.teams .title::after{
    content: "who with me";
}
.teams .carousel .card{
    background: #222;
    border-radius: 6px;
    padding: 25px 35px;
    text-align: center;
    overflow: hidden;
    transition: all 0.3s ease;
}
.teams .carousel .card:hover{
    background: crimson;
}
.teams .carousel .card .box{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}
.teams .carousel .card:hover .box{
    transform: scale(1.05);
}
.teams .carousel .card .text{
    font-size: 25px;
    font-weight: 500;
    margin: 10px 0 7px 0;
}
.teams .carousel .card img{
    height: 150px;
    width: 150px;
    object-fit: cover;
    border-radius: 50%;
    border: 5px solid crimson;
    transition: all 0.3s ease;
}
.teams .carousel .card:hover img{
    border-color: #fff;
}
.owl-dots{
    text-align: center;
    margin-top: 20px;
}
.owl-dot{
    height: 13px;
    width: 13px;
    margin: 0 5px;
    outline: none!important;
    border-radius: 50%;
    border: 2px solid crimson!important;
    transition: all 0.3s ease;
}
.owl-dot.active{
    width: 35px;
    border-radius: 14px;
}
.owl-dot.active,
.owl-dot:hover{
    background: crimson!important;
}

/* contact section styling */
.contact .title::after{
    content: "get in touch";
}
.contact .contact-content .column{
    width: calc(50% - 30px);
}
.contact .contact-content .text{
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
}
.contact .contact-content .left p{
    text-align: justify;
}
.contact .contact-content .left .icons{
    margin: 10px 0;
}
.contact .contact-content .row{
    display: flex;
    height: 65px;
    align-items: center;
}
.contact .contact-content .row .info{
    margin-left: 30px;
}
.contact .contact-content .row i{
    font-size: 25px;
    color: crimson;
}
.contact .contact-content .info .head{
    font-weight: 500;
}
.contact .contact-content .info .sub-title{
    color: #333;
}
.contact .right form .fields{
    display: flex;
}
.contact .right form .field,
.contact .right form .fields .field{
    height: 45px;
    width: 100%;
    margin-bottom: 15px;
}
.contact .right form .textarea{
    height: 80px;
    width: 100%;
}
.contact .right form .name{
    margin-right: 10px;
}
.contact .right form .field input,
.contact .right form .textarea textarea{
    height: 100%;
    width: 100%;
    border: 1px solid lightgrey;
    border-radius: 6px;
    outline: none;
    padding: 0 15px;
    font-size: 17px;
    font-family: 'Poppins', sans-serif;
    transition: all 0.3s ease;
}
.contact .right form .field input:focus,
.contact .right form .textarea textarea:focus{
    border-color: #b3b3b3;
}
.contact .right form .textarea textarea{
  padding-top: 10px;
  resize: none;
}
.contact .right form .button-area{
  display: flex;
  align-items: center;
}
.right form .button-area button{
  color: #fff;
  display: block;
  width: 160px!important;
  height: 45px;
  outline: none;
  font-size: 18px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  flex-wrap: nowrap;
  background: crimson;
  border: 2px solid crimson;
  transition: all 0.3s ease;
}
.right form .button-area button:hover{
  color: crimson;
  background: none;
}
/* footer section styling */
footer{
    background: #111;
    padding: 15px 23px;
    color: #fff;
    text-align: center;
}
footer span a{
    color: crimson;
    text-decoration: none;
}
footer span a:hover{
    text-decoration: underline;
}


/* responsive media query start */
@media (max-width: 1104px) {
    .about .about-content .left img{
        height: 350px;
        width: 350px;
    }
}

@media (max-width: 991px) {
    .max-width{
        padding: 0 50px;
    }
}
@media (max-width: 947px){
    .menu-btn{
        display: block;
        z-index: 999;
    }
    .menu-btn i.active:before{
        content: "\f00d";
    }
    .navbar .menu{
        position: fixed;
        height: 100vh;
        width: 100%;
        left: -100%;
        top: 0;
        background: #111;
        text-align: center;
        padding-top: 80px;
        transition: all 0.3s ease;
    }
    .navbar .menu.active{
        left: 0;
    }
    .navbar .menu li{
        display: block;
    }
    .navbar .menu li a{
        display: inline-block;
        margin: 20px 0;
        font-size: 25px;
    }
    .home .home-content .text-2{
        font-size: 70px;
    }
    .home .home-content .text-3{
        font-size: 35px;
    }
    .home .home-content a{

    .services .serv-content .card{
        width: 100%;
    }
}

@media (max-width: 500px) {
    .home .home-content .text-2{
        font-size: 50px;
    }
    .home .home-content .text-3{
        font-size: 27px;
    }
    .about .about-content .right .text,
    .skills .skills-content .left .text{
        font-size: 19px;
    }
    .contact .right form .fields{
        flex-direction: column;
    }
    .contact .right form .name,
    .contact .right form .email{
        margin: 0;
    }
    .right form .error-box{
       width: 150px;
    }
    .scroll-up-btn{
        right: 15px;
        bottom: 15px;
        height: 38px;
        width: 35px;
        font-size: 23px;
        line-height: 38px;
    }
}

</style>
</html>
`);
});
app.get('/docs', (req, res) => {
async function gas() {
    const response = await axios.get('https://raw.githubusercontent.com/AKAZAMD/style-rest-api/main/index.html');
    res.send(response.data);
}
gas()
});


app.get("/welcome", generateImage("welcome"));

app.get("/leave", generateImage("leave"));

app.get("/verif", generateImage("verification"));
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
async function tiktokdl(url) {
    let tiklydownAPI = `https://api.tiklydown.eu.org/api/download?url=${url}`;
    let response = await axios.get(tiklydownAPI);
    return response.data;
}
app.get("/api/tiktokdl", async (req, res, next) => {
  var url = req.query.url;
  if (!url) {
    const errorResponse = {
      status: false,
      creator: "akazamd",
      message: "Please input a valid Tiktok URL",
    };
    console.log(errorResponse);
    res.json(errorResponse);
    return;
  }

  try {
    let result = await tiktokdl(url);
    res.json({
      result
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      creator: "akazamd",
      message: "Internal Server Error",
    });
  }
});

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


function bytesToSize(bytes) {
  return new Promise((resolve, reject) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) resolve(`${bytes} ${sizes[i]}`);
    resolve(`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`);
  });
}
app.get("/api-ai", async (req, res) => {
  const text = req.query.text;
var apikey = req.query.apikey;

    if (!apikey || !global.apikey.includes(apikey)) {
      logger.error(chalk.red(`URL parameter is missing or invalid apikey.`));
      res.status(400).json({ Note: "Apikey mu mana fitur ini premium beli ke +1 (718) 717-8421 murah 2k aja seminggu" });
      return;
    }
  if (!text) {
    res.status(400).json({ status: false, message: "Parameter 'text' diperlukan." });
    return;
  }

  try {
    const openai = new OpenAI({
      apiKey: global.openai,
    });
    const response = await openai.completions.create({
      model: "davinci-002",
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
    res.json({ status: false, message: "Sedang dalam perbaikan" });
  }
});
app.get("/yt", async (req, res) => {
  try {
    const judul = req.query.judul;
    const data = await yts(judul);
    const linknya = data.videos[0].url;
    const datanya = await youtubedl(linknya);

    const sd = await datanya.video['360p'].download();
    const hd = await datanya.video['720p'].download();
    const audio = await datanya.audio['128kbps'].download();

    const datai = {
      result: {
        id: datanya.id,
        thumb: datanya.thumbnail,
        title: datanya.title,
        sd: sd,
        hd: hd,
        audio: audio
      }
    };

    res.json(datai);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get("/api-bardai", async (req, res) => {
  const text = req.query.text;
var apikey = req.query.apikey;

    if (!apikey || !global.apikey.includes(apikey)) {
      logger.error(chalk.red(`URL parameter is missing or invalid apikey.`));
      res.status(400).json({ Note: "Apikey mu mana fitur ini premium beli ke +1 (718) 717-8421 murah 2k aja seminggu" });
      return;
    }
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
    res.json({ status: false, message: "Sedang dalam perbaikan" });
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
  var text = req.query.text;
  if (!text) return res.json({ status: false, creator: `${creator}`, message: "[!] insert text parameter" });

  const file = "./attp.gif";

  let length = text.length;

  var font = 90;

  if (length > 12) { font = 68 }
  if (length > 15) { font = 58 }
  if (length > 18) { font = 55 }
  if (length > 19) { font = 50 }
  if (length > 22) { font = 48 }
  if (length > 24) { font = 38 }
  if (length > 27) { font = 35 }
  if (length > 30) { font = 30 }
  if (length > 35) { font = 26 }
  if (length > 39) { font = 25 }
  if (length > 40) { font = 20 }
  if (length > 49) { font = 10 }

  Canvas.registerFont('./SF-Pro.ttf', { family: 'SF-Pro' });

  await canvasGif(
    file, (ctx) => {
      // Set black background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      var couler = ["#ff0000", "#ffe100", "#33ff00", "#00ffcc", "#0033ff", "#9500ff", "#ff00ff"];
      let jadi = couler[Math.floor(Math.random() * couler.length)];

      function drawStroked(text, x, y) {
        ctx.lineWidth = 5;
        ctx.font = `${font}px SF-Pro`;
        ctx.fillStyle = jadi;
        ctx.strokeStyle = 'black';
        ctx.textAlign = 'center';
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
      }

      drawStroked(text, 290, 300);

    },
    {
      coalesce: false,
      delay: 0,
      repeat: 0,
      algorithm: 'octree',
      optimiser: false,
      fps: 7,
      quality: 100,
    }
  ).then((buffer) => {
    res.set({ 'Content-Type': 'image/gif' });
    res.send(buffer);
  });
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
app.get("/ssweb", async (req, res, next) => {
  const link = req.query.link;
var apikey = req.query.apikey;

    if (!apikey || !global.apikey.includes(apikey)) {
      logger.error(chalk.red(`URL parameter is missing or invalid apikey.`));
      res.status(400).json({ Note: "Apikey mu mana fitur ini premium beli ke +1 (718) 717-8421 murah 2k aja seminggu" });
      return;
    }
  if (!link) {
    return res.json({
      status: false,
      creator: "akazamd",
      message: "[!] Insert 'link' parameter",
    });
  }
  	await ssweb(link).then((data) =>{
		if (!data ) return res.json(loghandler.notfound)
		res.set({'Content-Type': 'image/png'})
		res.send(data)
	}).catch((err) =>{
	 res.json(loghandler.notfound)
	
	})

});

app.get("/qc", async (req, res, next) => {
  let name = req.query.name;
  let link = req.query.ppuser;
  let text = req.query.text;

  // Check if name, ppuser, and text are provided
  if (!y || !link || !text) {
    return res.status(400).json({ error: 'Parameters name, ppuser, or text are missing or incorrect.' });
  }

  const json = {
    "type": "quote",
    "format": "png",
    "backgroundColor": "#FFFFFF",
    "width": 512,
    "height": 768,
    "scale": 2,
    "messages": [
      {
        "entities": [],
        "avatar": true,
        "from": {
          "id": 1,
          "name": y,
          "photo": {
            "url": link
          }
        },
        "text": text,
        "replyMessage": {}
      }
    ]
  };

  try {
    const response = await axios.post('https://bot.lyo.su/quote/generate', json, {
      headers: { 'Content-Type': 'application/json' }
    });

    const buffer = Buffer.from(response.data.result.image, 'base64');
    fs.writeFileSync('/qc.png', buffer);
    res.sendFile(__dirname + '/qc.png');
  } catch (error) {
    // Handle error here
    console.error('Error generating quote:', error);
    res.status(500).json({ error: 'Internal server error' });
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
var text = req.query.text
	if (!text ) return res.json({ status : false, creator : `${creator}`, message : "[!] insert text parameter"})

	Canvas.registerFont('./SF-Pro.ttf', { family: 'SF-Pro' })
	let length = text.length
		
	var font = 90
	if (length>12){ font = 68}
	if (length>15){ font = 58}
	if (length>18){ font = 55}
	if (length>19){ font = 50}
	if (length>22){ font = 48}
	if (length>24){ font = 38}
	if (length>27){ font = 35}
	if (length>30){ font = 30}
	if (length>35){ font = 26}
	if (length>39){ font = 25}
	if (length>40){ font = 20}
	if (length>49){ font = 10}

	var ttp = {}
	ttp.create = Canvas.createCanvas(576, 576)
	ttp.context = ttp.create.getContext('2d')
	ttp.context.font =`${font}px SF-Pro`
	ttp.context.strokeStyle = 'black'
	ttp.context.lineWidth = 3
	ttp.context.textAlign = 'center'
	ttp.context.strokeText(text, 290,300)
	ttp.context.fillStyle = 'white'
	ttp.context.fillText(text, 290,300)
		res.set({'Content-Type': 'image/png'})
		res.send(ttp.create.toBuffer())
  
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
app.get('/api/download-igdl', async (req, res, next) => {
  var url = req.query.url;

  if (!url) {
    const errorResponse = {
      status: false,
      creator: "akazamd",
      message: "Please input a valid Instagram URL",
    };
    console.log(errorResponse);
    res.json(errorResponse);
    return;
  }

  try {
    let result = await igdl(url);
    res.json({
      result
    });
  } catch (error) {
    // Handle other errors if needed
    res.status(500).json({
      status: false,
      creator: "akazamd",
      message: "Internal Server Error",
    });
  }
});

app.get('/tebakbendera', async (req, res, next) => {
	let ra = await axios.get('https://raw.githubusercontent.com/ryzenBot/data-rest-api/main/tebakbendera.json')
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
