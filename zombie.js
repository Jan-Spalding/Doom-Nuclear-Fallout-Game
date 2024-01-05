import * as THREE from "/Import/Three.js/three.module.js"
import { CSS2DObject } from "/Import/Three.js/CSS2DRenderer.js"
import { Gamescene } from "/script.js"
import { Gamecamera } from "/script.js"
import { Displaymenu } from "/script.js"
import { removeZombie } from "/script.js"
import { dealDamage } from "/script.js"
import { delta } from "/script.js"

class zombie {
  constructor(x,y,z,hp,dmg,speed,collisions) {
    this.x = x
    this.y = y
    this.z = z
    this.hp = hp
    this.dmg = dmg
    this.speed = speed
    this.collision = collisions

    this.available = true

    this.stop = false

    this.placed = false
    
    this.Character = this.create()

    this.arrow = new THREE.ArrowHelper(new THREE.Vector3(), this.Character.position, 10, 0x0000ff)
    // Gamescene.add(this.arrow)

    this.raycasterF = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,0,0), 0, 5)

    this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,-1,0), 0, 6)

    this.difference = new THREE.Vector3()

    this.prevPosition = new THREE.Vector3()
    this.currentPosition = new THREE.Vector3()
    this.velocity = new THREE.Vector3()

    this.onGround = false
    
  }

  create() {
    
    let character = new THREE.Mesh(
      new THREE.BoxGeometry(5,10,5),
      new THREE.MeshPhongMaterial({color:0x300000}) //Dark Red
    )

    let outline = character.clone()
    outline.material = new THREE.MeshBasicMaterial({color:0xff0000, side: THREE.BackSide}) //Red
    outline.scale.multiplyScalar(1.05)

    character.add(outline)

    
    character.position.set(
      this.x,
      this.y + 5,
      this.z
    )

    this.collision.push(character)

    return character
  }

  update() {

    if (this.placed) {
      this.currentPosition.copy(this.Character.position)
    
      this.Character.lookAt(Gamecamera.position.x, this.Character.position.y, Gamecamera.position.z)
  
      this.difference.set( ((this.Character.position.x > Gamecamera.position.x) ? 1 : -1), 0, ((this.Character.position.z > Gamecamera.position.z) ? 1 : -1))
  
      // Raycasters
      
      this.arrow.position.copy(this.Character.position)
  
      let dir = this.Character.getWorldDirection(new THREE.Vector3())
      this.arrow.setDirection(dir)
      this.raycasterF.set(this.Character.position, dir)
      this.intersectF = this.raycasterF.intersectObjects(this.collision, false)
  
      if (this.intersectF.length) {
        this.Character.position.copy(this.prevPosition)
        this.currentPosition.copy(this.prevPosition)
      }
  
      let dif = new THREE.Vector3().subVectors(this.Character.position,
      Gamecamera.position)
      if (dif.x >= -10 && dif.x <= 10) {
        if (dif.y >= -10 && dif.y <= 10) {
          if (dif.z >= -10 && dif.z <= 10) {
            this.attack()
            this.stop = true
          } else {
            this.stop = false
          }
        } else {
          this.stop = false
        }
      } else {
        this.stop = false
      }
        
  
      if (!Displaymenu) {
        this.raycaster.ray.origin.copy(this.Character.position)
  
        this.intersections = this.raycaster.intersectObjects(this.collision, false) 
  
        if (!this.onGround) {
          this.velocity.y -= 9.8 * 70.0 * 0.01; // 100.0 = mass
        }
  
        this.Character.position.y += (this.velocity.y * 0.01); // new behavior
  
        if (this.Character.position.y < 0 ) {
          this.onGround = false
          this.velocity.y = 0
          this.Character.position.set(this.x, this.y, this.z)
        }
  
        if (this.intersections.length) {
  
          if (!this.onGround) {
            this.Character.position.y = 8 + this.intersections[0].point.y - 2
    
            this.onGround = true
            this.velocity.y = 0
          }
    
          // Fail Safe
          if (this.intersections[0].distance <= 5) {
            
            this.Character.position.y = 8 + this.intersections[0].point.y - 2
            
            this.onGround = true;
  
          }
        } else {
          this.onGround = false
        }
      }
  
      if (this.difference.z == 1 && !this.stop) {
        //Forward
        this.Character.position.x += Math.sin(this.Character.rotation.y) * this.speed * delta;
        this.Character.position.z += -Math.cos(this.Character.rotation.y) * this.speed * delta;
      }
  
      if (this.difference.z == -1 && !this.stop) {
        //Backward
        this.Character.position.x -= Math.sin(-this.Character.rotation.y) * this.speed * delta;
        this.Character.position.z -= -Math.cos(-this.Character.rotation.y) * this.speed * delta;
      }
      
      this.prevPosition.copy(this.currentPosition)
    
    }
    
  }

  place() {
    // add effect on spawn
    let sphere = new THREE.Mesh(new THREE.SphereGeometry(1,16,16), 
    new THREE.MeshPhongMaterial({color:0xff0000})
    )

    sphere.position.set(this.x, this.y, this.z)
    Gamescene.add(sphere)


    let scale = 1

    let y = setInterval(function() {
      if (this.placed) {
        clearInterval(y)
        sphere.visible = false
      } else {
        scale += 0.0005
        sphere.scale.multiplyScalar(scale)
        
      }
    }.bind(this), 50)

    //delay on spawn
    let count = 0 
    let x = setInterval(function() {
      count++
      if (count >= 5) {
        Gamescene.add(this.Character)
        this.placed = true
        clearInterval(x)
      }
    }.bind(this),1000)
  }

  remove() {
    removeZombie(this.Character)
    let transparent = 1
    this.Character.material.transparent = true
    this.Character.children[0].material.transparent = true
    let x = setInterval(function() {
      transparent -= 0.1
      this.Character.material.opacity = transparent
      this.Character.children[0].material.opacity = transparent
      if (transparent <= 0) {
        clearInterval(x)
        Gamescene.remove(this.Character)
        for (let i = 0; i < this.collision.length; i++ ) {
          if (this.collision[i] == this.Character) {
            this.collision.splice(i,1)
            break
          }
        }
      }
    }.bind(this), 10)
  }


  
  

  applyDamage(damage) {
    this.hp -= damage

    //CREATE LABLE
    const label = document.createElement("div")
    label.className = "lableBack"
    const text = document.createElement("p")
    text.innerHTML = damage
    text.className = "lableText"
    label.appendChild(text)

    //CREATE CSS OBJECT
    const labelObject = new CSS2DObject(label)
    this.Character.add(labelObject)

    let pos = 0
    let x = setInterval(function() {
      if (pos >= 2) {
        clearInterval(x)
        labelObject.removeFromParent()
      } else {
        pos += 0.1
        labelObject.position.y = pos
      }
    }, 10)
    
    if (this.hp <= 0) {
      if (this.Character.children.length > 1) {
        for (let i = 0 ; i < this.Character.children.length * 2; i++) {
          if (this.Character.children[1]) {
            this.Character.children[1].removeFromParent()
          }
        }
      }
      
      this.remove()
    }
  }

  attack() {
    if (this.available) {
      this.available = false
      setTimeout(function() {
        if (this.stop && !this.Character.material.transparent) {
          dealDamage(this.dmg)
        }
        this.available = true
      }.bind(this), 500)
    }
  }

}


export { zombie }



// References

// if (this.difference.x == 1) {
    //   //Forward
    //   this.Character.position.x -= Math.sin(this.Character.rotation.y) * this.speed;
    //   this.Character.position.z -= -Math.cos(this.Character.rotation.y) * this.speed;
    // }
    // if (this.difference.x == -1) {
    //   //Backward
    //   this.Character.position.x += Math.sin(this.Character.rotation.y) * this.speed;
    //   this.Character.position.z += -Math.cos(this.Character.rotation.y) * this.speed;
    // }

    // if (this.difference.z == -1) {
    //   //Left
    //   this.Character.position.x += Math.sin(this.Character.rotation.y + Math.PI/2) * this.speed;
    //   this.Character.position.z += -Math.cos(this.Character.rotation.y + Math.PI/2) * this.speed;
    // }
    // if (this.difference.z == 1) {
    //   //Right
    //   this.Character.position.x += Math.sin(this.Character.rotation.y - Math.PI/2) * this.speed;
    //   this.Character.position.z += -Math.cos(this.Character.rotation.y - Math.PI/2) * this.speed;
    // }


// setup() {

    
    
  //   document.body.ownerDocument.addEventListener("keyDown", function(event) {
  //     console.log("this is working")
  //     switch(event.code) {
  //       case "ArrowUp":
          
  //         this.moveForward = true
  //         break
  //       case "ArrowDown":
  //         this.moveBackward = true
  //         break
  //       case "ArrowLeft":
  //         this.moveLeft = true
  //         break
  //       case "ArrowRight":
  //         this.moveRight = true
  //         break;
  //     }
  //   })
    
  //   document.body.ownerDocument.addEventListener("keyUp", function(event) {
  //     switch(event.code) {
  //       case "ArrowUp":
  //         this.moveForward = false
  //         break
  //       case "ArrowDown":
  //         this.moveBackward = false
  //         break
  //       case "ArrowLeft":
  //         this.moveLeft = false
  //         break
  //       case "ArrowRight":
  //         this.moveRight = false
  //         break;  
  //     }
  //   })
  // }