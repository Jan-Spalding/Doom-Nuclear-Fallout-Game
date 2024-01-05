import * as THREE from "./Import/Three.js/three.module.js"
import { FBXLoader } from "./Import/Three.js/FBXLoader.js"
import { OrbitControls } from "./Import/Three.js/OrbitControls.js"
import { info } from "./script.js"

import { Gamecamera } from "./script.js"

let camera, scene, renderer, light, ambientLight, controls, player

let container = document.getElementById("mapDisplay")

function mapInit() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500);  

  controls = new OrbitControls(camera, container)
  controls.target0 = new THREE.Vector3(0,0,0)
  controls.reset()

  
  camera.position.set(50,50,0)
  camera.lookAt(new THREE.Vector3(0,0,0))
  scene.add(camera)

  let loader = new FBXLoader()
  loader.load("./Import/Models/Maps/Map.fbx", function(object) {
    object.position.set(0,0,0)
    object.scale.multiplyScalar(0.012)
    scene.add(object)
  })

  player = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xffffff})
  )

  scene.add(player)
  
  light = new THREE.PointLight(0xffffff, 0.8, 5000)
  light.position.copy(camera.position)
  light.castShadow = true
  light.shadow.camera.near = 0.1
  light.shadow.camera.far = 30
  scene.add(light)

  ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(ambientLight)

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor( 0x000000, 0 );
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8)

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  container.appendChild(renderer.domElement)

  
}

let condition = false


function Mapupdate() {
  if (info) {
    requestAnimationFrame(Mapupdate)
  }

  light.position.copy(camera.position)

  player.position.set(Gamecamera.position.x * 0.10, Gamecamera.position.y * 0.12 - 3, Gamecamera.position.z * 0.10)

  if (info && !condition) {
    condition = true
    controls.target = player.position
    camera.position.set(50,50,(player.position.z))
  } else if (!info && condition) {
    condition = false
  }

  controls.update()
  
  renderer.render(scene, camera)
}


window.addEventListener("resize", function() {
  camera.aspect = window.innerWidth / window.innerHeight * 0.8
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight * 0.8)
})

let buttons = document.getElementsByClassName("keyButton")

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function(event) {
    if (event.target == buttons[0]) {
      controls.target = player.position
      camera.position.set(50,50, (player.position.z))
    } else if (event.target == buttons[1]) {
      controls.target = new THREE.Vector3(0,0,20)
      camera.position.set(50,50,20)
    } else if (event.target == buttons[2]) {
      controls.target = new THREE.Vector3(0,0,80)
      camera.position.set(50,50,80)
    } else if (event.target == buttons[3]) {
      controls.target = new THREE.Vector3(0,0,130)
      camera.position.set(50,50,130)
    } else if (event.target == buttons[4]) {
      controls.target = new THREE.Vector3(0,0,150)
      camera.position.set(50,50,150)
    }
  })
}

export {mapInit}
export {Mapupdate}
