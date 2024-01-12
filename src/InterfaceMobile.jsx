import Draggable from "react-draggable"
import { useEffect, useRef, useState } from "react"
import useGame from "./stores/useGame"
import { useFrame } from "@react-three/fiber"
import { addEffect } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"

export default function InterfaceMobile()
{

    const object = useRef()
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
        })

        return () => {
            unsubscribeEffect()
        }
    },[])
   
    return <div className="interface" >
        {/* Restart */}
        { phase === 'ended' && <div className="restart" onClick={ restart }>Restart</div>}
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
            <div className="jump" onClick={ handleClick }>
                <h1>
                    Jump
                </h1>
            </div>
        </div>
    </div>
}

