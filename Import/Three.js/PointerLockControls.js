import {
	Euler,
	EventDispatcher,
	Vector3
} from './Import/Three.js/three.module.js';

import { player } from "./script.js"

const _euler = new Euler( 0, 0, 0, 'YXZ' );
const _vector = new Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

let previousX = 0
let previousY = 0

let differenceX = 0
let differenceY = 0

let marker

let condition = true
let first = true

class PointerLockControls extends EventDispatcher {

	constructor( camera, domElement ) {

		super();

		if ( domElement === undefined ) {

			console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
			domElement = document.body;

		}

		this.domElement = domElement;
		this.isLocked = false;

		// Set to constrain the pitch of the camera
		// Range is 0 to Math.PI radians
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		const scope = this;

		function onMouseMove( event ) {

			if ( scope.isLocked === false ) return;

			const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			_euler.setFromQuaternion( camera.quaternion );
      
      if (player.in) {
        _euler.y -= movementX * (player.scope / 10000);
  			_euler.x -= movementY * (player.scope / 10000);
      } else {
        _euler.y -= movementX * (player.sensitivity / 1000);
  			_euler.x -= movementY * (player.sensitivity / 1000);
      }

			_euler.x = Math.max( _PI_2 - scope.maxPolarAngle, Math.min( _PI_2 - scope.minPolarAngle, _euler.x ) );

			camera.quaternion.setFromEuler( _euler );

			scope.dispatchEvent( _changeEvent );

		}

    function onTouchMove( event ) {
      event.preventDefault()


      differenceX = event.touches[marker].screenX
      differenceY = event.touches[marker].screenY

      if (first) {
        previousX = differenceX
        previousY = differenceY
        first = false
      }

      

      const movementX = differenceX - previousX
      const movementY = differenceY - previousY
      
      if ( !player.menu ) return;

			_euler.setFromQuaternion( camera.quaternion );

			_euler.y -= movementX * (player.sensitivity / 100);
			_euler.x -= movementY * (player.sensitivity / 100);

			_euler.x = Math.max( _PI_2 - scope.maxPolarAngle, Math.min( _PI_2 - scope.minPolarAngle, _euler.x ) );

			camera.quaternion.setFromEuler( _euler );

			scope.dispatchEvent( _changeEvent );

      previousX = differenceX
      previousY = differenceY

		}

    function onTouchStart(event) {
      event.preventDefault
      marker = event.touches.length - 1
    }
    
    function onTouchEnd() {
      differenceX = 0
      differenceY = 0
      previousX = 0
      previousY = 0
      first = true
    }
    
		function onPointerlockChange() {

			if ( scope.domElement.ownerDocument.pointerLockElement === scope.domElement ) {

				scope.dispatchEvent( _lockEvent );

				scope.isLocked = true;

			} else {

				scope.dispatchEvent( _unlockEvent );

				scope.isLocked = false;

			}

		}

		function onPointerlockError() {

			console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

		}

		this.connect = function () {

			scope.domElement.ownerDocument.addEventListener( 'mousemove', onMouseMove );
			scope.domElement.ownerDocument.addEventListener( 'pointerlockchange', onPointerlockChange );
			scope.domElement.ownerDocument.addEventListener( 'pointerlockerror', onPointerlockError );
      if (player.mobile) {
        document.getElementById("look").addEventListener("touchstart", onTouchStart)
        document.getElementById("look").addEventListener("touchmove", onTouchMove)
        document.getElementById("look").addEventListener("touchend", onTouchEnd)
      }

		};

		this.disconnect = function () {

			scope.domElement.ownerDocument.removeEventListener( 'mousemove', onMouseMove );
			scope.domElement.ownerDocument.removeEventListener( 'pointerlockchange', onPointerlockChange );
			scope.domElement.ownerDocument.removeEventListener( 'pointerlockerror', onPointerlockError );

		};

		this.dispose = function () {

			this.disconnect();

		};

		this.getObject = function () { // retaining this method for backward compatibility

			return camera;

		};

		this.getDirection = function () {

			const direction = new Vector3( 0, 0, - 1 );


			return function ( v ) {

				return v.copy( direction ).applyQuaternion( camera.quaternion );

			};

		}();

		this.moveForward = function ( distance ) {

			// move forward parallel to the xz-plane
			// assumes camera.up is y-up

			_vector.setFromMatrixColumn( camera.matrix, 0 );

			_vector.crossVectors( camera.up, _vector );

			camera.position.addScaledVector( _vector, distance );

		};

		this.moveRight = function ( distance ) {

			_vector.setFromMatrixColumn( camera.matrix, 0 );

			camera.position.addScaledVector( _vector, distance );

		};

		this.lock = function () {

			this.domElement.requestPointerLock();

		};

		this.unlock = function () {

			scope.domElement.ownerDocument.exitPointerLock();

		};

		this.connect();

	}

}

export { PointerLockControls };
