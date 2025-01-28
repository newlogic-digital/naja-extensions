# Naja Extensions

## Usage

```javascript
    import {
        NajaCoreExtension,
        NajaInvokeExtension,
        NajaCheckValidityExtension
    } from '@newlogic-digital/naja-extensions'
    import naja from 'naja'

    naja.registerExtension(NajaCoreExtension())
    naja.registerExtension(NajaInvokeExtension())
    naja.registerExtension(NajaCheckValidityExtension())

    naja.initialize()
```

## Info
### NajaCoreExtension

#### Sets default selector to `data-naja`

#### Adds support for the `data-naja` attribute on buttons

Standard usage:
```html
<button data-naja data-naja-url="/url" data-naja-data='{"requestData": ""}'>Button</button>
```
- `data-naja`: Activates Naja functionality on the button.
- `data-naja-url`: Specifies the URL for the AJAX request.
- `data-naja-data`: Contains the data to be sent with the request in JSON format.

One-Time Activation:
```html
<button data-naja="once" data-naja-url="/url" data-naja-data='{"requestData": ""}'>Button</button>
```
- `data-naja="once"`: Ensures the event is removed after the first request, preventing further AJAX actions

#### Adds support for recaptcha

#### Dispatches custom events on elements

#### Adds loading attribute on buttons upon interaction

### NajaInvokeExtension

#### Replaces naja interaction with invoke actions after interaction.

Example before reuquest:
```html
<button data-naja="invoke once" data-naja-url="/url" data-naja-data='{"requestData": ""}'>Button</button>
```

Example after request:
```html
<button data-action="invoke#action" data-invoke-target="#snippetId" data-naja-url="/url" data-naja-data='{"requestData": ""}'>Button</button>
```

### NajaCheckValidityExtension

Prevents form sending if it's invalid
