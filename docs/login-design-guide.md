# Medholic Pharmacy Login Design Guide

This guide explains the login section design so it can be reused, rebuilt, or handed to another developer.

## Files Used

- `index.html`: login structure and logo placement.
- `styles.css`: visual design, spacing, card, buttons, background, and eye icon.
- `app.js`: login behavior, password show/hide, sign-in checks, and server login.
- `assets/medholic-pharmacy-logo-transparent.png`: main login logo.

## HTML Structure

The login section is at the top of `index.html`.

```html
<section class="login-screen" id="loginScreen">
  <form class="login-card" id="loginForm">
    <img src="assets/medholic-pharmacy-logo-transparent.png" alt="Medholic Pharmacy logo" class="login-logo">
    <h1>Sign in</h1>
    <label>
      Username
      <input id="loginUsername" autocomplete="username" required>
    </label>
    <label>
      Password
      <span class="password-wrap">
        <input id="loginPassword" type="password" autocomplete="current-password" required>
        <button class="password-toggle" id="showPassword" type="button" aria-label="Show password" title="Show password">
          <span class="eye-icon" aria-hidden="true"></span>
        </button>
      </span>
    </label>
    <button class="primary-button wide" type="submit">Log in</button>
    <button class="text-button wide" id="forgotPassword" type="button">Forgot password?</button>
    <p class="login-help" id="loginHelp">Enter your assigned account details to continue.</p>
  </form>
</section>
```

## Design Choices

- The whole screen uses `display: grid` and `place-items: center` so the login card sits neatly in the middle.
- The card is white with a soft border and shadow, giving it a clean healthcare dashboard look.
- The Medholic Pharmacy logo is placed above the sign-in title to make the brand visible immediately.
- Inputs and buttons use 8px rounded corners for a modern but professional look.
- The main button uses the logo colors: orange into red.
- The password eye is drawn with CSS, so it is an icon and not text.

## Core CSS

```css
.login-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-card {
  width: min(430px, 100%);
  display: grid;
  gap: 14px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 24px;
}

.login-logo {
  width: 150px;
  height: 150px;
  object-fit: contain;
  justify-self: center;
}
```

## Password Eye Toggle

The password field is wrapped so the eye button can sit inside the input area.

```css
.password-wrap {
  position: relative;
  display: block;
}

.password-wrap input {
  padding-right: 58px;
}

.password-toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
}
```

The eye itself is drawn with CSS using `.eye-icon`, `.eye-icon::before`, and `.password-toggle.visible .eye-icon::after`.

## JavaScript Behavior

The password button switches the input between hidden and visible.

```js
$("#showPassword").addEventListener("click", () => {
  const password = $("#loginPassword");
  const isHidden = password.type === "password";
  password.type = isHidden ? "text" : "password";
  $("#showPassword").classList.toggle("visible", isHidden);
  $("#showPassword").setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  $("#showPassword").setAttribute("title", isHidden ? "Hide password" : "Show password");
});
```

## Login Details

The manager login should be kept private and should not be displayed on the sign-in page.

On Railway, login is checked by the server through `/api/login`. When opened directly as a local file, the app uses the local fallback login in `app.js`.
