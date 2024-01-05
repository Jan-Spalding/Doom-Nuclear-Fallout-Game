import {Gamescene, Gamecamera} from "./script.js"

let con = false
let noclip = false
let fps = false
let list = document.getElementById("list")

window.addEventListener("keyup", function(event) {
  
  if (event.keyCode == 223) { //`
    if (!con) {
      con = true
      document.getElementById("consoleHolder").style.visibility = "visible"
      console.log(document.getElementById("consoleInput"))
      document.getElementById("consoleInput").focus()
      document.getElementById("consoleInput").innerHTML = ""
      document.getElementById("consoleInput").textContent = ""
      
      
    } else {
      con = false
      document.getElementById("consoleHolder").style.visibility = "hidden"
    }
  }
})

document.getElementById("consoleInput").addEventListener("keydown", function(event) {
  if (event.keyCode == 13)  {//ENTER
    switch(event.target.innerHTML.trim()) {
      case "noclip":
        if (!noclip) {
          noclip = true
          createMessage("NOCLIP ENABLED")
        } else {
          noclip = false
          createMessage("NOCLIP UNABLED")
        }
        break;
      case "fps":
        if (!fps) {
          fps = true
          document.getElementById("fps").style.display = ""
          createMessage("FPS ENABLED")
        } else {
          fps = false
          document.getElementById("fps").style.display = "none"
          createMessage("FPS UNABLED")
        }
        break;
      case "cameraPosition":
        createMessage(Gamecamera.position)
        break;
      default:
        if (event.target.innerHTML.slice(0,8) == "teleport") {
          let cords = event.target.innerHTML.split("(")
          cords = cords[1].split(")")
          cords = cords[0].split(",")
          try {
            Gamecamera.position.set(Number(cords[0]), Number(cords[1]), Number(cords[2]))
            createMessage("teleported to " + cords[0] + "," + cords[1] + "," + cords[2])
          } catch {
            createMessage("unable to teleport")
          }
        } else {
          createMessage("no such function")
        }
    }
    event.target.innerHTML = ""
  } 
})

function createMessage(msg) {
  let li = document.createElement("li")
  li.className = "consoleMessage"
  li.innerHTML = msg
  list.append(li)
}
