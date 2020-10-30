export type nameCount = {
    name: string
    count: number
}

export type NamesObj = {
    [name: string]: number
}

export type workerMessage = {
    namesObj?: NamesObj
    left?: number

}

export type Status = 'on progress' | 'done' | 'not found' | 'error';