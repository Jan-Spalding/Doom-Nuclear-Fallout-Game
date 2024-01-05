import { init } from "/script.js"
import { ready } from "/script.js"
import {Play} from "/audio.js"

import { Displayinit } from "/weaponDisplay.js"
import { mapInit} from "/mapDisplay.js"

let newGame = document.getElementById("newGame")
let loadGame = document.getElementById("loadGame")
let settings = document.getElementsByClassName("settings")
let quit = document.getElementById("quit")
let main = document.getElementsByClassName("main")

let yes = document.getElementById("yes")
let no = document.getElementById("no")

let backk = document.getElementById("backk")

let first = document.getElementById("first")
let second = document.getElementById("second")
let third = document.getElementById("third")
let fourth = document.getElementById("fourth")

let slides = [first, second, third, fourth]
let slide = 0

let start = document.getElementById("start")
let startContent = document.getElementById("startContent")

// === SETTINGS ===

for (let i = 0; i < settings.length; i++) {
  settings[i].addEventListener("click", function() {
    document.getElementById("setting").style.visibility = "visible"
  })
}

// === SETTINGS BACK === 

backk.addEventListener("click", function() {
  document.getElementById("setting").style.visibility = "hidden"
})

// === BACK TO MAIN ===

for (let i = 0; i < main.length; i++) {
  main[i].addEventListener("click", function() {
    document.getElementById("confirm").style.visibility = "visible"
  })
}


yes.addEventListener("click", function() {
  document.location.reload()
})

no.addEventListener("click", function() {
  document.getElementById("confirm").style.visibility = "hidden"
})


// === QUIT ===

quit.addEventListener("click", function() {
  window.close()
})

// === NEW GAME ===

newGame.addEventListener("click", function() {
  init()
  Displayinit()
  mapInit()
  Play()
  let opac = 1
  let x = setInterval(function(){
    start.style.opacity = opac
    startContent.style.opacity = opac
    opac -= 0.1
    if (opac <= 0) {
      clearInterval(x)
      start.style.visibility = "hidden"
      startContent.style.visibility = "hidden"
      setTimeout(iterations, 4) 
    }
  },50)
})

function iterations() {
  if (!ready) { 
    slides[slide].style.aniamtionName = ""
    slides[slide].style.animationName = "slides"
    if (slide == 3) {
      slide = 0
    } else {
      slide++
    }
    setTimeout(iterations, 4000)
  } else {
    document.getElementById("slides").style.visibility = "hidden"
    document.getElementById("black").style.visibility = "hidden"
    document.getElementById("loading").style.visibility = "hidden"
  }
}