import naja from 'naja'
import { dataset, dispatchCustomEvent } from '@newlogic-digital/utils-js'

/**
 * @param {HTMLElement} element
 * @param {boolean} bindUI
 * @param {string} selectors
 * @returns void
 */
export const initNaja = (element, bindUI = true, selectors = 'button, [role="button"]') => {
    bindUI && naja.uiHandler.bindUI(element)

    element.querySelectorAll(`:where(${selectors})${naja.uiHandler.selector}`).forEach((element) => {
        if (element.form && element.type === 'submit') return

        element.addEventListener('click', async function interaction(event) {
            await naja.uiHandler.processInteraction(element, element.dataset.najaMethod ?? 'GET', element.dataset.najaUrl, element.dataset.najaData, {}, event)

            if (element.dataset.naja?.includes('once')) {
                element.removeAttribute('data-naja')

                element.removeEventListener('click', interaction)
            }
        })
    })
}

/**
 * @param {import("./").NajaCoreExtensionOptions} options
 * @returns import('naja/dist/Naja').Extension
 */
export const NajaCoreExtension = (options = {}) => {
    return {
        initialize(naja) {
            naja.uiHandler.selector = options.selector ?? '[data-naja]'

            initNaja(document.body, false, options.selectors)

            naja.uiHandler.addEventListener('interaction', (event) => {
                dispatchCustomEvent(event.detail.element, 'naja:interaction', {
                    detail: event.detail
                })

                event.detail.options.interactionElement = event.detail.element

                const form = event.detail?.originalEvent?.target

                if (form?.gtoken && (!event.detail?.originalEvent?.detail?.recaptchaExecuted || !form?.checkValidity())) {
                    event.preventDefault()
                }
            })

            naja.snippetHandler.addEventListener('afterUpdate', (event) => {
                dispatchCustomEvent(event.detail.snippet, 'naja:afterUpdate', {
                    detail: event.detail
                })

                initNaja(event.detail.snippet, true, options.selectors)
            })

            naja.historyHandler.addEventListener('buildState', ({ detail }) => {
                detail.state.source = options.popstateSource ?? 'swup'
            })

            naja.addEventListener('success', (event) => {
                if (event.detail?.payload?.formId && event?.detail?.payload?.formStatus) {
                    dispatchCustomEvent(document.getElementById(event.detail.payload.formId), `naja:form-${event.detail.payload.formStatus}`, {
                        detail: event.detail
                    })
                }
            })

            naja.addEventListener('start', (event) => {
                event.detail.options.interactionElement?.setAttribute(options.loadingAttribute ?? 'data-loading', '')
            })

            naja.addEventListener('complete', (event) => {
                const elements = [
                    event.detail.options.interactionElement,
                    event.detail.options.interactionElement?.querySelector(`button[type="submit"]`)
                ]

                elements.forEach(element => element?.removeAttribute(options.loadingAttribute ?? 'data-loading'))
            })
        }
    }
}

export const NajaInvokeExtension = () => {
    return {
        initialize(naja) {
            naja.snippetHandler.addEventListener('afterUpdate', ({ detail }) => {
                const interactionElement = detail.options.interactionElement

                if (!interactionElement || !interactionElement?.getAttribute('data-naja')?.includes('invoke')) return

                interactionElement.setAttribute('data-invoke-target', `#${detail.snippet.id}`)
                dataset(interactionElement, 'action').add('invoke#action')
            })
        }
    }
}

export const NajaCheckValidityExtension = () => {
    return {
        initialize(naja) {
            naja.uiHandler.addEventListener('interaction', (event) => {
                const { element } = event.detail

                if (element?.form && !element.form.checkValidity()) {
                    event.preventDefault()
                }
            })
        }
    }
}
