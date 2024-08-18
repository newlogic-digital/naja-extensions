import { Extension } from 'naja/dist/Naja'

export interface NajaCoreExtensionOptions {
    onInteraction?: Function
    onAfterUpdate?: Function
    onSuccess?: Function
    selectors?: string
}

export function initNaja(element: HTMLElement, bindUI?: boolean, selectors?: string): void
export function NajaCoreExtension(options: NajaCoreExtensionOptions): Extension
