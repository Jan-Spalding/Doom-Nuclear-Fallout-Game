import * as THREE from "./Import/Three.js/three.module.js"

import { PointerLockControls } from "./Import/Three.js/PointerLockControls.js"
import { FBXLoader } from "./Import/Three.js/FBXLoader.js"
import { EffectComposer } from "./Import/Three.js/EffectComposer.js"
import { SSAARenderPass } from "./Import/Three.js/SSAARenderPass.js"
import { RenderPass } from "./Import/Three.js/RenderPass.js"
import { ShaderPass } from "./Import/Three.js/ShaderPass.js"
import { FXAAShader } from "./Import/Three.js/FXAAShader.js"
import { CSS2DRenderer } from "./Import/Three.js/CSS2DRenderer.js"
import Stats from "./Import/Three.js/stats.module.js"
import { AudioSetup, AudioUpdate, Play, Pause } from "./audio.js"
import { mobile, MobileSetup } from "./mobile.js"
import { zombie } from "./zombie.js"
import { current } from "./weaponView.js"

let Gamescene, Gamecamera, renderer, composer, ambientLight, raycaster, prevTime, fxaaPass, renderPass, stats, ssaaPass, world, body, phcap, light, fov

let ready = false
let done = false
let doors = []
let consoles = []
let lights = []
let glass = []
let mapContent = []
let turbine
let enemies = []
let level = 0

let begin 

let labelRenderer = new CSS2DRenderer()

let total

let totalEffect = [
  7,
  2,
  4
]

let buttons = []

let delta

let currentEnemies = []
let enemyBody = []

let interactables = []

let mapChange = [
  [1,0,2],
  [3,2,4],
  [5,4,6]
]

let doorclose = [
  [7,6],
  [1,7],
  [2,1],
  [3,2],
  [4,3],
  [5,4]
]

let AIcontrol = [
  [1,1],
  [3,2],
  [5,3]
]

let controls, velocity = new THREE.Vector3(), direction = new THREE.Vector3()

let objects = []
let weapons = []
let count = 0
let intersectConsole


let Displaymenu = true

let zoomed = false

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevPosition = new THREE.Vector3
let currentPosition = new THREE.Vector3
let currentGround = new THREE.Vector3
let cantJump = 0
let pressE = false

let pointer = new THREE.Vector2(0, 0)
let visionRaycaster = new THREE.Raycaster()
let collisionRaycasterXP = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), 0, 5)
let collisionRaycasterXN = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(-1, 0, 0), 0, 5)
let collisionRaycasterZP = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, 1), 0, 5)
let collisionRaycasterZN = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 5)
let collisions = []

let player = { health: 100, sheild: 100, height: 12, speed: 1100, jump: 200, sensitivity: 2, scope: 1, in: false, menu: Displaymenu, mobile: mobile }

let wireFrame = false;

let container = document.getElementById("game")

function init() {
  Gamescene = new THREE.Scene()

  // === SKYBOX ===
  
  if (mobile) {
    Gamescene.background = new THREE.Color("rgb(255, 0, 0)")
    MobileSetup()
  } else {
    const backgroundLoader = new THREE.TextureLoader();
    const texture = backgroundLoader.load('./Import/Images/skybox.jpg', () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      Gamescene.background = rt.texture;
    });
  }


  Gamecamera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 500);  

  controls = new PointerLockControls(Gamecamera, document.body)

  Gamescene.add(controls.getObject())

  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 12)

  // ------------------------------------------------------------------------------------

  // === LOADERS ===

  


  let mapLoader = new FBXLoader()
  mapLoader.load("./Import/Models/Maps/Map-8-Start.fbx", (object) => {
    object.scale.multiplyScalar(0.12)
    object.position.set(0, 20, 0)

    currentEnemies = []

    for (let i = 0; i < object.children.length; i++) {
      switch (object.children[i].name.split("_")[0]) {
        
        case "Door":
          doors.push(object.children[i])
          break
        case "Console":
          consoles.push(object.children[i])
          break
        case "Light":
          lights.push(object.children[i])
          object.children[i].visible = false
          break
        case "Glass":
          glass.push(object.children[i])
          break
        case "Turbine":
          turbine = object.children[i]
          break
        case "Spawn": 
          currentEnemies.push(object.children[i])
          object.children[i].visible = false
          break
        case "Health":
          interactables.push(object.children[i])
          break
        case "Sheild":
          interactables.push(object.children[i])
          break
        default:
          collisions.push(object.children[i])
          objects.push(object.children[i])



      }
      
    }

    
    mapContent.push(object)
    Gamescene.add(object)
    addLight(lights)
    spawnSetup(currentEnemies)
    
    mapLoader.load("./Import/Models/Maps/Map-8-StartToTurbine.fbx", (object) => {
      object.scale.multiplyScalar(0.12)
      object.position.set(0, 20, 0)
  
      for (let i = 0; i < object.children.length; i++) {
        switch (object.children[i].name.split("_")[0]) {
          case "Door":
            doors.push(object.children[i])
            break
          case "Console":
            consoles.push(object.children[i])
            break
          case "Light":
            lights.push(object.children[i])
            object.children[i].visible = false
            break
          case "Glass":
            glass.push(object.children[i])
            collisions.push(object.childre[i])
            objects.push(object.children[i])
            break
          case "Turbine":
            turbine = object.children[i]
            collisions.push(object.childre[i])
            objects.push(object.children[i])
            break
          case "Health":
            interactables.push(object.children[i])
            break
          case "Sheild":
            interactables.push(object.children[i])
            break
          default :
            collisions.push(object.children[i])
            objects.push(object.children[i])
            break
  
  
  
        }
        
      }
  
      mapContent.push(object)
      Gamescene.add(object)
      addLight(lights)
      mapLoader.load("./Import/Models/Maps/Map-8-Turbine.fbx", (object) => {
        object.scale.multiplyScalar(0.12)
        object.position.set(0, 20, 0)

        currentEnemies = []
    
        for (let i = 0; i < object.children.length; i++) {
          switch (object.children[i].name.split("_")[0]) {
            case "Door":
              doors.push(object.children[i])
              break
            case "Console":
              consoles.push(object.children[i])
              break
            case "Light":
              lights.push(object.children[i])
              // object.children.splice(i, 1)
              object.children[i].visible = false
              break
            case "Glass":
              glass.push(object.children[i])
              collisions.push(object.children[i])
              objects.push(object.children[i])
              break
            case "Turbine":
              turbine = object.children[i]
              collisions.push(object.children[i])
              objects.push(object.children[i])
              break
            case "Spawn": 
              currentEnemies.push(object.children[i])
              // object.children.splice(i, 1)
              object.children[i].visible = false
              break
            case "Health":
              interactables.push(object.children[i])
              break
            case "Sheild":
              interactables.push(object.children[i])
              break
            default:
              collisions.push(object.children[i])
              objects.push(object.children[i])
              break
              
    
          }
          
        }
    
        mapContent.push(object)
        addLight(lights)
        makeGlass(glass)
        spawnSetup(currentEnemies)
    
        mapLoader.load("./Import/Models/Maps/Map-8-TurbineToMain.fbx", (object) => {
          object.scale.multiplyScalar(0.12)
          object.position.set(0, 20, 0)

          
    
          for (let i = 0; i < object.children.length; i++) {
            switch (object.children[i].name.split("_")[0]) {
              case "Door":
                doors.push(object.children[i])
                break
              case "Console":
                consoles.push(object.children[i])
                break
              case "Light":
                lights.push(object.children[i])
                // object.children.splice(i, 1)
                object.children[i].visible = false
                break
              case "Health":
                interactables.push(object.children[i])
                break
              case "Sheild":
                interactables.push(object.children[i])
                break
              default:
                collisions.push(object.children[i])
                objects.push(object.children[i])
    
    
    
    
            }
            
          }
    
          mapContent.push(object)
          Gamescene.add(object)
          addLight(lights)
    
          mapLoader.load("./Import/Models/Maps/Map-8-Main.fbx", (object) => {
            object.scale.multiplyScalar(0.12)
            object.position.set(0, 20, 0)

            currentEnemies = []
            
            for (let i = 0; i < object.children.length; i++) {
              switch (object.children[i].name.split("_")[0]) {
                case "Door":
                  doors.push(object.children[i])
                  break
                case "Console":
                  consoles.push(object.children[i])
                  break
                case "Light":
                  lights.push(object.children[i])
                  // object.children.splice(i, 1)
                  object.children[i].visible = false
                  break
                case "Health":
                  interactables.push(object.children[i])
                  break
                case "Sheild":
                  interactables.push(object.children[i])
                  break
                case "Spawn":
                  currentEnemies.push(object.children[i])
                  object.children[i].visible = false
                  break;
                default:
                  collisions.push(object.children[i])
                  objects.push(object.children[i])
                  
    
    
    
    
              }
              
            }
    
            mapContent.push(object)
            addLight(lights)
            spawnSetup(currentEnemies)
            mapLoader.load("./Import/Models/Maps/Map-8-Doors.fbx", (object) => {
              object.scale.multiplyScalar(0.12)
              object.position.set(0, 20, 0)
    
              for (let i = 0; i < object.children.length; i++) {
                switch (object.children[i].name.split("_")[0]) {
                  case "Door":
                    doors.push(object.children[i])
                    break
                  case "Console":
                    consoles.push(object.children[i])
                    break
                  case "Light":
                    lights.push(object.children[i])
                    object.children.splice(i, 1)
                    break
    
    
    
    
                }
                collisions.push(object.children[i])
                objects.push(object.children[i])
              }
              addLight(lights)
              Gamescene.add(object)
              mapLoader.load("./Import/Models/Maps/Map-8-MainToControl.fbx", (object) => {
                object.scale.multiplyScalar(0.12)
                object.position.set(0, 20, 0)
    
                for (let i = 0; i < object.children.length; i++) {
                  switch (object.children[i].name.split("_")[0]) {
                    case "Door":
                      doors.push(object.children[i])
                      break
                    case "Console":
                      consoles.push(object.children[i])
                      break
                    case "Light":
                      lights.push(object.children[i])
                      object.children.splice(i, 1)
                      break
    
    
    
    
                  }
                  collisions.push(object.children[i])
                  objects.push(object.children[i])
                }
                addLight(lights)
                mapContent.push(object)
                Gamescene.add(object)
                mapLoader.load("./Import/Models/Maps/Map-8-Control.fbx", (object) => {
                  object.scale.multiplyScalar(0.12)
                  object.position.set(0, 20, 0)

                  currentEnemies = []
    
                  for (let i = 0; i < object.children.length; i++) {
                    switch (object.children[i].name.split("_")[0]) {
                      case "Door":
                        doors.push(object.children[i])
                        break
                      case "Console":
                        consoles.push(object.children[i])
                        break
                      case "Light":
                        lights.push(object.children[i])
                        // object.children.splice(i, 1)
                        object.children[i].visible = false
                        break
                      case "Spawn":
                        currentEnemies.push(object.children[i])
                        object.children[i].visible = false
                        break
                      case "Health":
                        interactables.push(object.children[i])
                        break
                      case "Sheild":
                        interactables.push(object.children[i])
                        break
                      case "Button":
                        buttons.push(object.children[i])

                        
                        
                        break
                      default:
                        if (object.children[i].name.slice(0,6) == "Button") {
                         buttons.push(object.children[i]) 
                        }
                        collisions.push(object.children[i])
                        objects.push(object.children[i])
            
    
    
    
                    }
                    
                  }
                  addLight(lights)
                  // scene.add(object)
                  mapContent.push(object)
                  consoleOutline()
                  buttonOutline(buttons)
                  spawnSetup(currentEnemies)
                  done = true
                  interactableOutlines()
                }, (loading) => {
                  document.getElementById("bar").style.width = (loading.loaded / loading.total) * 100 + "%"
                  if ((loading.loaded / loading.total) * 100 == 100) {
                    ready = true
                  }
                })
              }, (loading) => {
                document.getElementById("bar").style.width = (loading.loaded / loading.total) * 100 + "%"
                if ((loading.loaded / loading.total) * 100 == 100) {
                  ready = true
                }
              })
            }, (loading) => {
              document.getElementById("bar").style.width = (loading.loaded / loading.total) * 100 + "%"
              if ((loading.loaded / loading.total) * 100 == 100) {
                ready = true
              }
            })
          }, (loading) => {
            document.getElementById("bar").style.width = (loading.loaded / loading.total) * 100 + "%"
          })
    
        }, (loading) => {
          document.getElementById("bar").style.width = (loading.loaded / loading.total) * 100 + "%"
        })
    
    
      }, (loading) => {
        document.getElementById("bar").style.width = (loading.loaded / loading.total) * 100 + "%"
    
      })
    }, (loading) => {
      document.getElementById("bar").style.width = (loading.loaded / loading.total) * 100 + "%"
  
    })
  }, (loading) => {
    document.getElementById("bar").style.width = (loading.loaded / loading.total) * 100 + "%"

  })


  function addLight(lights) {
    // if (!noLight) {
    //   let lightArray = []
    //   for (let i = 0; i < 6; i++) { //lights.length
    //     try {
    //       lightArray[i] = new THREE.PointLight(0xffffff, 0.5, 150)
    //       lightArray[i].position.set(lights[i].position.x - (lights[i].position.x * 0.88), lights[i].position.y - (lights[i].position.y * 0.88) + 20, lights[i].position.z - (lights[i].position.z * 0.88))
    //       lightArray[i].scale.set(0.12, 0.12, 0.12)
    //       lightArray[i].castShadow = true;
    //       lightArray[i].shadow.camera.near = 0.1
    //       lightArray[i].shadow.camera.far = 25
    //       scene.add(lightArray[i])
    //     } catch {
    //       console.log("Light Limit Reached")
    //     }

    //   }

    //   console.log(lightArray)
    // }
  }

  function buttonOutline(object) {
    for (let i = 0; i < object.length; i++ ) {
      let clone = object[i].clone()
      clone.material = new THREE.MeshBasicMaterial({color:0xff0000})
      clone.position.set((object[i].position.x * 0.12),(object[i].position.y * 0.12),(object[i].position.z * 0.12))
      clone.scale.multiplyScalar(0.125)
      clone.position.y += 19.9
      Gamescene.add(clone)
    }
    
  }

  function makeGlass(glass) {
    for(let i = 0; i < glass.length; i++) {
      glass[i].material.transparent = true
      glass[i].material.opacity = 0.8
    }
  }

  function consoleOutline() {
    for(let i=0; i<consoles.length; i++) {
      let clone = consoles[i].clone()
      clone.material = new THREE.MeshBasicMaterial({color:0x0000ff, side: THREE.BackSide})
      clone.position.set((consoles[i].position.x * 0.12),(consoles[i].position.y * 0.12),(consoles[i].position.z * 0.12))
      clone.scale.multiplyScalar(0.125)
      clone.position.y += 20
      Gamescene.add(clone)
    }
  }

  function interactableOutlines() {
    for (let i = 0; i < interactables.length; i++) {
      let clone = interactables[i].clone()
      clone.material = new THREE.MeshBasicMaterial({color:0x00ff00, side: THREE.BackSide})
      clone.position.set(interactables[i].position.x * 0.12, interactables[i].position.y * 0.12, interactables[i].position.z * 0.12)
      clone.scale.multiplyScalar(0.125)
      clone.position.y += 20
      clone.name = interactables[i].name + "_clone"
      Gamescene.add(clone)
    }
  }

  function spawnSetup(enemy) {
    let list = []
    for (let i = 0; i < enemy.length; i++) { //enemy.length     
      const Zombie = new zombie((enemy[i].position.x * 0.12), ((enemy[i].position.y * 0.12) + 20), (enemy[i].position.z * 0.12), 50, 13, 20, collisions) //x,y,z,hp,dmg,speed,collisions
      list.push(Zombie)
      enemyBody.push(Zombie.Character)
    }
    enemies.push(list)
  }
  
  // if (noLight) {
  light = new THREE.PointLight(0xffffff, 0.5, 500)
  light.position.copy(Gamecamera.position)
  light.castShadow = true
  light.shadow.camera.near = 0.1
  light.shadow.camera.far = 30
  Gamecamera.add(light)
  // }

  ambientLight = new THREE.AmbientLight(0xff0000, 0.2)
  Gamescene.add(ambientLight)

  Gamescene.fog = new THREE.Fog(0xff0000, 0, 500)

  Gamecamera.position.set(0, 40, 0);
  Gamecamera.lookAt(new THREE.Vector3(0, 40, 1));

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  container.appendChild(renderer.domElement)

  stats = new Stats()
  document.body.appendChild(stats.dom)

  // === POST PROCESSING ===
  renderPass = new RenderPass(Gamescene, Gamecamera)
  composer = new EffectComposer(renderer)
  fxaaPass = new ShaderPass(FXAAShader)
  ssaaPass = new SSAARenderPass(Gamescene, Gamecamera)

  composer.addPass(renderPass)
  composer.addPass(ssaaPass)
  // ---------------------



  controls.addEventListener("lock", function() {
    menu.style.display = "none";
    Displaymenu = false
    Play()
  })

  
  
  controls.addEventListener("unlock", function() {
    menu.style.display = "flex";
    Displaymenu = true
    Pause()
  })


  //LABELS

  labelRenderer.setSize(window.innerWidth, window.innerHeight)
  labelRenderer.domElement.style.position = "absolute"
  labelRenderer.domElement.style.top = "0px"
  //labelRenderer.style.pointerEvents = "none"
  document.getElementById("labelRenderer").appendChild(labelRenderer.domElement)

  AudioSetup()
  
  animate()
}

let door
let doorY
let count1 = 0
let room = 0

let timeout
 

function closeDoor() {
  timeout = setTimeout(close, 500)
}

function close() {
  count1++
  if (count1 == 1) {
    let closing = setInterval(function() {

      if (interupt) {
        clearInterval(closing)
      }
      
      if (door.position.y <= doorY) {
        clearInterval(closing)
        count1 = 0
        closed = true
      } else if (!interupt) {
        door.position.y -= 5
      }
    }.bind(this), 50)
  }
}

let closed = true
let interupt = false

let warning = false

let stop = false 

function animate() {
  requestAnimationFrame(animate)

  AudioUpdate()

  for(let i = 0; i < enemies.length; i++) {
    for(let j = 0; j < enemies[i].length; j++) {
      enemies[i][j].update()
    }
  }

  currentPosition.copy(Gamecamera.position)

  if (canJump) {
    currentGround.copy(currentPosition)
  }

  if (done) {
    visionRaycaster.setFromCamera(pointer, Gamecamera)

    const buttonIntersect = visionRaycaster.intersectObjects(buttons, false) 

    if (buttonIntersect.length) {
      if (buttonIntersect[0].distance <= 25 && pressE && !warning && !stop) {
        const time = Date.now() - begin
        document.getElementById("time").innerHTML = time / 1000 + "s"
        document.getElementById("win").style.visibility = "visible"
        controls.unlock()
        stop = true
      } 

      if (total != 0 && buttonIntersect[0].distance <= 25) {
        document.getElementById("realTimeInfo").innerHTML = total + " Remaining"
        warning = true
      } else {
        warning = false
      }
      
      if (buttonIntersect[0].distance <= 25 && !warning) {
        document.getElementById("realTimeInfo").innerHTML = "Press E"
      }
    } 
    
    
    
    intersectConsole = visionRaycaster.intersectObjects(consoles, false)
    if (intersectConsole.length) {

      if (intersectConsole[0].distance <= 25) {
        if (total != 0 && warning) {
          document.getElementById("realTimeInfo").innerHTML = total + " Remaining"
        } else if (closed) {
          document.getElementById("realTimeInfo").innerHTML = "Press E"
        } else {
          document.getElementById("realTimeInfo").innerHTML = "Door Closing"
        }
      } else {
        document.getElementById("realTimeInfo").innerHTML = ""
      }
      
      if (intersectConsole[0].distance <= 25 && pressE) {
        // CHECK TO CLOSE DOOR
        // for (let k = 0; k < doorclose.length; k++) {
        //   if (doorclose[k][0] == intersectConsole[0].object.name.split("_")[1]) {
        //     console.log(intersectConsole[0].object.name.split("_")[1])
        //     let doortarget = Gamescene.getObjectByName("Door_" + doorclose[k][1])
        //     console.log(doortarget)
        //     doortarget.position.y = doorY
        //     // closed = true
        //     interupt = false
        //     break
        //   }
        // }

        // if (door != undefined && door.name != "Door_" + (intersectConsole[0].object.name.split("_")[1])) {
          
        //   if (!closed) {

        //     console.log("interupt activated")
        //     closed = true
        //     interupt = true
        //     clearTimeout(timeout)
            
        //   }
          
        // }



        for (let i = 0; i < totalEffect.length; i++) {
          if (intersectConsole[0].object.name.split("_")[1] == totalEffect[i] && total != 0) {
            warning = true
            break
          } else if (intersectConsole[0].object.name.split("_")[1] == totalEffect[i] && total == 0) {
            warning = false
          }
        }
        

        // console.log(intersectConsole[0].object.name)

        // RUN ONCE
        if (closed && !warning) {

          // interupt = false
          closed = false
          let start = Date.now()
          
          door = Gamescene.getObjectByName("Door_" + (intersectConsole[0].object.name.split("_")[1]))
          doorY = door.position.y

          // CHANGE MAP
          for (let i = 0; i < mapChange.length; i++) {
            if (intersectConsole[0].object.name.split("_")[1] == mapChange[i][0]) {
              Gamescene.remove(mapContent[(mapChange[i][1])])
              Gamescene.add(mapContent[(mapChange[i][2])])
            }
          }

          //ADD AI
          for (let i = 0; i < AIcontrol.length; i++ ) {
            if (intersectConsole[0].object.name.split("_")[1] == AIcontrol[i][0]) {
              let num = AIcontrol[i][1]
              for (let j = 0; j < enemies[num].length; j++ ) {
                enemies[num][j].place()
              }
              total = enemies[num].length
            }
          }

          // ANIMATIONS
          let timer = setInterval(function() {
            let progression = Date.now() - start
            if (progression >= 3000) { //2 Seconds
              clearInterval(timer)
              interupt = false
              // closeDoor()
            } else if (interupt) {
              clearInterval(timer)
              interupt = false
            } else if (!interupt) {
              door.position.y += 5
            }
          }, 50)
        }
      }
    } else if (!buttonIntersect.length) {
      document.getElementById("realTimeInfo").innerHTML = ""
    }
    
  }

  if (turbine) {
    turbine.rotation.z += 0.1
  }
  
  stats.begin();

  // ------------------------------------------------------------------------

  //AUTOMATICALLY CLOSE DOORS
  
  if (doors.length) {
    for (let i = 0; i < doors.length; i++) {
      const updatePosition = new THREE.Vector3().copy(doors[i].position)
      updatePosition.z *= 0.12
      updatePosition.x *= 0.12
      const diff = new THREE.Vector3().subVectors(Gamecamera.position, updatePosition)
      if (diff.x > 10 && doors.length == 1) {
        doors.splice(i,1)
        closed = true
        door.position.y = doorY
      }
      if (diff.z > 10 && door && doors.length != 1) {
        doors.splice(i,1)
        closed = true
        door.position.y = doorY
      }
    }
  }

  //AUTOMATICALLY PICK UP INTERACTABLES
  if (interactables.length) {
    for (let i = 0; i < interactables.length; i++) {
      const updatePosition = new THREE.Vector3().copy(interactables[i].position)
      updatePosition.x *= 0.12
      updatePosition.z *= 0.12
      const diff = new THREE.Vector3().subVectors(Gamecamera.position, updatePosition)
      if (diff.x > -5 && diff.x < 5) {
        if (diff.z > -5 && diff.z < 5) {
          switch(interactables[i].name.split("_")[0]) {
            case "Health":
              player.health += 20
              if (player.health > 100) {
                player.health = 100
              } 
              break
            case "Sheild":
              player.sheild += 10
              if (player.sheild > 100) {
                player.sheild = 100
              }
              break
          }
    
          document.getElementById("sheildBar").style.width = (player.sheild / 100) * 100 + "%"
          document.getElementById("healthBar").style.width = (player.health / 100) * 100 + "%"
        
          document.getElementById("snumber").innerHTML = player.sheild
          document.getElementById("hnumber").innerHTML = player.health
        
          
          interactables[i].visible = false
          Gamescene.getObjectByName((interactables[i].name + "_clone")).visible = false
          interactables.splice(i, 1) 
        }
      }
    }
  }
  



  //=== COLLISIONS === 

  if (controls.isLocked === true || !Displaymenu) {
    // const worldDirection = Gamecamera.getWorldDirection(new THREE.Vector3())

    collisionRaycasterXP.ray.origin.copy(Gamecamera.position)
    collisionRaycasterZP.ray.origin.copy(Gamecamera.position)
    collisionRaycasterXN.ray.origin.copy(Gamecamera.position)
    collisionRaycasterZN.ray.origin.copy(Gamecamera.position)

    const intersectionsXP = collisionRaycasterXP.intersectObjects(collisions, false)
    const intersectionsZP = collisionRaycasterZP.intersectObjects(collisions, false)
    const intersectionsZN = collisionRaycasterZN.intersectObjects(collisions, false)
    const intersectionsXN = collisionRaycasterXN.intersectObjects(collisions, false)

    // console.log(worldDirection)  

    if (intersectionsXP.length || intersectionsXN.length || intersectionsZN.length || intersectionsZP.length) {
      velocity.x = 0
      velocity.z = 0

      Gamecamera.position.copy(prevPosition)
      currentPosition.copy(prevPosition)
    }

    
    
  }

  //-------------

  const time = performance.now()

  // === MOVEMENT ===

  if (controls.isLocked === true || !Displaymenu) {
    raycaster.ray.origin.copy(controls.getObject().position);
    // raycaster.ray.origin.y -= 10;

    // === MOVEMENT ===
    const intersections = raycaster.intersectObjects(objects, false);

    

    delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    if (!canJump) {
      velocity.y -= 9.8 * 70.0 * delta; // 100.0 = mass
    }


    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * player.speed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * player.speed * delta;


    controls.moveRight(- velocity.x * delta);
    controls.moveForward(- velocity.z * delta);

    controls.getObject().position.y += (velocity.y * delta); // new behavior

    if (controls.getObject().position.y < 0) {
      velocity.y = 0;
      // controls.getObject().position.y = player.height;
      controls.getObject().position.copy(currentGround)
      // console.log(camera.position)
      if (currentGround.x == 0 && currentGround.y == 0, currentGround.z == 0) {
        Gamecamera.position.set(0, 30, 0)
      }
      canJump = true;
  
    }

    if (intersections.length) {

      if (canJump) {
        controls.getObject().position.y = player.height + intersections[0].point.y - 2

        // velocity.y = 0
        canJump = true

        // Fail Safe
        if (intersections[0].distance >= 8) {

          // velocity.y = Math.max( 0, velocity.y );
          // canJump = true;

          // velocity.y = 10;

          canJump = true;

        }
        //
      } else if (!canJump) {
        cantJump++
        if (cantJump >= 2) {
          controls.getObject().position.y = player.height + intersections[0].point.y - 2
          velocity.y = 0
          cantJump = 0
          canJump = true
        }

      }
    }
    else {
      // jumpCount++
      // if (jumpCount >= 25) {
      //   canJump = false
      // }
      canJump = false
    }
  }

  prevTime = time

  prevPosition.copy(currentPosition)

  ssaaPass.sampleLevel = samples.value

  composer.render()
  labelRenderer.render( Gamescene, Gamecamera)
  stats.end()
}


function keyDown(event) {
  switch (event.code) {
    case 'KeyW':
      moveForward = true;
      break;

    case 'KeyA':
      moveLeft = true;
      break;

    case 'KeyS':
      moveBackward = true;
      break;

    case 'KeyD':
      moveRight = true;
      break;

    case 'Space':
      if (canJump === true) velocity.y += player.jump;
      canJump = false;
      break;

    case 'KeyE':
      pressE = true;
      break
  }
}

function keyUp(event) {
  switch (event.code) {
    case 'KeyW':
      moveForward = false;
      break;

    case 'KeyA':
      moveLeft = false;
      break;

    case 'KeyS':
      moveBackward = false;
      break;

    case 'KeyD':
      moveRight = false;
      break;

    case 'KeyE':
      pressE = false
      break;
  }
}

function onWindowResize() {
  Gamecamera.aspect = window.innerWidth / window.innerHeight
  Gamecamera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  labelRenderer.setSize(window.innerWidth, window.innerHeight)
  document.getElementById("SniperScope").style.height = 100 + "%"
  document.getElementById("SniperScope").style.width = 100 + "%"
}

let playonce = true

function mouseLock() {
  if (!mobile) {
    controls.lock()
    if (playonce) {
      playonce = false
      begin = Date.now()
      // console.log("this is playing once")
      for (let i = 0; i < enemies[0].length; i++ ) {
        enemies[0][i].place()
      }
      total = enemies[0].length
    }
  } else {
    menu.style.display = "none"
    Displaymenu = false
  }
}

function changeSensitivityOutput(event) {
  output.value = event.target.value
  if (output.value <= 0) {
    slider.value = 0.01
    output.value = 0.01
    player.sensitivity = slider.value
  } else if (output.value > 10) {
    slider.value = 10
    output.value = 10
    player.sensitivity = slider.value
  } else {
    player.sensitivity = slider.value
  }
}

function changeSensitivitySlider(event) {
  slider.value = event.target.value
  if (output.value <= 0) {
    slider.value = 0.01
    output.value = 0.01
    player.sensitivity = slider.value
  } else if (output.value > 10) {
    slider.value = 10
    output.value = 10
    player.sensitivity = slider.value
  } else {
    player.sensitivity = slider.value
  }
}

let slider = document.getElementById("sliderSensitivity")
let output = document.getElementById("sliderOutput")
let scopeSlider = document.getElementById("sliderScope")
let scopeOutput = document.getElementById("scopeOutput")
let resume = document.getElementById("resume")
let menu = document.getElementById("menu")
let effectCheck = document.getElementById("effectCheck")
let samples = document.getElementById("samples")
let Fov = document.getElementById("fov")

// Default Values

slider.value = 2
output.value = 2

Fov.value = 60
fov = 60

scopeSlider.value = 0.5
scopeOutput.value = 0.5

// -----------------------

Fov.addEventListener("input", function(event) {
  fov = event.target.value
  if (Gamecamera != undefined) {
    Gamecamera.fov = fov
  }
})

scopeSlider.addEventListener("input", function(event) {
  scopeOutput.value = event.target.value
  if (scopeOutput.value <= 0) {
    scopeSlider.value = 0.01
    scopeOutput.value = 0.01
    player.scope = scopeSlider.value
  } else if (output.value > 10) {
    scopeSlider.value = 10
    scopeOutput.value = 10
    player.scope = scopeSlider.value
  } else {
    player.scope = scopeSlider.value
  }
})

scopeOutput.addEventListener("input", function(event) {
  scopeSlider.value = event.target.value
  if (scopeOutput.value <= 0) {
    scopeSlider.value = 0.01
    scopeOutput.value = 0.01
    player.scope = scopeSlider.value
  } else if (scopeOutput.value > 10) {
    scopeSlider.value = 10
    scopeOutput.value = 10
    player.scope = scopeSlider.value
  } else {
    player.scope = scopeSlider.value
  }
})

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp)
window.addEventListener("resize", onWindowResize)
resume.addEventListener("click", mouseLock)
slider.addEventListener("input", changeSensitivityOutput)
output.addEventListener("input", changeSensitivitySlider)
effectCheck.addEventListener("input", function() {
  if (effectCheck.checked) {
    composer.addPass(fxaaPass)
  } else {
    composer.removePass(fxaaPass)
  }
})

let condition = true






// === INFO MENU ===
import { Mapupdate } from "/mapDisplay.js"
import { Weaponupdate } from "/weaponDisplay.js"

let info = false


window.addEventListener("keydown", function(event) {
  switch(event.code) {
    case "Tab":
      event.preventDefault()
      if (!info && controls.isLocked) {
        document.getElementById("info").style.display = "block"
        controls.unlock()
        info = true
        requestAnimationFrame(Mapupdate)
        requestAnimationFrame(Weaponupdate)
      } else if (info && !controls.isLocked) {
        document.getElementById("info").style.display = "none"
        controls.lock()
        info = false
      }
  }
})

let hold = false

import {ammo} from "/weaponView.js"
import {animations} from "/weaponView.js"
let ammoBar = document.getElementById("ammoBar")

let conditions = {pistol:true, sniper:true, knife:true, rifle:true}

document.addEventListener("mousedown", function(event) {
  if ( controls != undefined ) {
    if (event.buttons == "1" || event.buttons == "3" && controls.isLocked) {
      hold = true
      visionRaycaster.setFromCamera(pointer, Gamecamera)
      let intersect = visionRaycaster.intersectObjects(enemyBody, false) 
  
      if (intersect.length) {
        for (let i = 0; i < enemies.length; i++) {
          for (let j = 0; j < enemies[i].length; j++) {
            if (intersect[0].object == enemies[i][j].Character) {
              switch(current) {
                case "pistol":
                  if (conditions.pistol) {
                    conditions.pistol = false
                    if (ammo.pistolAmmo > 0) {
                      animations.pFire.reset()
                      enemies[i][j].applyDamage(5)
                      ammo.pistolAmmo -= 1
                      ammoBar.style.width = ammo.pistolAmmo + "%"
                      setTimeout(function() {
                        conditions.pistol = true
                      }, animations.pFire._clip.duration * 1000)
                    } else {
                      document.getElementById("realTimeInfo").innerHTML = "You've ran out of ammo"
                    }
                  }
                  
                  break
                case "knife":
                  if (conditions.knife) {
                    conditions.knife = false
                    animations.kFire.reset()
                    if (intersect[0].distance <= 25) {
                      enemies[i][j].applyDamage(50)
                    }
                    setTimeout(function() {
                      conditions.knife = true
                    }, animations.kFire._clip.duration * 1000)
                  }
                  
                  break
                case "sniper":
                  if (conditions.sniper) {
                    conditions.sniper = false
                    if (ammo.sniperAmmo > 0) {
                      animations.sFire.reset()
                      enemies[i][j].applyDamage(30)
                      ammo.sniperAmmo -= 1
                      ammoBar.style.width = (ammo.sniperAmmo / 10) * 100 + "%"
                      setTimeout(function() {
                        conditions.sniper = true
                      }, animations.sFire._clip.duration * 1000)
                    } else {
                      document.getElementById("realTimeInfo").innerHTML = "You've ran out of ammo"
                    }
                  }
                  
                  
                  break
                case "rifle":
                  if (hold) {
                    if (conditions.rifle) {
                      conditions.rifle = false
                      if (ammo.rifleAmmo > 0) {
                        animations.rFire.reset()
                        enemies[i][j].applyDamage(20)
                        ammo.rifleAmmo -= 1
                        ammoBar.style.width = (ammo.rifleAmmo / 60) * 100 + "%"
                        setTimeout(function() {
                          conditions.rifle = true
                        }, animations.rFire._clip.duration * 1000)
                      } else {
                        document.getElementById("realTimeInfo").innerHTML = "You've ran out of ammo"
                      }
                    }
                    
                    
                    
                    let x = setInterval(function() {
                      if (!hold) {
                        clearInterval(x)
                      } else if (hold) {
                        if (conditions.rifle) {
                          conditions.rifle = false
                          if (ammo.rifleAmmo > 0) {
                            animations.rFire.reset()
                            try {
                              enemies[i][j].applyDamage(20)
                            } catch {}
                            ammo.rifleAmmo -= 1
                            ammoBar.style.width = (ammo.rifleAmmo / 60) * 100 + "%"
                            setTimeout(function() {
                              conditions.rifle = true
                            }, animations.rFire._clip.duration * 1000)
                          } else {
                            document.getElementById("realTimeInfo").innerHTML = "You've ran out of ammo"
                          }
                        }
                        
                        
                      }
                    }, 200)
                    break
                  } 
              }
            }
          }
        } 
      } else {
        switch(current) {
          case "pistol":
            if (conditions.pistol) {
              conditions.pistol = false
              if (ammo.pistolAmmo > 0) {
                animations.pFire.reset()
                ammo.pistolAmmo -= 1
                ammoBar.style.width = ammo.pistolAmmo + "%"
                setTimeout(function() {
                  conditions.pistol = true
                }, animations.pFire._clip.duration * 1000)
              } else {
                document.getElementById("realTimeInfo").innerHTML = "You've ran out of ammo"
              }
              
            }
            
            break
          case "sniper":
            if (conditions.sniper) {
              conditions.sniper = false
              if (ammo.sniperAmmo > 0) {
                animations.sFire.reset()
                ammo.sniperAmmo -= 1
                ammoBar.style.width = (ammo.sniperAmmo / 10) * 100 + "%"
                setTimeout(function() {
                  conditions.sniper = true
                }, animations.sFire._clip.duration * 1000)
              } else {
                console.log("this is working")
                document.getElementById("realTimeInfo").innerHTML = "You've ran out of ammo"
              }
              
            }
            
            break
          case "knife":
            if (conditions.knife) {
              conditions.knife = false
              animations.kFire.reset()
              setTimeout(function() {
                conditions.knife = true
              }, animations.kFire._clip.duration * 1000)
            }
            break
          case "rifle":
            // if (conditions.rifle) {
            //   conditions.rifle = false
            //   animations.rFire.reset()
            //   ammo.rifleAmmo -= 1
            //   ammoBar.style.width = (ammo.rifleAmmo / 60) * 100 + "%"
            //   setTimeout(function() {
            //     conditions.rifle = true
            //   }, animations.rFire._clip.duration * 1000)
            // }
            
            // if (hold) {
            //   let x = setInterval(function() {
            //     if (!hold) {
            //       clearInterval(x)
            //     } else if (hold) {
            //       if (conditions.rifle) {
            //         conditions.rifle = false
            //         animations.rFire.reset()
            //         ammo.rifleAmmo -= 1
            //         ammoBar.style.width = (ammo.rifleAmmo / 60) * 100 + "%"
            //         setTimeout(function() {
            //           conditions.rifle = true
            //         }, animations.rFire._clip.duration * 1000)
            //       }
                  
            //     }
            //   }, 200)
            // }
            // break
            document.getElementById("realTimeInfo").innerHTML = "You've ran out of ammo"
            break
        }
      }
    }
  }
})

document.addEventListener("mouseup", function() {
  hold = false
})

function removeZombie(mesh) {
  for (let i = 0; i < enemies.length; i++) {
    for (let j = 0; j < enemies[i].length; j++) {
      if (mesh == enemies[i][j].Character) {
        enemies[i].splice(j, 1)
        
      }
    }
  }

  for (let k = 0; k < enemyBody.length; k++ ) {
    if (mesh == enemyBody[k]) {
      enemyBody.splice(k, 1)
    }
  }

  total -= 1
}

function dealDamage(damage) {
  if (player.sheild == 0) {
    player.health -= damage
  } else {
    player.sheild -= damage
    if (player.sheild < 0) {
      player.health -= Math.abs(player.sheild)
      player.sheild = 0
    } 
  }

  if (player.health <= 0) {
    player.health = 0
    document.getElementById("lose").style.visibility = "visible"
    controls.unlock()
  }

  //Visiual Damage

  let trans = 1
  
  let x = setInterval(function() {
    if (trans <= 0) {
      clearInterval(x)
    } else {
      trans -= 0.1
      document.getElementById("hit").style.opacity = trans
    }
  }, 10)
  
  document.getElementById("sheildBar").style.width = (player.sheild / 100) * 100 + "%"
  document.getElementById("healthBar").style.width = (player.health / 100) * 100 + "%"

  document.getElementById("snumber").innerHTML = player.sheild
  document.getElementById("hnumber").innerHTML = player.health
}


export { player }
export { dealDamage }
export { removeZombie }
export { Gamescene }
export { Gamecamera }
export { init }
export { ready }
export { Displaymenu }
export { zoomed }
export { controls }
export {info}
export {delta}
export {moveForward, moveBackward, moveLeft, moveRight, velocity}
