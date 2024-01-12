import Draggable from "react-draggable"
import { useRef } from "react"
import useGame from "./stores/useGame"

export default function InterfaceMobile()
{

    const object = useRef()
    const jump = useGame((state) => state.jump)

    const handleDrag = () => {
        const {x, y} = object.current.state
        console.log(x)
        console.log(y)
    }

    const handleStop = () => {
        object.current.state.x = 0
        object.current.state.y = 0
    }

    const handleClick = () => {
        jump()
    }
   
    return <div className="mobile-controls">
        {/* Movement */}
        <div className="raw" >            
            <Draggable
                    ref={ object }
                    axis="both"
                    bounds={ { top:-25, left: -25, right: 25, bottom: 25} }
                    onDrag={ handleDrag }
                    onStop={ handleStop }
                >
                    <div className="key">   
                        <div className="cursor">
                        </div> 
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
}

