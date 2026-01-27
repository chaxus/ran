# Form 表单

现代化的表单组件，提供完整的表单验证、数据管理和事件处理功能。

## 代码演示

### 基础用法

使用 `r-form` 组件包裹表单控件。

<r-form>
  <input type="text" name="username" placeholder="用户名" />
  <input type="email" name="email" placeholder="邮箱" />
  <button type="submit">提交</button>
</r-form>

```html
<r-form>
  <input type="text" name="username" placeholder="用户名" />
  <input type="email" name="email" placeholder="邮箱" />
  <button type="submit">提交</button>
</r-form>
```

### 表单布局

通过 `layout` 属性设置表单布局，支持 `vertical`（垂直，默认）、`horizontal`（水平）、`inline`（内联）三种布局。

<r-form layout="horizontal">
  <input type="text" name="username" placeholder="用户名" />
  <input type="email" name="email" placeholder="邮箱" />
  <button type="submit">提交</button>
</r-form>

```html
<r-form layout="horizontal">
  <input type="text" name="username" placeholder="用户名" />
  <input type="email" name="email" placeholder="邮箱" />
  <button type="submit">提交</button>
</r-form>
```

<r-form layout="inline">
  <input type="text" name="username" placeholder="用户名" style="margin-right: 8px;" />
  <input type="email" name="email" placeholder="邮箱" style="margin-right: 8px;" />
  <button type="submit">提交</button>
</r-form>

```html
<r-form layout="inline">
  <input type="text" name="username" placeholder="用户名" />
  <input type="email" name="email" placeholder="邮箱" />
  <button type="submit">提交</button>
</r-form>
```

### 表单验证

通过 JavaScript 调用 `setRules()` 方法设置验证规则。

```html
<r-form id="myForm">
  <input type="text" name="username" placeholder="用户名" />
  <input type="email" name="email" placeholder="邮箱" />
  <input type="password" name="password" placeholder="密码" />
  <button type="submit">提交</button>
</r-form>

<script>
  const form = document.getElementById('myForm');

  // 设置验证规则
  form.setRules({
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      message: '用户名长度必须在 3-20 个字符之间'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '请输入有效的邮箱地址'
    },
    password: {
      required: true,
      minLength: 6,
      message: '密码长度不能少于 6 个字符'
    }
  });

  // 监听提交事件
  form.addEventListener('submit', (e) => {
    const { validation, data } = e.detail;

    if (validation.valid) {
      console.log('表单验证通过', data);
      // 提交表单数据
    } else {
      console.log('表单验证失败', validation.errors);
    }
  });
</script>
```

### 自定义验证器

支持异步自定义验证器。

```javascript
form.setRules({
  username: {
    required: true,
    validator: async (value, formData) => {
      // 模拟异步验证（如检查用户名是否已存在）
      const response = await fetch(`/api/check-username?username=${value}`);
      const result = await response.json();

      if (!result.available) {
        return '用户名已被占用';
      }
      return true;
    }
  }
});
```

### 多个验证规则

一个字段可以设置多个验证规则。

```javascript
form.setRules({
  age: [
    {
      required: true,
      message: '年龄不能为空'
    },
    {
      min: 18,
      max: 100,
      message: '年龄必须在 18-100 之间'
    }
  ]
});
```

## API

### Form 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| layout | 表单布局 | `'vertical' \| 'horizontal' \| 'inline'` | `vertical` |
| disabled | 禁用整个表单 | `boolean` | `false` |
| loading | 加载状态 | `boolean` | `false` |

### Form 方法

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| validate | 验证整个表单 | - | `Promise<ValidationResult>` |
| setRules | 设置验证规则 | `rules: FieldRules` | `void` |
| getRules | 获取当前验证规则 | - | `FieldRules` |
| submit | 编程方式提交表单 | - | `void` |
| reset | 重置表单 | - | `void` |
| getData | 获取表单数据 | - | `FormDataValue` |
| setData | 设置表单数据 | `data: FormDataValue` | `void` |
| clear | 清空所有表单值 | - | `void` |

### Form 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| submit | 表单提交时触发 | `CustomEvent<FormSubmitEventDetail>` |
| validate | 表单验证完成时触发 | `CustomEvent<FormValidateEventDetail>` |
| reset | 表单重置时触发 | `CustomEvent<FormResetEventDetail>` |
| change | 任何字段值改变时触发 | `CustomEvent<FormChangeEventDetail>` |

### ValidationRule 接口

```typescript
interface ValidationRule {
  required?: boolean;           // 是否必填
  pattern?: RegExp;             // 正则表达式验证
  min?: number;                 // 最小值（数值）
  max?: number;                 // 最大值（数值）
  minLength?: number;           // 最小长度（字符串）
  maxLength?: number;           // 最大长度（字符串）
  validator?: ValidatorFunction; // 自定义验证器
  message?: string;             // 错误消息
}
```

### ValidatorFunction 类型

```typescript
type ValidatorFunction = (
  value: any,
  formData: FormDataValue
) => boolean | string | Promise<boolean | string>;
```

自定义验证器返回值：
- `true` - 验证通过
- `false` - 验证失败（使用 rule.message）
- `string` - 验证失败，返回自定义错误消息

### ValidationResult 接口

```typescript
interface ValidationResult {
  valid: boolean;           // 是否验证通过
  errors: FieldError[];     // 错误列表
  errorFields: string[];    // 有错误的字段名列表
}
```

### 事件详情接口

#### FormSubmitEventDetail

```typescript
interface FormSubmitEventDetail {
  data: FormDataValue;          // 表单数据
  formData: globalThis.FormData; // 原生 FormData 对象
  validation: ValidationResult;  // 验证结果
}
```

#### FormValidateEventDetail

```typescript
interface FormValidateEventDetail {
  valid: boolean;           // 是否验证通过
  errors: FieldError[];     // 错误列表
  data: FormDataValue;      // 表单数据
}
```

#### FormResetEventDetail

```typescript
interface FormResetEventDetail {
  previousData: FormDataValue; // 重置前的数据
}
```

#### FormChangeEventDetail

```typescript
interface FormChangeEventDetail {
  field: string;          // 改变的字段名
  value: any;             // 新值
  data: FormDataValue;    // 完整表单数据
}
```

### CSS 自定义属性

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| --form-label-color | 标签文字颜色 | `rgba(0, 0, 0, 0.88)` |
| --form-error-color | 错误消息颜色 | `#ff4d4f` |
| --form-item-margin-bottom | 表单项底部间距 | `24px` |
| --form-label-font-size | 标签字体大小 | `14px` |
| --form-error-font-size | 错误消息字体大小 | `14px` |

### CSS 部件

| 部件 | 说明 |
| --- | --- |
| form | 表单元素 |

## 完整示例

```html
<r-form id="registerForm" layout="vertical">
  <div>
    <label for="username">用户名</label>
    <input type="text" id="username" name="username" />
    <span class="error"></span>
  </div>

  <div>
    <label for="email">邮箱</label>
    <input type="email" id="email" name="email" />
    <span class="error"></span>
  </div>

  <div>
    <label for="password">密码</label>
    <input type="password" id="password" name="password" />
    <span class="error"></span>
  </div>

  <div>
    <label for="confirmPassword">确认密码</label>
    <input type="password" id="confirmPassword" name="confirmPassword" />
    <span class="error"></span>
  </div>

  <button type="submit">注册</button>
</r-form>

<script>
  const form = document.getElementById('registerForm');

  // 设置验证规则
  form.setRules({
    username: [
      { required: true, message: '用户名不能为空' },
      { minLength: 3, maxLength: 20, message: '用户名长度在 3-20 个字符' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线' }
    ],
    email: [
      { required: true, message: '邮箱不能为空' },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入有效邮箱' }
    ],
    password: [
      { required: true, message: '密码不能为空' },
      { minLength: 6, message: '密码至少 6 个字符' }
    ],
    confirmPassword: {
      required: true,
      validator: (value, formData) => {
        if (value !== formData.password) {
          return '两次密码输入不一致';
        }
        return true;
      }
    }
  });

  // 监听表单提交
  form.addEventListener('submit', async (e) => {
    const { validation, data } = e.detail;

    // 清除之前的错误提示
    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    if (!validation.valid) {
      // 显示错误消息
      validation.errors.forEach(error => {
        const errorEl = document.querySelector(`[name="${error.field}"] ~ .error`);
        if (errorEl) {
          errorEl.textContent = error.message;
        }
      });
      return;
    }

    // 提交数据到服务器
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('注册成功！');
        form.reset();
      }
    } catch (error) {
      console.error('注册失败', error);
    }
  });

  // 监听验证事件
  form.addEventListener('validate', (e) => {
    console.log('验证完成', e.detail);
  });

  // 监听字段变化
  form.addEventListener('change', (e) => {
    console.log(`字段 ${e.detail.field} 改变为:`, e.detail.value);
  });
</script>
```

## 无障碍

- 表单具有适当的 `novalidate` 属性，禁用浏览器默认验证
- 支持键盘导航
- 错误消息应该与表单控件关联（使用 `aria-describedby`）
- 禁用状态会自动传递给所有表单元素

## 最佳实践

- **验证时机**：在提交时进行完整验证，在输入时进行实时反馈
- **错误提示**：为每个验证规则提供清晰的错误消息
- **异步验证**：合理使用异步验证器，避免频繁的服务器请求
- **数据管理**：使用 `getData()` 和 `setData()` 方法管理表单数据
- **禁用状态**：加载或提交时使用 `loading` 或 `disabled` 属性
