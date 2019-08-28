import { useState, ChangeEvent, FormEvent } from "react"
import { CheckboxProps, FormProps } from "semantic-ui-react";

export function useInput(initialValue : string) {
    const [value, setValue] = useState(initialValue)
    return {
        value,
        setValue,
        reset: () => setValue(initialValue),
        bind: {
            value:value,
            onChange: (event : ChangeEvent<HTMLInputElement>, data : FormProps) => {
                setValue(data.value)
            }
        }
    }
}

export function useInputBool(initialValue : boolean) {
    const [value, setValue] = useState(initialValue)
    return {
        value,
        setValue,
        reset: () => setValue(initialValue),
        bind: {
            value:String(value),
            onChange: (event : FormEvent<HTMLInputElement>, data : CheckboxProps) => {
                setValue(data.checked!)
            }
        }
    }
}