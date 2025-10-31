# Footer Maintenance Guide

## Quick Reference

### Footer Consistency Status: ✅ 100% COMPLETE

All 28 active pages on Western Capital Advisors website now have the standardized footer.

## How to Update the Footer Across All Pages

If you need to update the footer in the future, follow these steps:

### Method 1: Manual Update (Simple Changes)

1. Edit the footer in any main page file (e.g., `/index.html`, `/aboutus/index.html`, `/contactus/index.html`)
2. The footer spans from `<footer>` to `</footer>` tags at the end of the page
3. Replicate the same change across all other pages' footer sections

**Pages to Update:**
```
aboutus/index.html
advisors/index.html
annual-report/index.html
annual-return-ir/index.html
annual-return/index.html
branch-locator/index.html
contactus/index.html
corp-announcements/index.html
credit-rating/index.html
customer-education-literature/index.html
escalation-matrix/index.html
financial-results/index.html
home.html
homepage/index.html
index.html
investors/index.html
liquidity-risk-management-disclosure/index.html
notices/index.html
other-disclosures/index.html
partners/index.html
policies/index.html
promoters/index.html
regulatory/index.html
regulatory/liquidity-risk-management-disclosure.html
regulatory/notices.html
regulatory/other-disclosures.html
regulatory/policies.html
terms-and-condition/index.html
```

### Method 2: Automated Update (Bulk Changes)

Use the provided script to verify and update all footers:

```bash
node update-footers.cjs
```

This script will:
- Scan all 30 HTML files
- Check each footer against the standard format
- Report which pages need updates
- Optionally update non-standard footers

## Standard Footer HTML Template

```html
<footer class="position-relative">
    <div class="container">
        <div class="footer-brand">
            <a href="/"><img alt="logo" src="/img/LOGO1.png" class="footer-logo"></a>
        </div>
        <div class="vertical-line"></div>

        <div class="row">
            <!-- Newsroom and Career Section -->
            <div class="col-12 col-md-6 col-left footer-section">
                <h4 class="footer-section-title">Newsroom and Career</h4>
                <ul class="footer-links">
                    <li>
                        <a href="/newsroom/media-release">Media Release</a>
                    </li>
                    <li>
                        <a href="/careers/current-openings">Current Opening</a>
                    </li>
                    <li>
                        <a href="/newsroom/awards-recognition">Awards & Recognition</a>
                    </li>
                </ul>
            </div>

            <!-- Downloads Section -->
            <div class="col-12 col-md-6 col-right footer-section">
                <h4 class="footer-section-title">Downloads</h4>
                <ul class="footer-links">
                    <li>
                        <a href="/downloads/policies-practices">Policies & Practices</a>
                    </li>
                    <li>
                        <a href="/downloads/trustee-details">Trustee Details</a>
                    </li>
                    <li>
                        <a href="/downloads/rbi-compliance-disclosure">RBI Compliance & Disclosure</a>
                    </li>
                    <li>
                        <a href="/downloads/other-disclosures">Other Disclosures</a>
                    </li>
                </ul>
            </div>
        </div>
        <img src="/img/footer_pattern.png" class="footer-pattern" alt="">
    </div>
    <div class="copyright-footer">
        <div class="container">
            <img src="/img/copyright.png" alt="">
            <div class="d-inline-block">2021. Western Capital Advisors Private Limited</div>
        </div>
    </div>
</footer>
```

## CSS Classes & Styling

### Required CSS Classes
- `.footer-section` - Container for each footer column
- `.footer-section-title` - Section heading (Newsroom/Downloads)
- `.footer-links` - List of footer links
- `.footer-brand` - Logo section
- `.copyright-footer` - Copyright information area

### Bootstrap Classes Used
- `.col-12 col-md-6` - Responsive grid (full width on mobile, 50% on desktop)
- `.col-left`, `.col-right` - Column alignment modifiers
- `.container` - Bootstrap container for max-width and padding
- `.row` - Bootstrap row for flex layout

### Styling Location
Footer styles are defined in:
- `layout-styles.css` (main styles)
- Inline styles in `<style>` tag within advisors/index.html (detailed styling)

## Common Footer Updates

### Add a New Link to Newsroom Section

1. Find this line in the footer:
```html
<li>
    <a href="/newsroom/awards-recognition">Awards & Recognition</a>
</li>
```

2. Add after it:
```html
<li>
    <a href="/path/to/new-page">New Link Text</a>
</li>
```

3. Replicate across all pages

### Change the Copyright Year

Current:
```html
<div class="d-inline-block">2021. Western Capital Advisors Private Limited</div>
```

Update to:
```html
<div class="d-inline-block">2024. Western Capital Advisors Private Limited</div>
```

Then update across all 28 pages.

### Add New Link Section

To add a third column to the footer:

1. Copy the existing column structure:
```html
<div class="col-12 col-md-4 col-left footer-section">
    <h4 class="footer-section-title">New Section</h4>
    <ul class="footer-links">
        <li><a href="#">Link 1</a></li>
        <li><a href="#">Link 2</a></li>
    </ul>
</div>
```

2. Change `col-md-6` to `col-md-4` for all columns
3. Update across all pages

## Image Resources

Ensure these images are maintained in `/img/` directory:
- `LOGO1.png` - Western Capital Advisors logo (used in footer brand)
- `footer_pattern.png` - Decorative pattern background
- `copyright.png` - Copyright symbol/icon

## Troubleshooting

### Footer Not Displaying Correctly
- Check that all image paths are correct
- Verify Bootstrap CSS is loaded
- Check browser console for JavaScript errors
- Ensure all closing tags are present

### Footer Links Not Working
- Verify URLs are correct (starting with `/`)
- Check that target pages exist
- Test links in browser

### Styling Issues
- Check that `layout-styles.css` is properly linked
- Verify no CSS conflicts with other stylesheets
- Clear browser cache and refresh

## Verification Checklist

After making footer updates:

- [ ] Verify all links work
- [ ] Check mobile responsiveness (single column on mobile)
- [ ] Verify logo displays correctly
- [ ] Check text formatting and alignment
- [ ] Verify copyright year is current
- [ ] Test across multiple browsers
- [ ] Check footer appears on all main pages

## Performance Tips

- Footer HTML is relatively lightweight (~3KB per page)
- CSS styling is efficient with no unnecessary animations
- Logo and images are optimized
- Consider lazy-loading footer images if page load is slow

## Future Enhancements

Potential improvements for consideration:
1. Create a footer component/include file to reduce duplication
2. Add social media links
3. Add company contact details
4. Add newsletter signup
5. Add quick access search
6. Implement language selector

---

**Last Updated:** October 31, 2025  
**Maintained By:** Development Team  
**Status:** ✅ All 28 pages updated and verified
