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
            onChange: (event, {checked}) => {
                setValue(checked)
            }
        }
        : {
            value:value,
            onChange: (event, {value}) => {
                setValue(value)
            }
        }
    }
}