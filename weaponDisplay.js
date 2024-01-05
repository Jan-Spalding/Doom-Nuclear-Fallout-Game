import * as THREE from "./Import/Three.js/three.module.js"

import { OrbitControls } from "./Import/Three.js/OrbitControls.js"
import { FBXLoader } from "./Import/Three.js/FBXLoader.js"


let camera, scene, renderer, light, ambientLight, controls

let container = document.getElementById("display")

function Displayinit() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 500);  

  light = new THREE.PointLight(0xffffff, 0.8, 5000)
  light.position.copy(camera.position)
  light.castShadow = true
  light.shadow.camera.near = 0.1
  light.shadow.camera.far = 30
  scene.add(light)


  ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(ambientLight)

  camera.position.set(50,0,0)
  camera.lookAt(new THREE.Vector3(0,0,0))

  controls = new OrbitControls(camera, container)

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor( 0x000000, 0 );
  renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8)

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  container.appendChild(renderer.domElement)

  let loader = new FBXLoader()
  loader.load("/Import/Models/Pistol.fbx", function(object) {
    object.position.set(0,0,0)
    object.scale.multiplyScalar(0.12)
    object.rotation.y -= Math.PI/2
    scene.add(object)
  }, function(loading){}, (error) => {
    console.log(error)
  })

}

function Weaponupdate() {
  if (info) {
    requestAnimationFrame(Weaponupdate)
  }
  
  light.position.copy(camera.position)
  
  renderer.render(scene, camera)
}

window.addEventListener("resize", function() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8)
})

let toMap = document.getElementById("toMap")
let toWeapon = document.getElementById("toWeapon")

toMap.addEventListener("click", function() {
  document.getElementById("map").style.visibility = "visible"
  document.getElementById("weapons").style.visibility = "hidden"
})

toWeapon.addEventListener("click", function() {
  document.getElementById("map").style.visibility = "hidden"
  document.getElementById("weapons").style.visibility = "visible"
})

export { Displayinit }
export { Weaponupdate } 
