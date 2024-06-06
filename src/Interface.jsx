import { useKeyboardControls } from "@react-three/drei"
import { useEffect, useRef } from "react"
import useGame from "./stores/useGame"
import { addEffect } from "@react-three/fiber"

export default function Interface()
{
    const time = useRef()
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)
    
    useEffect(() => 
    {
        const unsubscribeEffect = addEffect(() => 
        {
            const state = useGame.getState()
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
    }, [])

    return <div className="interface interface-desktop">
        {/* Time */}
        <div ref={ time } className="time">0.00</div>
        {/* Restart */}
        { phase === 'ended' && <div className="restart" onClick={ restart }>Restart</div> }
        {/* Controls */}
        <div className="controls">
            <div className="raw">
                <div className={` key ${forward ? 'active' : '' } `}><p>W</p></div>
            </div>
            <div className="raw">
                <div className={` key ${leftward ? 'active' : '' } `}><p>A</p></div>
                <div className={` key ${backward ? 'active' : '' } `}><p>S</p></div>
                <div className={` key ${rightward ? 'active' : '' } `}><p>D</p></div>
            </div>
            <div className="raw">
                <div className={` key large ${jump ? 'active' : '' } `}><p>SPACE</p></div>
            </div>
        </div>
    </div>
}