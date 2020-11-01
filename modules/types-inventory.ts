export type NameCount = {
    name: string
    count: number
}

export type NamesObj = {
    [name: string]: number
}

export type WorkerMessage = {
    namesObj?: NamesObj
    left?: number

}

export type Status = 'on progress' | 'done';