import naja from 'naja'
import { dispatchCustomEvent } from '@newlogic-digital/utils-js'

/**
 * @param {HTMLElement} element
 * @returns {HTMLFormElement | undefined}
 */
const formOf = element => (element instanceof HTMLFormElement ? element : element?.form ?? undefined)

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
          detail: event.detail,
        })

        event.detail.options.interactionElement = event.detail.element

        const form = formOf(event.detail.element)

        if (form?.gtoken && (!form.recaptchaExecuted || !form.checkValidity())) {
          event.preventDefault()
        }
        else if (form) {
          form.recaptchaExecuted = undefined
        }
      })

      naja.snippetHandler.addEventListener('afterUpdate', (event) => {
        dispatchCustomEvent(event.detail.snippet, 'naja:afterUpdate', {
          detail: event.detail,
        })

        initNaja(event.detail.snippet, true, options.selectors)
      })

      naja.historyHandler.addEventListener('buildState', ({ detail }) => {
        detail.state.source = options.popstateSource ?? 'swup'
      })

      naja.addEventListener('success', (event) => {
        const { formId, formStatus } = event.detail.payload

        if (!formId || !formStatus) return

        const formElement = document.getElementById(formId)

        if (!formElement) return

        if (formElement.dataset.naja === 'dialog' && formStatus === 'success') {
          formElement.closest('dialog')?.close()
        }

        dispatchCustomEvent(formElement, `naja:form-${formStatus}`, {
          detail: event.detail,
        })
      })

      naja.addEventListener('start', (event) => {
        event.detail.options.interactionElement?.setAttribute(options.loadingAttribute ?? 'data-loading', '')
      })

      naja.addEventListener('complete', (event) => {
        const elements = [
          event.detail.options.interactionElement,
          event.detail.options.interactionElement?.querySelector(`button[type="submit"]`),
        ]

        elements.forEach(element => element?.removeAttribute(options.loadingAttribute ?? 'data-loading'))
      })
    },
  }
}

export const NajaCommandExtension = () => {
  return {
    initialize(naja) {
      naja.snippetHandler.addEventListener('afterUpdate', ({ detail }) => {
        const interactionElement = detail.options.interactionElement

        if (!interactionElement || !interactionElement?.getAttribute('data-naja')?.includes('command')) return

        const command = interactionElement.getAttribute('command')
        const commandForElement = document.getElementById(interactionElement.getAttribute('commandfor'))

        if (document.getElementById(detail.snippet.id).contains(commandForElement)) {
          commandForElement?.[command.replace(/^--/, '')
            .replace(/(-\w)/g, string => string[1].toUpperCase())]?.()
        }
      })
    },
  }
}

export const NajaCheckValidityExtension = () => {
  return {
    initialize(naja) {
      naja.uiHandler.addEventListener('interaction', (event) => {
        const { element } = event.detail

        const form = element instanceof HTMLFormElement
          ? element
          : element?.type === 'submit' ? element.form : null

        if (form && !form.checkValidity()) {
          event.preventDefault()
        }
      })
    },
  }
}