import { useState } from "react"

export default function useInput(initialValue) {
    const isBool = typeof initialValue === 'boolean'
    const [value, setValue] = useState(initialValue)

    return {
        value,
        setValue,
        reset: () => setValue(initialValue),
        bind: isBool ? {
            value:String(value),
            onChange: (event, data) => {
                setValue(Boolean(data.checked))
            }
        }
        : {
            value:value,
            onChange: event => {
                setValue(event.target.value)
            }
        }
    }
}