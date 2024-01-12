import { useRapier, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { Bounds, useKeyboardControls } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import useGame from './stores/useGame'
import { useMemo } from 'react'

export default function Player()
{

    const body = useRef()
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const { rapier, world } = useRapier()
    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)
    const setJump = useGame((state) => state.setJump)
    const setMove = useGame((state) => state.setMove)
    const setReset = useGame((state) => state.setReset)

    const move = (x,y) =>
    {
        const impulse = { x: 0, y: 0, z: 0 }
        const impulseStrengthForwardBackward = 0.02 * (y/25)
        const impulseStrengthLeftwardRightward = 0.02 * (x/25)
        impulse.z += impulseStrengthForwardBackward
        impulse.x += impulseStrengthLeftwardRightward
        body.current.applyImpulse(impulse)
        
        const bodyPosition = body.current.translation()
        
        return bodyPosition
    }

    const jump = () =>
    {
        /*
            Cuando se realiza el salto, se puede aplicar
            una infinidad de veces, lo cual es malo. Para
            arreglarlo debemos de escuchar cuando la esfera
            se ha despegado del suelo y cuando la esfera
            ha vuelto a caer. Para ello usaremos el raycaster
            de r3f.

            Primero definiremos el origen del rayo, el cual 
            corresponde a la parte de abajo de la esfera.
            Usaremos el origen de esta, para asociarlo al
            rayo, como el radio de la esfera es de 0.3,
            reducimos la coordenada Y en -0.31, un poco más
            abajo.
        */

        const origin = body.current.translation() // origen de la esfera
        origin.y -= 0.31  // origen del rayo
        const direction = { x: 0, y: - 1, z: 0 } // direccion del rayo
        const ray = new rapier.Ray(origin, direction) // rayo
        const hit = world.castRay(ray, 10, true) // raycaster. 10: distancia maxima del rayo

        /*
            Si la esfera esta a 0.15 unidades del suelo
            el jugador, puede volver a saltar.
        */
        if(hit.toi < 0.15)
            body.current.applyImpulse({ x: 0, y: 0.5, z:0 })
    }

    const reset = () => 
    {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 0, z: 0 })

    }

    useEffect(() => 
    {
        setJump( jump )

        setMove( move )

        setReset( reset ) 

        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (value) =>
            {
                if(value === 'ready')
                {
                    reset()
                }
            }
        )

        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) => 
            {
                if(value)
                    jump()
            }
        )

        const unsubscribeAny = subscribeKeys(
            () => 
            {
                start()
            }
        )

        return () =>
        {
            unsubscribeJump()
            unsubscribeAny()
            unsubscribeReset()
        }
    }, [])

    useFrame((state, delta) =>
    {
        {/* Teclas */}
        const { forward, backward, leftward, rightward } = getKeys()

        {/* Movimientos */}
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 0.6 * delta
        const torqueStrength = 0.2 * delta
        
        if(forward)
        {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }

        if(rightward)
        {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }

        if(backward)
        {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }

        if(leftward)
        {
            impulse.x -= impulseStrength
            torque.z += impulseStrength
        }

        {/* Aplicacion */}
        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        /**
         * Camera
         */
        const bodyPosition = body.current.translation()
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.65

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        /**
         * Phases
         */
         if(bodyPosition.z < - (blocksCount * 4 + 2))
         end()

         if(bodyPosition.y < -4)
         restart()
    })

    return <RigidBody 
                ref={ body } 
                canSleep={ false } 
                colliders="ball" 
                restitution={ 0.2 } 
                friction={ 1 } 
                position={ [ 0, 1, 0] } 
                linearDamping={ 0.5 }
                angularDamping={ 0.5 }
            >
        <mesh castShadow >
            <icosahedronGeometry args={ [ 0.3, 1 ] } />
            <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>
    </RigidBody>
}