# CSS Organization

This directory contains all CSS styles for the Oakland AI frontend application, organized by component and page.

## Structure

```
css/
├── components/          # Component-specific styles
│   ├── ChatWindow.css
│   ├── VoiceInput.css
│   ├── FAQSuggestions.css
│   └── IconDemo.css
├── pages/              # Page-specific styles
│   ├── login.css
│   └── LanguageSelectionPage.css
├── global/             # Global styles
│   └── index.css
└── index.css           # Main CSS entry point
```

## Usage

All CSS files are imported through the main `index.css` file, which is imported in `main.jsx`. This ensures:

1. **Centralized imports**: All styles are loaded from one place
2. **Component organization**: Each component has its own CSS file
3. **Page organization**: Each page has its own CSS file
4. **Global styles**: Common styles are in the global directory

## Adding New Styles

1. **For components**: Create a new CSS file in `components/` directory
2. **For pages**: Create a new CSS file in `pages/` directory
3. **For global styles**: Add to `global/index.css`
4. **Import**: Add the import statement to `index.css`

## Best Practices

- Use BEM methodology for class naming
- Keep styles scoped to their respective components
- Use CSS custom properties for theming
- Maintain consistent spacing and typography
- Follow the existing color palette and design system 