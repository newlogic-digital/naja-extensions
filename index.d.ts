import { Extension } from 'naja/src/Naja'

export interface NajaCoreExtensionOptions {
    selector?: string
    selectors?: string
    loadingAttribute?: string
}

export function initNaja(element: HTMLElement, bindUI?: boolean, selectors?: string): void
export function NajaCoreExtension(options?: NajaCoreExtensionOptions): Extension
export function NajaInvokeExtension(): Extension
