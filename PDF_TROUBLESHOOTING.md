# PDF Generation Troubleshooting Guide

## Common Issues & Solutions

### ❌ Error: "Attempting to parse an unsupported color function 'lab'"

**Cause**: html2canvas doesn't support modern CSS color functions like `lab()`, `lch()`, `oklch()` which are used in Tailwind CSS v4.

**Solution**: ✅ Already fixed! The code now:
1. Uses explicit hex colors in the PDF template
2. Isolates the PDF container from page CSS
3. Strips CSS variables during rendering

**How it was fixed**:
```typescript
// Container isolation
container.style.color = '#000000'
container.style.isolation = 'isolate'

// html2canvas configuration
onclone: (clonedDoc) => {
  // Remove CSS variables and ensure hex colors
  clonedElements.forEach((el) => {
    el.style.setProperty('color', el.style.color || '#000000')
  })
}
```

---

### ❌ PDF is Blank or Empty

**Possible Causes**:
1. Required fields not filled
2. Browser blocking PDF generation
3. JavaScript errors

**Solutions**:
```typescript
// Check browser console for errors
console.log("PDF generation started")

// Verify form data
console.log(formData)

// Ensure validation passes
if (!formData.clientName || !formData.clientEmail) {
  alert("Fill required fields")
  return
}
```

---

### ❌ PDF Quality is Poor

**Solution**: Increase the scale in html2canvas

```typescript
const canvas = await html2canvas(container, {
  scale: 3, // Higher = better quality (default is 2)
  ...
})
```

**Trade-offs**:
- Scale 1: Fast, lower quality (~50KB)
- Scale 2: Balanced (default) (~100KB)
- Scale 3: High quality, slower (~200KB)
- Scale 4+: Very slow, large files

---

### ❌ Download Doesn't Start

**Possible Causes**:
1. Pop-up blocker
2. Browser security settings
3. File system permissions

**Solutions**:

1. **Check pop-up blocker**:
   - Look for blocked pop-up icon in address bar
   - Allow pop-ups for your domain

2. **Try different approach**:
```typescript
// Alternative download method
const link = document.createElement('a')
link.download = `receipt-${invoiceNumber}.pdf`
link.href = pdf.output('bloburl')
document.body.appendChild(link)
link.click()
document.body.removeChild(link)
```

---

### ❌ PDF File Size Too Large

**Causes**:
- High scale setting
- Large images
- Complex styling

**Solutions**:

1. **Reduce scale**:
```typescript
scale: 1.5  // Instead of 2
```

2. **Compress output**:
```typescript
const pdf = new jsPDF({
  compress: true,  // Enable compression
  ...
})
```

3. **Optimize images**:
- Use smaller logos
- Compress images before adding

---

### ❌ Fonts Not Rendering Correctly

**Cause**: Custom fonts not loaded when PDF generates

**Solution**: Use web-safe fonts or wait for fonts to load

```typescript
// Wait for fonts to load
await document.fonts.ready

// Then generate PDF
const canvas = await html2canvas(container, ...)
```

**Web-safe fonts to use**:
- Arial
- Helvetica
- Times New Roman
- Courier
- Verdana

---

### ❌ PDF Layout Broken in Production (Vercel)

**Cause**: CSS not loading or timing issues

**Solution**: Already handled! The template uses inline styles.

**Verify**:
```typescript
// All styles should be inline
<div style="color: #000000; background: #ffffff;">
  // Not using className or external CSS
</div>
```

---

### ❌ Memory Issues / Browser Crash

**Cause**: Generating too many PDFs or very large PDFs

**Solutions**:

1. **Clean up after generation**:
```typescript
// Already implemented
document.body.removeChild(container)
canvas = null
```

2. **Add delay between generations**:
```typescript
if (isGenerating) {
  alert("Please wait for current PDF to finish")
  return
}
```

3. **Reduce scale or page size**

---

### ❌ Special Characters Not Displaying

**Cause**: Character encoding issues

**Solution**: Use UTF-8 encoding (already set)

```typescript
// In HTML template
<meta charset="utf-8">

// Escape special characters
const escapedText = text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
```

---

### ❌ PDF Colors Look Different

**Cause**: Color space differences (RGB vs CMYK)

**Solution**: jsPDF uses RGB by default (correct for digital)

For print:
```typescript
// Stick to web-safe colors
- #10b981 (Emerald green)
- #111827 (Dark gray)
- #6b7280 (Medium gray)
- #f9fafb (Light gray)
```

---

## Testing Checklist

Before considering it a bug, verify:

- [ ] All required fields filled
- [ ] Browser console has no errors
- [ ] Tried in different browser
- [ ] Pop-up blocker disabled
- [ ] JavaScript enabled
- [ ] Sufficient device memory
- [ ] Internet connection stable (for loading libraries)

---

## Browser Compatibility

### ✅ Fully Supported:
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### ⚠️ Limited Support:
- IE 11 (Not supported)
- Old mobile browsers

### Testing Commands:

```bash
# Test in different browsers
open -a "Google Chrome" http://localhost:3000/admin/receipts
open -a "Firefox" http://localhost:3000/admin/receipts
open -a "Safari" http://localhost:3000/admin/receipts
```

---

## Debug Mode

Enable detailed logging:

```typescript
const canvas = await html2canvas(container, {
  logging: true,  // Enable console logging
  ...
})
```

Check console for:
- Loading status
- Color parsing errors
- Rendering issues
- Canvas size

---

## Performance Optimization

### Slow PDF Generation?

1. **Reduce complexity**:
   - Fewer services on receipt
   - Simpler styling
   - Smaller fonts

2. **Optimize settings**:
```typescript
const canvas = await html2canvas(container, {
  scale: 1.5,              // Lower than default
  windowWidth: 800,        // Fixed width
  windowHeight: 1200,      // Approximate height
  foreignObjectRendering: false,
})
```

3. **Show loading indicator**:
```typescript
setPdfStatus("loading")
// User sees "Generating..." button
```

---

## When to Contact Support

If you've tried everything above and still have issues:

1. **Gather information**:
   - Browser version
   - Error message
   - Steps to reproduce
   - Screenshot/screen recording

2. **Check issues**:
   - [jsPDF Issues](https://github.com/parallax/jsPDF/issues)
   - [html2canvas Issues](https://github.com/niklasvh/html2canvas/issues)

3. **Contact**:
   - Email: info@pirnad.co.uk
   - Include error logs and browser info

---

## Quick Fixes Reference

| Problem | Quick Fix |
|---------|-----------|
| Blank PDF | Check required fields filled |
| Poor quality | Increase `scale: 3` |
| Colors wrong | Use hex colors only |
| Won't download | Check pop-up blocker |
| Too slow | Reduce scale to 1.5 |
| Large file | Enable compression |
| Fonts wrong | Use Arial/Helvetica |
| Layout broken | Use inline styles only |

---

**Last Updated**: December 22, 2025
**Status**: All known issues resolved ✅
