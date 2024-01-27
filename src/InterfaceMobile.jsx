import Draggable from "react-draggable"
import { useEffect, useRef, useState } from "react"
import useGame from "./stores/useGame"
import { useFrame } from "@react-three/fiber"
import { addEffect } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"

export default function InterfaceMobile()
{

    const object = useRef()
    const time = useRef()
    const jump = useGame((state) => state.jump)
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)

    const handleStop = () => {
        object.current.state.x = 0
        object.current.state.y = 0
    }

    const handleClick = () => {
        const state = useGame.getState()
        state.start()
        jump()
    }

    useEffect(() =>
    {

        const unsubscribeEffect = addEffect(() => {

            // Move the ball
            const state = useGame.getState()
            const move = state.move
            const { x, y } = object.current.state
            if (x!=0 && y!=0){
                const state = useGame.getState()
                state.start()
            }
            if(move != null){
                const bodyPosition = move(x,y)
                const blocksCount = state.blocksCount
                if(bodyPosition.z < - (blocksCount * 4 + 2))
                    state.end()
                if(bodyPosition.y < -4)
                    state.restart()
            }
            
            // Time

            let elapseTime = 0
            if(state.phase === 'playing')
                elapseTime = Date.now() - state.startTime
            else if (state.phase === 'ended')
                elapseTime = state.endTime - state.startTime

            elapseTime /= 1000
            elapseTime = elapseTime.toFixed(2)
            
            if(time.current)
                time.current.textContent = elapseTime
        })

        return () => {
            unsubscribeEffect()
        }
    },[])
   
    return <div className="interface" >
        {/* Time */}
        <div ref={ time } className="time">0.00</div>
        {/* Restart */}
        { phase === 'ended' && <div className="restart" onClick={ restart }>Click Here</div>}
        {/* Controls */}
        <div className="mobile-controls">
            {/* Movement */}
            <div className="raw" >            
                <Draggable
                        ref={ object }
                        axis="both"
                        bounds={ { top:-25, left: -25, right: 25, bottom: 25} }
                        onStop={ handleStop }
                    >
                        <div className="key">   
                            <div className="cursor"/>
                        </div>
                </Draggable>
            </div>
            {/* Jump */}
            <div className="jump" onTouchStart={ handleClick } >
                <h1>
                    Jump
                </h1>
            </div>
        </div>
    </div>
}

