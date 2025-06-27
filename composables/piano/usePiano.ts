import * as Tone from 'tone'

const reverb = new Tone.Reverb({
    decay: 3,  // 殘響持續時間（秒）
    wet: 0.4   // 混合比：0 = 沒有殘響，1 = 全部是殘響
}).toDestination()

const synth = new Tone.Sampler({
    urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        A4: "A4.mp3"
    },
    baseUrl: "/nuxt/sounds/",
    onload: () => console.log('Piano loaded')
})

// 接上 reverb
synth.connect(reverb)

let isInited = false
export const usePiano = () => {

    const init = async () => {
        if (!isInited) {
            await reverb.generate()
            await Tone.start()
            isInited = true
        }
    }

    const MIN_DURATION = 2000
    const noteStartTimes: Record<string, number> = {}

    const playNoteStart = async (note: string) => {
        await init()
        synth.triggerAttack(note)
        noteStartTimes[note] = performance.now()
    }

    const playNoteStop = (note: string) => {
        const now = performance.now()
        const start = noteStartTimes[note] ?? now
        const elapsed = now - start
        const remaining = MIN_DURATION - elapsed

        if (remaining > 0) {
            setTimeout(() => synth.triggerRelease(note), remaining)
        } else {
            synth.triggerRelease(note)
        }
    }

    return {
        playNoteStart,
        playNoteStop
    }
}