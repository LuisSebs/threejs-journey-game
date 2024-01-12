import Lights from './Lights.jsx'
import { Level } from './Level.jsx' 
import { Physics } from '@react-three/rapier'
import Player from './Player.jsx'
import useGame from './stores/useGame.jsx'
import InterfaceMobile from './InterfaceMobile.jsx'

export default function Experience()
{

    const blocksCount = useGame((state) => state.blocksCount)
    const blocksSeed = useGame((state) => state.blocksSeed)

    return <>

        <color args={ [ '#252525' ] } attach="background" />

        <Physics debug={ false } >
            <Lights />
            <Level count={ blocksCount } seed={ blocksSeed } />
            <Player />
        </Physics>

    </>
}