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
    brokenWords?: BrokenWordTracker
}

/**
 * [chunkCount, firstElem, lastElem]
 */

export type BrokenWordTracker = [number, string, string];

export type Status = 'on progress' | 'done';