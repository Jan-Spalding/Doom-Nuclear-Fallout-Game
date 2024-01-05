import {player, Gamecamera, zoomed, moveForward, moveBackward, moveRight, moveLeft, velocity} from "./script.js"

let menuButton, aimButton, jumpButton, background, pointer
let marker
let mobile = false

if (navigator.userAgent.slice(13, 19) == "iPhone") {
  mobile = true
  // player.mobile = true
}

function MobileSetup() {
  menuButton = document.createElement("div")
  menuButton.style.cssText = "position:absolute;top:5px;left:5px;height:30px;width:40px;display:flex;justify-content:center;align-items:center;flex-direction:column;"

  let display1 = document.createElement("div")
  display1.style.cssText = "width:100%;height:15px;background-color:gray;margin-bottom:10px;"
  let display2 = document.createElement("div")
  display2.style.cssText = "width:100%;height:15px;background-color:gray;"
  let display3 = document.createElement("div")
  display3.style.cssText = "width:100%;height:15px;background-color:gray;margin-top:10px;"

  let holder = document.createElement("div")
  holder.style.cssText = "position:absolute; height:150px; width:150px; left:10%; bottom:10%;"

  background = document.createElement("div")
  background.style.cssText = "position:relative;height:100%;width:100%;background-color:white;opacity:0.8;"

  pointer = document.createElement("div")
  pointer.style.cssText = "position:absolute;height:10px;width:10px;background-color:black;top:48%;left:48%;"

  menuButton.appendChild(display1)
  menuButton.appendChild(display2)
  menuButton.appendChild(display3)


  background.appendChild(pointer)
  holder.appendChild(background)
  document.body.appendChild(holder)
  document.body.appendChild(menuButton)

  let look = document.createElement("div")
  look.style.cssText = "position:absolute;height:100%;width:50%;right:0;"
  look.id = "look"

  document.body.appendChild(look)

  jumpButton = document.createElement("div")
  jumpButton.style.cssText = "position:absolute;height:80px;width:80px;right:5%;bottom:40%;border-radius:50%;background-color:white;opacity:0.8;"

  document.body.appendChild(jumpButton)

  aimButton = document.createElement("div")
  aimButton.style.cssText = "position:absolute;height:60px;width:60px;right:20%;bottom:50%;border-radius:50%;background-color:white;opacity:0.8;"

  document.body.appendChild(aimButton)

  Events()
}

function Events() {
  //Events -----------------------

  aimButton.addEventListener("click", function(event) {
    event.preventDefault()
    if (!zoomed) {
      if (player.pistol.visible) {
        camera.zoom = 2
        zoomed = true
      }
      else if (player.sniper.visible) {
        camera.zoom = 10
        document.getElementById("SniperScope").style.visibility = "visible"
        document.getElementById("crossHair").style.visibility = "hidden"
        zoomed = true
        player.in = true
      }
    } else if (zoomed) {
      camera.zoom = 1
      zoomed = false
    }

  })

  jumpButton.addEventListener("click", function() {
    if (canJump === true) {
      velocity.y += player.jump;
      canJump = false;
    }
  })

  menuButton.addEventListener("click", function() {
    Displaymenu = true
    menu.style.display = "flex"
  })

  background.addEventListener("touchstart", function(event) {
    event.preventDefault()
    marker = event.touches.length - 1
  })

  background.addEventListener("touchmove", function(event) {
    event.preventDefault()

    pointer.style.top = event.touches[marker].pageY - (window.innerHeight * 0.50) + "px"
    pointer.style.left = event.touches[marker].pageX - (window.innerWidth * 0.10) - (5) + "px"

    // pointer.style.top = event.touches[0].screenY + "px"
    // pointer.style.left = event.touches[0].screenX + "px"


    if (event.touches[marker].pageY <= (window.innerHeight * 0.9 + 50 - background.offsetHeight)) {
      moveForward = true
    } else {
      moveForward = false
    }
    if (event.touches[marker].pageY >= (window.innerHeight * 0.9 - 50)) {
      moveBackward = true
    } else {
      moveBackward = false
    }
    if (event.touches[marker].pageX <= (window.innerWidth * 0.1 + 50)) {
      moveLeft = true
    } else {
      moveLeft = false
    }
    if (event.touches[marker].pageX >= (window.innerWidth * 0.1 - 50 + background.offsetWidth)) {
      moveRight = true
    } else {
      moveRight = false
    }
  })

  background.addEventListener("touchend", function() {
    moveForward = false
    moveBackward = false
    moveLeft = false
    moveRight = false
    pointer.style.top = "48%"
    pointer.style.left = "48%"
  })
}

export {mobile}
export {MobileSetup}
