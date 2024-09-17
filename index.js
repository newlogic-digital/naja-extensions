import naja from 'naja'
import { dispatchEvent } from '@newlogic-digital/utils-js'

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

        element.addEventListener('click', (event) => {
            naja.uiHandler.processInteraction(element, element.dataset.najaMethod ?? 'GET', element.dataset.najaUrl, element.dataset.najaData, {}, event)
        })
    })
}

/**
 * @param {import("./").NajaCoreExtensionOptions} options
 * @returns import('naja/dist/Naja').Extension
 */
export const NajaCoreExtension = (options) => {
    return {
        initialize(naja) {
            naja.uiHandler.selector = options.selector ?? '[data-naja]'

            initNaja(document.body, false, options.selectors)

            naja.uiHandler.addEventListener('interaction', (event) => {
                dispatchEvent(event.detail.element, 'naja:interaction')

                event.detail.options.interactionElement = event.detail.element

                if (event.detail?.element?.form?.gtoken && !event.detail?.originalEvent?.detail?.recaptchaExecuted) {
                    event.preventDefault()
                }
            })

            naja.snippetHandler.addEventListener('afterUpdate', (event) => {
                dispatchEvent(event.detail.snippet, 'naja:afterUpdate')
            })

            naja.addEventListener('success', (event) => {
                if (event.detail?.payload?.formId && event?.detail?.payload?.formStatus) {
                    dispatchEvent(document.getElementById(event.detail.payload.formId), `naja:form-${event.detail.payload.formStatus}`)
                }
            })

            naja.addEventListener('start', (event) => {
                event.detail.options.interactionElement.setAttribute(options.loadingAttribute ?? 'data-loading', '')
            })

            naja.addEventListener('complete', (event) => {
                event.detail.options.interactionElement.removeAttribute(options.loadingAttribute ?? 'data-loading')
            })
        }
    }
}
