import { Stats } from '@react-three/drei'
import { Physics, Debug } from '@react-three/rapier'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import Architecture from './Architecture.jsx'

export default function Experience() {
    
    return <>
        <Physics gravity={[0, -6, 0]}>
            {/* <Debug />  */}
            {/* <Stats /> */}
            <Level />
            <Player />
            <Architecture/>
        </Physics>
    </>
}