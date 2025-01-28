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

#### 1. Sets default selector to `data-naja`

#### 2. Adds support for the `data-naja` attribute on buttons

_Standard usage:_
```html
<button data-naja data-naja-url="/url" data-naja-data='{"requestData": ""}'>Button</button>
```
- `data-naja`: Activates Naja functionality on the button.
- `data-naja-url`: Specifies the URL for the AJAX request.
- `data-naja-data`: Contains the data to be sent with the request in JSON format.

_One-Time Activation:_
```html
<button data-naja="once" data-naja-url="/url" data-naja-data='{"requestData": ""}'>Button</button>
```
- `data-naja="once"`: Ensures the event is removed after the first request, preventing further AJAX actions

#### 3. Adds support for recaptcha

#### 4. Dispatches custom events on elements

#### 5. Adds loading attribute on buttons upon interaction

### NajaInvokeExtension
Replaces naja interaction with invoke actions after interaction.

_Example before request:_
```html
<button data-naja="invoke once" data-naja-url="/url" data-naja-data='{"requestData": ""}'>Button</button>
```

_Example after request:_
```html
<button data-action="invoke#action" data-invoke-target="#snippetId" data-naja-url="/url" data-naja-data='{"requestData": ""}'>Button</button>
```

### NajaCheckValidityExtension
Prevents form sending if it's invalid
