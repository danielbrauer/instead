import { ChangeEvent, FormEvent, useState } from 'react'
import { CheckboxProps, FormProps } from 'semantic-ui-react'

type Transform = (data: string) => string

export function useInput(initialValue: string, transform?: Transform) {
    const [value, setValue] = useState(initialValue)
    return {
        value,
        setValue,
        reset: () => setValue(initialValue),
        bind: {
            value: value,
            onChange: (event: ChangeEvent<HTMLInputElement>, data: FormProps) => {
                // const result = transform ? transform(data.value) : data.value
                // setValue(result)
                setValue(data.value)
            },
        },
    }
}

export function useInputBool(initialValue: boolean) {
    const [value, setValue] = useState(initialValue)
    return {
        value,
        setValue,
        reset: () => setValue(initialValue),
        bind: {
            value: String(value),
            onChange: (event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
                setValue(data.checked!)
            },
        },
    }
}
