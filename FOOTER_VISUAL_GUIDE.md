# Footer Visual Design Guide

## Standard Footer Layout

```
┌─────────────────────────────────────────────────────────┐
│                     WESTERN CAPITAL LOGO                │
│                         [Link to /]                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     FOOTER CONTENT                      │
│                                                          │
│  NEWSROOM & CAREER  |  DOWNLOADS                       │
│  ────────────────   |  ──────────                       │
│  • Media Release    |  • Policies & Practices           │
│  • Current Opening  |  • Trustee Details                │
│  • Awards & Recog.  |  • RBI Compliance                 │
│                     |  • Other Disclosures              │
│                                                          │
│            [Decorative Footer Pattern Image]            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  © 2021. Western Capital Advisors Private Limited      │
└─────────────────────────────────────────────────────────┘
```

## Mobile View (Responsive)

```
┌──────────────────────────┐
│  WESTERN CAPITAL LOGO    │
│      [Link to /]         │
└──────────────────────────┘

┌──────────────────────────┐
│  NEWSROOM & CAREER       │
│  ──────────────────      │
│  • Media Release         │
│  • Current Opening       │
│  • Awards & Recognition  │
└──────────────────────────┘

┌──────────────────────────┐
│  DOWNLOADS               │
│  ──────────              │
│  • Policies & Practices  │
│  • Trustee Details       │
│  • RBI Compliance        │
│  • Other Disclosures     │
└──────────────────────────┘

┌──────────────────────────┐
│ [Decorative Pattern]     │
└──────────────────────────┘

┌──────────────────────────┐
│ © 2021. Western Capital  │
│ Advisors Private Limited │
└──────────────────────────┘
```

## Desktop View (Two Column)

```
┌──────────────────────────────────────────────────────────────┐
│  [LOGO]                                                      │
│  [Vertical Divider Line]                                     │
│                                                              │
│  NEWSROOM & CAREER    │    DOWNLOADS                        │
│  ──────────────────   │    ──────────                       │
│  • Media Release      │    • Policies & Practices           │
│  • Current Opening    │    • Trustee Details                │
│  • Awards & Recog.    │    • RBI Compliance & Disclosure    │
│                       │    • Other Disclosures              │
│                                                              │
│        [Decorative Footer Pattern Image - Full Width]       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  [COPYRIGHT ICON]  © 2021. Western Capital Advisors Pvt Ltd  │
└──────────────────────────────────────────────────────────────┘
```

## Color Scheme

| Element | Color | Hex Code | Purpose |
|---------|-------|----------|---------|
| Background | Dark Blue | #02478c | Professional, matches theme |
| Text | White | #ffffff | High contrast, readable |
| Links | White | #ffffff | Consistent with text |
| Link Hover | Sky Blue | #87CEEB | Interactive feedback |
| Borders | Light Gray | #cccccc | Subtle separation |

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Section Titles | System Font | 1.3rem | 700 (Bold) |
| Links | System Font | 0.9rem | 400 (Normal) |
| Copyright | System Font | 0.85rem | 400 (Normal) |

## Interactive Elements

### Link States

```
DEFAULT STATE
┌─────────────────────┐
│  Media Release      │  (White text, no underline)
└─────────────────────┘

HOVER STATE
┌─────────────────────┐
│  Media Release      │  (Sky blue #87CEEB, underline)
└─────────────────────┘
```

### Responsive Breakpoints

**Desktop (≥992px)**
- Two-column layout
- Full-width footer pattern
- Side-by-side sections

**Tablet (768px - 991px)**
- Two columns with adjusted spacing
- Footer pattern scales

**Mobile (<768px)**
- Single column layout
- Full-width content
- Stacked sections
- Centered text alignment

## Space & Layout

```
TOP PADDING:    2rem
BOTTOM PADDING: 2rem
SIDE PADDING:   2rem (responsive)

SECTION SPACING: 1rem between columns
ITEM SPACING:    0.75rem between links
```

## Hover Effects

```
LINK HOVER ANIMATION:
├─ Color: White → Sky Blue (#87CEEB)
├─ Decoration: None → Underline
├─ Duration: 0.3s
└─ Easing: ease function

BUTTON HOVER (if applicable):
├─ Background: Darken by 10-15%
├─ Transform: Lift slightly (translateY)
└─ Shadow: Add subtle box-shadow
```

## Example Footer Code Structure

```html
<footer class="position-relative">        ← Main footer container
  <div class="container">                 ← Bootstrap container
    
    <!-- Header with Logo -->
    <div class="footer-brand">            ← Logo section
      <a href="/"><img ... src="/img/LOGO1.png"></a>
    </div>
    <div class="vertical-line"></div>    ← Visual divider
    
    <!-- Two Column Content -->
    <div class="row">                     ← Bootstrap row
      
      <div class="col-12 col-md-6 col-left footer-section">
        <h4 class="footer-section-title">Newsroom and Career</h4>
        <ul class="footer-links">
          <li><a href="...">Media Release</a></li>
          ...
        </ul>
      </div>
      
      <div class="col-12 col-md-6 col-right footer-section">
        <h4 class="footer-section-title">Downloads</h4>
        <ul class="footer-links">
          <li><a href="...">Policies & Practices</a></li>
          ...
        </ul>
      </div>
      
    </div>
    
    <!-- Decorative Pattern -->
    <img src="/img/footer_pattern.png" class="footer-pattern" alt="">
    
  </div>
  
  <!-- Copyright Section -->
  <div class="copyright-footer">
    <div class="container">
      <img src="/img/copyright.png" alt="">
      <div class="d-inline-block">2021. Western Capital Advisors Private Limited</div>
    </div>
  </div>
  
</footer>
```

## CSS Classes Hierarchy

```
footer (position-relative)
├── .container
│   ├── .footer-brand
│   │   └── a href="/"
│   │       └── img (LOGO1.png)
│   ├── .vertical-line
│   ├── .row
│   │   ├── .col-12 .col-md-6 .col-left .footer-section
│   │   │   ├── h4.footer-section-title
│   │   │   └── ul.footer-links
│   │   │       └── li
│   │   │           └── a
│   │   └── .col-12 .col-md-6 .col-right .footer-section
│   │       ├── h4.footer-section-title
│   │       └── ul.footer-links
│   │           └── li
│   │               └── a
│   └── img.footer-pattern
└── .copyright-footer
    └── .container
        ├── img (copyright.png)
        └── div.d-inline-block
```

## Accessibility Features

✅ **Semantic HTML**
- Uses `<footer>` tag
- Proper heading hierarchy (`<h4>` for section titles)
- List structure (`<ul>` and `<li>`)

✅ **Color Contrast**
- White text on dark blue: Passes WCAG AA
- Link colors have sufficient contrast

✅ **Interactive Elements**
- Links are keyboard navigable
- Focus states should be visible
- Hover states indicate interactivity

✅ **Responsive Design**
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly link sizes

## Performance Considerations

- **HTML Size:** ~3KB per page
- **CSS Size:** <1KB (footer-specific)
- **Image Size:** 
  - Logo: ~50KB (shared across pages)
  - Pattern: ~100KB (shared across pages)
  - Copyright: ~5KB (shared across pages)
- **Load Impact:** Minimal (mostly cached assets)

## Browser Compatibility

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Visual Checklist

When implementing or updating the footer, verify:

- [ ] Logo displays correctly
- [ ] Logo links to homepage
- [ ] Two sections visible: "Newsroom and Career" and "Downloads"
- [ ] All links are present and working
- [ ] Footer pattern image displays
- [ ] Copyright text is visible
- [ ] Mobile view shows single column
- [ ] Desktop view shows two columns
- [ ] Links change color on hover
- [ ] Text is readable (good contrast)
- [ ] Footer appears at bottom of all pages
- [ ] No horizontal scrolling on mobile

---

**Design Specification:** October 31, 2025  
**Version:** 1.0  
**Status:** ✅ Active on Production
