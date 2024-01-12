import { create } from 'zustand'
import { subscribeWithSelector } from  'zustand/middleware'

export default create(subscribeWithSelector((set) =>
{
    return {
        blocksCount: 1,
        blocksSeed: 0,
        /**
         * Time
         */
        startTime: 0,
        endTime: 0,
        /**
         * Phases
         */
        phase: 'ready',
        jump: null,
        move: null,
        reset: null,
        start: () =>
        {
           set((state) => 
           {
             if(state.phase === 'ready')
                return { phase: 'playing', startTime: Date.now() }

            return {}
           }) 
        },
        restart: () =>
        {
           set((state) => 
           {
             if(state.phase === 'playing' || state.phase === 'ended')
                return { phase: 'ready', blocksSeed: Math.random() }
            
            return {}
           }) 
        },
        end: () =>
        {
           set((state) => 
           {
             if(state.phase === 'playing')
                return { phase: 'ended', endTime: Date.now() }

            return {}
           }) 
        },
        setJump: (e) => 
        {
            set((_) => 
            {
               return { jump: e }
            })
        },
        setMove: (e) =>
        {
            set((_) =>
            {
               return { move: e }
            })
        },
        setReset: (e) =>
        {
            set((_) =>
            {
               return { reset: e }
            })
        }
    }
}))