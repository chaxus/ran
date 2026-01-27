# Form

Modern form component with complete form validation, data management, and event handling capabilities.

## Code Demo

### Basic Usage

Wrap form controls with the `r-form` component.

```html
<r-form>
  <input type="text" name="username" placeholder="Username" />
  <input type="email" name="email" placeholder="Email" />
  <button type="submit">Submit</button>
</r-form>
```

### Form Layout

Set form layout using the `layout` property. Supports `vertical` (default), `horizontal`, and `inline` layouts.

```html
<r-form layout="horizontal">
  <input type="text" name="username" placeholder="Username" />
  <input type="email" name="email" placeholder="Email" />
  <button type="submit">Submit</button>
</r-form>

<r-form layout="inline">
  <input type="text" name="username" placeholder="Username" />
  <input type="email" name="email" placeholder="Email" />
  <button type="submit">Submit</button>
</r-form>
```

### Form Validation

Set validation rules by calling the `setRules()` method via JavaScript.

```html
<r-form id="myForm">
  <input type="text" name="username" placeholder="Username" />
  <input type="email" name="email" placeholder="Email" />
  <input type="password" name="password" placeholder="Password" />
  <button type="submit">Submit</button>
</r-form>

<script>
  const form = document.getElementById('myForm');

  // Set validation rules
  form.setRules({
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      message: 'Username must be 3-20 characters'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email'
    },
    password: {
      required: true,
      minLength: 6,
      message: 'Password must be at least 6 characters'
    }
  });

  // Listen to submit event
  form.addEventListener('submit', (e) => {
    const { validation, data } = e.detail;

    if (validation.valid) {
      console.log('Form validation passed', data);
      // Submit form data
    } else {
      console.log('Form validation failed', validation.errors);
    }
  });
</script>
```

### Custom Validator

Supports async custom validators.

```javascript
form.setRules({
  username: {
    required: true,
    validator: async (value, formData) => {
      // Simulate async validation (e.g., check if username exists)
      const response = await fetch(`/api/check-username?username=${value}`);
      const result = await response.json();

      if (!result.available) {
        return 'Username already taken';
      }
      return true;
    }
  }
});
```

### Multiple Validation Rules

A field can have multiple validation rules.

```javascript
form.setRules({
  age: [
    {
      required: true,
      message: 'Age is required'
    },
    {
      min: 18,
      max: 100,
      message: 'Age must be between 18-100'
    }
  ]
});
```

## API

### Form Properties

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| layout | Form layout | `'vertical' \| 'horizontal' \| 'inline'` | `vertical` |
| disabled | Disable entire form | `boolean` | `false` |
| loading | Loading state | `boolean` | `false` |

### Form Methods

| Method | Description | Parameters | Return Value |
| --- | --- | --- | --- |
| validate | Validate entire form | - | `Promise<ValidationResult>` |
| setRules | Set validation rules | `rules: FieldRules` | `void` |
| getRules | Get current validation rules | - | `FieldRules` |
| submit | Submit form programmatically | - | `void` |
| reset | Reset form | - | `void` |
| getData | Get form data | - | `FormDataValue` |
| setData | Set form data | `data: FormDataValue` | `void` |
| clear | Clear all form values | - | `void` |

### Form Events

| Event | Description | Callback Parameter |
| --- | --- | --- |
| submit | Triggered on form submission | `CustomEvent<FormSubmitEventDetail>` |
| validate | Triggered after form validation | `CustomEvent<FormValidateEventDetail>` |
| reset | Triggered on form reset | `CustomEvent<FormResetEventDetail>` |
| change | Triggered when any field value changes | `CustomEvent<FormChangeEventDetail>` |

### ValidationRule Interface

```typescript
interface ValidationRule {
  required?: boolean;           // Is required
  pattern?: RegExp;             // Regex validation
  min?: number;                 // Minimum value (numeric)
  max?: number;                 // Maximum value (numeric)
  minLength?: number;           // Minimum length (string)
  maxLength?: number;           // Maximum length (string)
  validator?: ValidatorFunction; // Custom validator
  message?: string;             // Error message
}
```

### ValidatorFunction Type

```typescript
type ValidatorFunction = (
  value: any,
  formData: FormDataValue
) => boolean | string | Promise<boolean | string>;
```

Custom validator return values:
- `true` - Validation passed
- `false` - Validation failed (uses rule.message)
- `string` - Validation failed, returns custom error message

### ValidationResult Interface

```typescript
interface ValidationResult {
  valid: boolean;           // Is validation passed
  errors: FieldError[];     // Error list
  errorFields: string[];    // List of field names with errors
}
```

### CSS Custom Properties

| Property | Description | Default |
| --- | --- | --- |
| --form-label-color | Label text color | `rgba(0, 0, 0, 0.88)` |
| --form-error-color | Error message color | `#ff4d4f` |
| --form-item-margin-bottom | Form item bottom margin | `24px` |
| --form-label-font-size | Label font size | `14px` |
| --form-error-font-size | Error message font size | `14px` |

### CSS Parts

| Part | Description |
| --- | --- |
| form | Form element |

## Complete Example

```html
<r-form id="registerForm" layout="vertical">
  <div>
    <label for="username">Username</label>
    <input type="text" id="username" name="username" />
    <span class="error"></span>
  </div>

  <div>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" />
    <span class="error"></span>
  </div>

  <div>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" />
    <span class="error"></span>
  </div>

  <button type="submit">Register</button>
</r-form>

<script>
  const form = document.getElementById('registerForm');

  form.setRules({
    username: [
      { required: true, message: 'Username is required' },
      { minLength: 3, maxLength: 20, message: 'Username must be 3-20 characters' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers and underscores allowed' }
    ],
    email: [
      { required: true, message: 'Email is required' },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email' }
    ],
    password: [
      { required: true, message: 'Password is required' },
      { minLength: 6, message: 'Password must be at least 6 characters' }
    ]
  });

  form.addEventListener('submit', async (e) => {
    const { validation, data } = e.detail;

    if (!validation.valid) {
      validation.errors.forEach(error => {
        const errorEl = document.querySelector(`[name="${error.field}"] ~ .error`);
        if (errorEl) errorEl.textContent = error.message;
      });
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Registration successful!');
        form.reset();
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  });
</script>
```

## Accessibility

- Form has proper `novalidate` attribute, disabling browser default validation
- Supports keyboard navigation
- Error messages should be associated with form controls (using `aria-describedby`)
- Disabled state automatically passes to all form elements

## Best Practices

- **Validation Timing**: Perform complete validation on submit, provide real-time feedback during input
- **Error Messages**: Provide clear error messages for each validation rule
- **Async Validation**: Use async validators reasonably, avoid frequent server requests
- **Data Management**: Use `getData()` and `setData()` methods to manage form data
- **Disabled State**: Use `loading` or `disabled` property during loading or submission
