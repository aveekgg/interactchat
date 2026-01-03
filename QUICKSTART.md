# Quick Start Guide 🚀

## Your App is Ready!

The ShoeStore Chat Assistant is now running at: **http://localhost:3000**

## How to Use

### 1. Text Input
- Type your question in the text box at the bottom
- Press Enter or click the send button
- Example: "Show me running shoes"

### 2. Voice Input
- Click the **microphone button** 🎤
- Wait for it to turn red (listening)
- Speak your question clearly
- Example: Say "What's on sale?"

### 3. Quick Replies
- Tap any suggested button to ask that question
- New suggestions appear after each response

### 4. Browse Products
- Swipe left/right on product carousels
- **Click any product card** to view full details
- See size, color, and complete information

### 5. Product Details (NEW! ✨)
- **Click on any product** to open detail view
- Select size and color options
- Click **"Ask about this shoe"** to chat about it
- Click **"Find similar shoes"** for recommendations
- Click outside or X to close

## Sample Questions to Try

### Basic Queries
```
"Hello"
"Show me running shoes"
"What's on sale?"
"Show all brands"
```

### Advanced Queries
```
"Nike shoes under $100"
"Show me Adidas running shoes"
"What's the best rated shoe?"
"Black casual shoes"
"Shoes in size 10"
```

### Voice Commands
```
🎤 "Show me running shoes"
🎤 "What discounts do you have?"
🎤 "I need size 10 Nike shoes"
```

## Features to Notice

✅ **Voice Input & Output** - Speak and hear responses
✅ **Product Carousels** - Swipeable product cards with images
✅ **Product Details** - Click any product to see full information (NEW!)
✅ **Quick Replies** - Fast navigation with suggested buttons
✅ **Mobile Optimized** - Works great on phone browsers
✅ **Rich Responses** - Mix of text, images, and interactive elements
✅ **Chat Integration** - Ask questions from product detail view

## Customization Points

### Change Voice Speed
Edit `src/components/ChatInterface.tsx` line 12-16:
```typescript
const ttsService = VoiceServiceFactory.createTTSService('webspeech', {
  rate: 1.2,  // Make speech faster
  pitch: 1.0,
  volume: 1.0
});
```

### Add More Products
Edit `src/data/products.ts` and add to the array

### Modify Response Logic
Edit `src/services/chatService.ts` to change how queries are processed

### Switch Voice APIs
The voice service uses an abstraction layer - see `src/services/voiceService.ts`
```typescript
// Current: Web Speech API (built-in)
// Future options: Azure, Google Cloud, Amazon Polly
```

## Browser Recommendations

**Best Experience:**
- 🟢 Chrome (Desktop & Mobile)
- 🟢 Edge (Desktop & Mobile)
- 🟡 Safari (iOS 15+)

**Voice Features:**
- Microphone permission required
- HTTPS needed in production
- Chrome/Edge recommended

## Testing Checklist

- [ ] Type a text query and see response
- [ ] Click microphone and speak a query
- [ ] Tap a quick reply button
- [ ] Swipe through product carousel
- [ ] **Click on a product card to see details** (NEW!)
- [ ] **Select size and color in product detail** (NEW!)
- [ ] **Use "Ask about this shoe" button** (NEW!)
- [ ] Try "What's on sale?"
- [ ] Try "Show me Nike shoes"
- [ ] Try "Running shoes under $100"
- [ ] Test on mobile device (use ngrok or deploy)

## Common Issues

**Voice not working?**
- Check microphone permissions
- Use Chrome or Edge
- Must be HTTPS in production

**No sound?**
- Check browser volume
- Check system volume
- Some browsers need user interaction first

## Next Steps

1. **Test the app** - Try the sample questions
2. **Customize products** - Add your own shoe data
3. **Modify responses** - Change chatbot behavior
4. **Deploy** - Use Vercel, Netlify, or any static host

## File Structure

```
src/
├── components/         # UI components
├── services/          # Business logic
│   ├── voiceService.ts   ← Voice API abstraction
│   └── chatService.ts    ← Message processing
├── data/              # Mock product data
└── types.ts           # TypeScript types
```

## Resources

- **Full Documentation**: README.md
- **Test Questions**: TEST_QUESTIONS.md
- **Mock Data**: src/data/products.ts

---

**Need Help?** Check README.md for detailed documentation.

**Happy Testing! 🎉**
