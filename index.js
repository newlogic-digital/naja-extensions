import naja from 'naja'
import { dispatchEvent } from '@newlogic-digital/utils-js'

export const initNaja = (element, bindUI = true, selectors = 'button, [role="button"]') => {
    bindUI && naja.uiHandler.bindUI(element)

    element.querySelectorAll(`:where(${selectors})${naja.uiHandler.selector}`).forEach((element) => {
        if (element.form && element.type === 'submit') return

        element.addEventListener('click', (event) => {
            naja.uiHandler.processInteraction(element, element.dataset.najaMethod ?? 'GET', element.dataset.najaUrl, element.dataset.najaData, {}, event)
        })
    })
}

export const NajaCoreExtension = (options) => {
    return {
        initialize(naja) {
            naja.uiHandler.selector = '[data-naja]'

            initNaja(document.body, false)

            naja.uiHandler.addEventListener('interaction', (event) => {
                dispatchEvent(event.detail.element, 'naja:interaction')

                if (event.detail?.element?.form?.gtoken && !event.detail?.originalEvent?.detail?.recaptchaExecuted) {
                    event.preventDefault()
                }

                if (options.onInteraction) options.onInteraction(event)
            })

            naja.snippetHandler.addEventListener('afterUpdate', (event) => {
                dispatchEvent(event.detail.snippet, 'naja:afterUpdate')

                if (options.onAfterUpdate) options.onAfterUpdate(event)
            })

            naja.addEventListener('success', (event) => {
                if (event.detail?.payload?.formId && event?.detail?.payload?.formStatus) {
                    dispatchEvent(document.getElementById(event.detail.payload.formId), `naja:form-${event.detail.payload.formStatus}`)
                }

                if (options.onSuccess) options.onSuccess(event)
            })
        }
    }
}
