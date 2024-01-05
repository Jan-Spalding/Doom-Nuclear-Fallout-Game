import * as THREE from "/Import/Three.js/three.module.js"
import {Gamecamera, Displaymenu} from "/script.js"

let playlist = []
let musicPosition = 0
let sound


function AudioSetup() {
  // === AUDIO ===
  const listener = new THREE.AudioListener();
  Gamecamera.add( listener );
  
  // create a global audio source
  sound = new THREE.Audio( listener );
  
  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  // audioLoader.load("/Import/Audio/Water Hands - Annoyed.mp3", function( buffer ) {
  //   playlist.push(buffer)
  //   sound.setBuffer(playlist[(musicPosition)])
  //   sound.setVolume( 0.05 );
  //   audioLoader.load("/Import/Audio/Water Hands - Drifting.mp3", function(buffer) {
  //     playlist.push(buffer)
  //     audioLoader.load("/Import/Audio/Water Hands - F that.mp3", function(buffer) {
  //       playlist.push(buffer)
  //       audioLoader.load("/Import/Audio/Water Hands - Sudden.mp3", function(buffer) {
  //         playlist.push(buffer)
  //       })
  //     })
  //   })
  // });
}

function AudioUpdate() {
  if (!sound.isPlaying && !Displaymenu) {
    musicPosition ++
    if (musicPosition == playlist.length) {
      musicPosition = 0
    }
    // console.log(musicPosition)
    sound.setBuffer(playlist[(musicPosition)])
    sound.play()
  }
}

function Play() {
  sound.play()
}

function Pause() {
  sound.pause()
}


let volume = document.getElementById("volume")
volume.value = 0.05

volume.addEventListener("input", function(event) {
  sound.setVolume(event.target.value)
})

export {AudioUpdate}
export {AudioSetup}
export {Play}
export {Pause}