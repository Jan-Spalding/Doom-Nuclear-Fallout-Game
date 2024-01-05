import * as THREE from "/Import/Three.js/three.module.js"
import { FBXLoader } from "/Import/Three.js/FBXLoader.js"
import { player, Gamecamera, controls } from "/script.js"

let Weaponscene, Weaponcamera, renderer, light, ambientLight

let gunPistol, gunSniper, Knife, gunRifle
let current = "pistol"

let fov

let ammo = {"sniperAmmo":10, "rifleAmmo":60, "pistolAmmo":100} 

let mixers = []
let animations = {}
let clock

let X = 3
let Y = -2
let Z = -7

let container = document.getElementById("weaponView")

function Viewinit() {
  Weaponscene = new THREE.Scene()
  Weaponcamera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 100);  

  Weaponcamera.position.set(0,0,0)
  Weaponcamera.lookAt(new THREE.Vector3(0,0,0))

  Weaponscene.add(Weaponcamera)

  light = new THREE.PointLight(0xffffff, 0.5, 500)
  light.position.copy(Weaponcamera.position)
  light.castShadow = true
  light.shadow.camera.near = 0.1
  light.shadow.camera.far = 30
  light.position.set(0,10,0)
  Weaponscene.add(light)

  clock = new THREE.Clock()


  ambientLight = new THREE.AmbientLight(0xff0000, 0.2)
  Weaponscene.add(ambientLight)

  let texture = new THREE.TextureLoader()
  
  let loader = new FBXLoader()
  loader.load("/Import/Models/Pistol Animation.fbx", (object) => {
    object.scale.multiplyScalar(0.008)
    gunPistol = object
    // console.log(gunPistol)
    gunPistol.receiveShadow = true
    gunPistol.name = "Pistol"
    gunPistol.position.set(X, Y, Z)
    gunPistol.rotation.y += Math.PI / 2
    Weaponscene.add(gunPistol)
    player.pistol = gunPistol
    
    texture.load("/Import/Images/texturePistol.png", function(texture) {
      gunPistol.children[1].material.map = texture
    })

    const Pmixer = new THREE.AnimationMixer(gunPistol)
    mixers.push(Pmixer)
    animations.pFire = Pmixer.clipAction(gunPistol.animations[3])

    animations.pFire.setLoop(THREE.LoopOnce)
    animations.pFire.play()
    animations.pFire.enabled = false
    
    loader.load("/Import/Models/Sniper Animation.fbx", (object) => {
      gunSniper = object
      // console.log(gunSniper)
      gunSniper.scale.multiplyScalar(0.005)
      gunSniper.receiveShadow = true
      gunSniper.name = "Sniper"
      gunSniper.position.set(X, Y, Z)
      gunSniper.rotation.y += Math.PI / 2
      Weaponscene.add(gunSniper)
      gunSniper.visible = false
      player.sniper = gunSniper

      texture.load("/Import/Images/textureSniper.png", function(texture) {
        gunSniper.children[0].material.map = texture
      })

      const Smixer = new THREE.AnimationMixer(gunSniper)
      mixers.push(Smixer)
      animations.sFire = Smixer.clipAction(gunSniper.animations[1])

      animations.sFire.setLoop(THREE.LoopOnce)
      animations.sFire.play()
      animations.sFire.enabled = false
      
      loader.load("/Import/Models/Knife Animation.fbx", (object) => {
        Knife = object
        // console.log(Knife)
        Knife.scale.multiplyScalar(0.015)
        Knife.receiveShadow = true
        Knife.name = "Knife"
        Knife.position.set(X, Y, Z)
        Knife.rotation.y -= Math.PI / 4
        Knife.rotation.x += Math.PI / 4
        Weaponscene.add(Knife)
        Knife.visible = false

        texture.load("/Import/Images/textureKnife.png", function(texture) {
          Knife.children[0].material.map = texture
        })

        const Kmixer = new THREE.AnimationMixer(Knife)
        mixers.push(Kmixer)
        animations.kFire = Kmixer.clipAction(Knife.animations[2])

        animations.kFire.setLoop(THREE.LoopOnce)
        animations.kFire.play()
        animations.kFire.enabled = false
        
        
        loader.load("/Import/Models/Rifle Animation.fbx", (object) => {
          gunRifle = object
          // console.log(gunRifle)
          gunRifle.scale.multiplyScalar(0.005)
          gunRifle.receiveShadow = true
          gunRifle.name = "Rifle"
          gunRifle.position.set(X, Y, Z)
          gunRifle.rotation.y += Math.PI / 2
          Weaponscene.add(gunRifle)
          gunRifle.visible = false

          texture.load("/Import/Images/textureRifle.png", function(texture) {
            gunRifle.children[0].material.map = texture
          })

          const Rmixer = new THREE.AnimationMixer(gunRifle)
          mixers.push(Rmixer)
          animations.rFire = Rmixer.clipAction(gunRifle.animations[0])

          animations.rFire.setLoop(THREE.LoopOnce)
          animations.rFire.play()
          animations.rFire.enabled = false

          // console.log(animations)
          requestAnimationFrame(update)
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

  renderer = new THREE.WebGLRenderer({ alpha: true }); 
  renderer.setClearColor( 0x000000, 0 );
  renderer.setSize(window.innerWidth, window.innerHeight)

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

  container.appendChild(renderer.domElement)

  
}

function update() {
  // console.log("rendering")
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  // if (animations.rFire.isRunning() || animations.kFire.isRunning() || animations.pFire.isRunning() || animations.sFire.isRunning()) {
  //   console.log("animations are running")
  for (let i = 0; i < mixers.length; i++) {
    mixers[i].update(delta)
  }

  
  // }
  
  renderer.render(Weaponscene, Weaponcamera)
}

window.addEventListener("resize", function() {
  Weaponcamera.aspect = window.innerWidth / window.innerHeight
  Weaponcamera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  requestAnimationFrame(update)
})

let condition = false

document.addEventListener("mousedown", function(event) {
  if (event.button == 2 && controls.isLocked) {
    event.preventDefault()
    if (gunPistol.visible || gunRifle.visible) {
      Gamecamera.zoom = 2
    }
    else if (gunSniper.visible) {
      Gamecamera.zoom = 10
      document.getElementById("SniperScope").style.visibility = "visible"
      document.getElementById("crossHair").style.visibility = "hidden"
      gunSniper.visible = false
      condition = true
      player.in = true
      requestAnimationFrame(update)
    }
  }
})

document.addEventListener("mouseup", function(event) {
  if (event.button == 2 && controls.isLocked) {
    event.preventDefault()
    Gamecamera.zoom = 1
    player.in = false
    document.getElementById("SniperScope").style.visibility = "hidden"
    document.getElementById("crossHair").style.visibility = "visible"
    if (!gunSniper.visible && condition) {
      gunSniper.visible = true
      condition = false
      requestAnimationFrame(update)
    }
  }
})

let imgKnife = document.getElementById("imgKnife")
let imgSniper = document.getElementById("imgSniper")
let imgRifle = document.getElementById("imgRifle")
let imgPistol = document.getElementById("imgPistol")
let name = document.getElementById("name")
let ammoBar = document.getElementById("ammoBar")


window.addEventListener("keydown", function(event) {
  if (event.code === "Digit1") {
    current = "pistol"
    gunPistol.visible = true
    gunSniper.visible = false
    Knife.visible = false
    gunRifle.visible = false
    document.getElementById("SniperScope").style.visibility = "hidden"
    document.getElementById("crossHair").style.visibility = "visible"
    player.in = false
    Gamecamera.zoom = 1
    condition = false

    imgKnife.style.visibility = "hidden"
    imgRifle.style.visibility = "hidden"
    imgSniper.style.visibility = "hidden"
    imgPistol.style.visibility = "visible"

    ammoBar.style.width = ammo.pistolAmmo + "%"

    name.innerHTML = current.charAt(0).toUpperCase() + current.slice(1)
    
    requestAnimationFrame(update)
  } else if (event.code === "Digit2") {
    current = "knife"
    gunPistol.visible = false
    gunSniper.visible = false
    Knife.visible = true
    gunRifle.visible = false
    document.getElementById("SniperScope").style.visibility = "hidden"
    document.getElementById("crossHair").style.visibility = "visible"
    player.in = false
    Gamecamera.zoom = 1
    condition = false

    imgKnife.style.visibility = "visible"
    imgRifle.style.visibility = "hidden"
    imgSniper.style.visibility = "hidden"
    imgPistol.style.visibility = "hidden"

    name.innerHTML = current.charAt(0).toUpperCase() + current.slice(1)

    ammoBar.style.width = "100%"
    
    requestAnimationFrame(update)
  } else if (event.code === "Digit3") {
    current = "sniper"
    gunPistol.visible = false
    gunSniper.visible = true
    Knife.visible = false
    gunRifle.visible = false
    document.getElementById("SniperScope").style.visibility = "hidden"
    document.getElementById("crossHair").style.visibility = "visible"
    player.in = false
    Gamecamera.zoom = 1
    condition = false

    imgKnife.style.visibility = "hidden"
    imgRifle.style.visibility = "hidden"
    imgSniper.style.visibility = "visible"
    imgPistol.style.visibility = "hidden"

    name.innerHTML = current.charAt(0).toUpperCase() + current.slice(1)

    ammoBar.style.width = (ammo.sniperAmmo / 10) * 100 + "%"
    
    requestAnimationFrame(update)
  } else if (event.code === "Digit4") {
    current = "rifle"
    
    gunPistol.visible = false
    gunSniper.visible = false
    Knife.visible = false
    gunRifle.visible = true
    
    document.getElementById("SniperScope").style.visibility = "hidden"
    document.getElementById("crossHair").style.visibility = "visible"
    player.in = false
    Gamecamera.zoom = 1
    condition = false

    imgKnife.style.visibility = "hidden"
    imgRifle.style.visibility = "visible"
    imgSniper.style.visibility = "hidden"
    imgPistol.style.visibility = "hidden"

    name.innerHTML = current.charAt(0).toUpperCase() + current.slice(1)

    ammoBar.style.width = (ammo.rifleAmmo / 60) * 100 + "%"

    requestAnimationFrame(update)
  }
  
})

// let FOV = document.getElementById("FOV")

// // FOV.value = 60
fov = 60

// FOV.addEventListener("input", function(event) {
//   fov = event.target.value
//   if (Weaponcamera != undefined) {
//     Weaponcamera.fov = fov
//   }
//   requestAnimationFrame(update)
// })

let x = document.getElementById("x")
let y = document.getElementById("y")
let z = document.getElementById("z")

x.value = X
y.value = Y
z.value = Z

x.addEventListener("input", function(event) {
  X = event.target.value
  if (Knife != undefined) {
    Knife.position.x = X
    gunPistol.position.x = X
    gunSniper.position.x = X
  }
  requestAnimationFrame(update)
})

y.addEventListener("input", function(event) {
  Y = event.target.value
  if (Knife != undefined) {
    Knife.position.y = Y
    gunPistol.position.y = Y
    gunSniper.position.y = Y
  }
  requestAnimationFrame(update)
})

z.addEventListener("input", function(event) {
  Z = event.target.value
  if (Knife != undefined) {
    Knife.position.z = Z
    gunPistol.position.z = Z
    gunSniper.position.z = Z
  }
  requestAnimationFrame(update)
})

window.onload = Viewinit

// export { Viewinit }

export {player}
export {ammo}
export {animations}
export {current}
export {update}
export {Weaponscene}
export {Weaponcamera}
