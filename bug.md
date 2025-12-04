# Bug Report: Persistent Rounded Corner Artifacts on Dashboard Panels

## Description
The top corners of the dashboard panel (Chat) display visual artifacts, described as "rounded white corners" or "curves," where the panel header meets the panel border. Despite multiple attempts to resolve this via CSS, the issue persists for the user.

## Steps to Reproduce
1. Navigate to the dashboard (`/dashboard`).
2. Observe the top-left and top-right corners of the chat panel.
3. Note the visual artifact where the header background meets the panel's rounded border.

## Environment
- **OS**: Mac
- **Browser**: Chrome (assumed based on standard dev environment, but could be Safari)
- **Display**: Likely High-DPI (Retina)

## Attempts to Fix
1.  **Reduced Border Radius**: Reduced `.panel` border-radius from `24px` to `16px` (`var(--radius-md)`).
2.  **Matched Header Radius**: Explicitly set `.panel-header` border-radius to match the parent (`var(--radius-md) var(--radius-md) 0 0`).
3.  **Calculated Radius**: Adjusted `.panel-header` border-radius to `calc(var(--radius-md) - 1px)` to account for the 1px parent border.
4.  **Overflow Clipping**: Removed `position: sticky`, `backdrop-filter`, and manual `border-radius` from `.panel-header`, relying on the parent `.panel`'s `overflow: hidden` to clip the content.

## Potential Causes
-   **Sub-pixel Rendering**: On high-DPI displays, the browser's anti-aliasing of the rounded border vs. the clipped child background can create bleed-through or gaps.
-   **Stacking Context**: Interaction between `flex`, `overflow: hidden`, and `z-index` (though `z-index` was removed in the last attempt) might be causing the clipping to fail or render incorrectly.
-   **Border Transparency**: The `.panel` has a semi-transparent white border (`rgba(255, 255, 255, 0.5)`). If the background behind the panel is light, and the header is white, the blending at the curve might be creating the visual artifact.
-   **Browser Specificity**: Safari on Mac is known to have issues with `overflow: hidden` and `border-radius` on flex containers (sometimes requires `transform: translateZ(0)` or `mask-image`).

## Next Steps for Investigation
-   Try applying `transform: translateZ(0)` to the `.panel` to force a new composite layer.
-   Try using a `mask-image` to enforce the rounded corners.
-   Try making the border opaque instead of transparent.
-   Test on different browsers/screens to isolate the rendering behavior.
