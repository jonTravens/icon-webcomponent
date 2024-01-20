# Icon Component

A web component for displaying icons.

## Installation

You can install this component via npm:

```bash
npm install icon-component
```

Or include it directly in your HTML file using unpkg.com:
```html
<script src="https://unpkg.com/icon-component"></script>
```

## Utilisation

```html
<icon-component icon="example-icon" size="24"></icon-component>
```

## Attributes

`icon`: Name of the icon to display.
`size`: Size of the icon in pixels.

## Browser Compatibility

This component uses Web Components and ES6 modules. Make sure to include polyfills for browsers that do not support these features.

```html
<!-- Web Components Polyfill -->
<script src="https://unpkg.com/@webcomponents/webcomponentsjs"></script>

<!-- ES6 Modules Polyfill -->
<script type="module-shim" src="https://unpkg.com/es-module-shims"></script>

<!-- Your icon component script -->
<script src="https://unpkg.com/icon-component"></script>
```
