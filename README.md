# ShoeStore Chat Assistant 👟

A mobile-first web chat application for a shoe store product catalogue with voice input/output capabilities, rich UI components, and intelligent response formatting.

## Features

### 🤖 AI Sales Agent (NEW!)
- **Gemini API Integration**: Powered by Google's Gemini AI for intelligent conversations
- **Conversation Context**: AI remembers your entire chat history for personalized, contextual responses
- **Natural Language Understanding**: Ask questions naturally, get contextual responses
- **Product Expert**: AI has complete knowledge of your entire shoe catalogue
- **Smart Recommendations**: Personalized suggestions based on your needs and conversation history
- **Memory Retention**: No lost context - AI follows up on previous discussions
- **Hybrid Mode**: Falls back to pattern matching if AI is unavailable
- **Easy Configuration**: Set up your API key through the settings UI

### 🎤 Voice Interaction
- **Voice Input**: Click the microphone button to speak your questions
- **Voice Output**: Get spoken responses for a hands-free experience
- **Configurable Voice APIs**: Easy-to-iterate architecture for switching voice providers

### 💬 Rich Chat Interface
- **Text Messages**: Clean, mobile-optimized chat bubbles
- **Product Carousels**: Swipeable product cards with images and details
- **Product Detail View**: Click any product to see full details in a modal
- **Quick Reply Buttons**: Fast interaction with suggested responses
- **Typing Indicators**: Visual feedback during processing
- **Chat Integration**: Ask questions about products directly from detail view
- **Settings Panel**: Configure AI mode and API keys through intuitive UI

### 🛍️ Smart Product Search
- Search by category (running, casual, basketball, training, trail)
- Filter by brand (Nike, Adidas, New Balance, Reebok, Converse, etc.)
- Price range filtering
- Sale and discount queries
- Size and color availability
- Rating-based recommendations
- Natural language queries with AI

### 📱 Mobile-First Design
- Responsive layout optimized for mobile devices
- Touch-friendly buttons and interactions
- Smooth scrolling and animations
- iOS and Android compatible

## 🧠 Conversation Context & Memory

Your AI assistant now has **full conversation memory**! The AI remembers your entire chat history and provides personalized, context-aware responses.

### How It Works
- **Complete Context**: Every message is tracked throughout the session
- **Smart Summarization**: Recent conversation history is summarized for AI prompts
- **Personalized Responses**: AI remembers your preferences and follows up appropriately
- **Natural Flow**: No repeating yourself - the AI understands the full conversation

### Example Experience
```
You: "Show me running shoes"
AI: "I have three great running shoes! What distance are you training for?"

You: "5K training"
AI: "Perfect! The UltraBoost 22 is excellent for 5K. What's your budget?"

You: "Under $150"
AI: "The UltraBoost 22 fits your 5K training needs and $150 budget perfectly!"
```

**Without context**: AI would forget you mentioned 5K training and ask again.

### Benefits
- ✅ **Personalized recommendations** based on your conversation
- ✅ **Follow-up questions** that reference previous messages
- ✅ **Preference memory** (budget, sport, brand preferences)
- ✅ **Natural conversation flow** without repetition
- ✅ **Professional experience** like chatting with a real sales assistant

## Getting Started

### Quick Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure Gemini API (Optional but Recommended)**:
   - Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Option A: Add to `.env` file:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```
   - Option B: Configure through Settings UI after starting the app

3. **Start the development server**:
```bash
npm run dev
```

4. **Open in browser**:
The app will open automatically at `http://localhost:3000`

5. **Enable AI Mode** (if not using .env):
   - Click the ⚙️ settings icon in the chat header
   - Paste your Gemini API key
   - Click "Save & Test Connection"
   - AI mode activates automatically!

> **Note**: The app works without AI using pattern matching, but AI mode provides much better conversations!

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatInterface.tsx       # Main chat interface
│   ├── MessageBubble.tsx       # Message display component
│   ├── VoiceInput.tsx          # Voice input button
│   ├── QuickReplies.tsx        # Quick reply buttons
│   ├── ProductCarousel.tsx     # Product carousel container
│   ├── ProductCard.tsx         # Individual product card
│   ├── ProductDetail.tsx       # Product detail modal
│   ├── Settings.tsx            # Settings panel for AI config (NEW!)
│   └── *.css                   # Component styles
├── services/            # Business logic
│   ├── voiceService.ts         # Voice API abstraction
│   ├── chatService.ts          # Message processing (hybrid AI/pattern)
│   └── geminiService.ts        # Gemini AI integration (NEW!)
├── data/                # Mock data
│   └── products.ts             # Product catalogue
├── types.ts            # TypeScript type definitions
├── App.tsx             # Root component
└── main.tsx            # Application entry point
```

## Voice Service Architecture

The voice service uses an **abstraction layer** that makes it easy to swap voice providers:

```typescript
// Current implementation uses Web Speech API
const voiceService = VoiceServiceFactory.createRecognitionService('webspeech');

// Future: Easily switch to other providers
// const voiceService = VoiceServiceFactory.createRecognitionService('azure');
// const voiceService = VoiceServiceFactory.createRecognitionService('google');
```

### Adding a New Voice Provider

1. Implement the `IVoiceRecognitionService` interface
2. Add the new provider to `VoiceServiceFactory`
3. Update the configuration to use the new provider

Example:
```typescript
export class AzureSpeechRecognition implements IVoiceRecognitionService {
  // Implement interface methods
}

// In factory:
case 'azure':
  return new AzureSpeechRecognition(config);
```

## Message Processing Logic

The chat service now uses a **hybrid approach**:

### AI Mode (Recommended)
- Uses Google Gemini API for natural language understanding
- Complete product catalogue context provided to AI
- Intelligent, conversational responses
- Personalized recommendations
- Context-aware follow-up questions

### Pattern Matching (Fallback)
- Rule-based pattern matching
- Fast, predictable responses
- Works offline/without API key
- Automatically used if AI fails

**Patterns include:**
- **Greetings** → Welcome message + quick replies
- **Category queries** → Product carousel + filters
- **Brand queries** → Brand-specific products
- **Price queries** → Filtered products by price
- **Sale queries** → Discounted products
- **Feature queries** → Best-rated or specific features

See [GEMINI_INTEGRATION.md](./GEMINI_INTEGRATION.md) for complete AI documentation.

## Mock Data

The app includes 12 pre-populated shoe products with:
- Various brands (Nike, Adidas, New Balance, etc.)
- Different categories (running, casual, basketball, etc.)
- Multiple sizes and colors
- Realistic pricing and discounts
- High-quality placeholder images from Unsplash
- Product ratings and features

## Testing

See [TEST_QUESTIONS.md](./TEST_QUESTIONS.md) for a comprehensive list of test queries.

### Quick Test Examples

**AI Mode (with Gemini API):**
- "I'm training for a 5K, what do you recommend?"
- "What's the difference between the Nike and Adidas shoes?"
- "Show me comfortable shoes under $100 in blue"
- "Tell me more about the Air Max 270"
- "What's popular right now?"

**Pattern Matching (without API key):**
- "Show me running shoes"
- "What's on sale?"
- "Nike shoes under $100"

**Voice Input:**
1. Click the microphone button
2. Say: "Show me Adidas shoes"
3. Wait for the response

**Product Details:**
1. Click on any product card
2. View full details, sizes, and colors
3. Click "Ask about this shoe" to chat about it

**Settings:**
1. Click the ⚙️ settings icon
2. Configure your Gemini API key
3. Test the connection
4. Toggle AI mode on/off

## Browser Compatibility

### Voice Input
- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)
- ✅ Safari (iOS) - Best on iOS 15+
- ⚠️ Firefox - Limited support

### Text-to-Speech
- ✅ All modern browsers

### Recommended
- **Chrome** or **Edge** for best experience
- **HTTPS** required for voice features in production

## Customization

### Changing Voice Settings

Edit `src/components/ChatInterface.tsx`:

```typescript
const ttsService = VoiceServiceFactory.createTTSService('webspeech', {
  rate: 1.0,    // Speech speed (0.1 to 10)
  pitch: 1.0,   // Voice pitch (0 to 2)
  volume: 1.0   // Volume (0 to 1)
});
```

### Adding New Products

Edit `src/data/products.ts` and add to the `products` array:

```typescript
{
  id: '13',
  name: 'Your Shoe Name',
  brand: 'Brand Name',
  category: 'running',
  price: 120,
  // ... other fields
}
```

### Customizing Response Logic

Edit `src/services/chatService.ts` to add new query patterns and responses.

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Google Generative AI** - Gemini API for intelligent conversations
- **Web Speech API** - Voice input/output
- **CSS3** - Styling and animations

## Performance

- Lightweight bundle size
- Lazy loading of images
- Smooth 60fps animations
- Optimized for mobile networks

## Future Enhancements

- [ ] Conversation history and context memory
- [ ] Multi-language support (AI + Voice)
- [ ] Shopping cart functionality
- [ ] Product image galleries
- [ ] User authentication
- [ ] Order history
- [ ] Streaming AI responses
- [ ] Voice personality customization
- [ ] Product favorites and wishlist
- [ ] Real backend integration
- [ ] Alternative AI providers (OpenAI, Claude)
- [ ] Advanced voice providers (Azure, Google Cloud)
- [ ] Analytics and A/B testing

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning and development.

---

Built with ❤️ using React, TypeScript, Gemini AI, and Web Speech API

## Documentation

- **[GEMINI_INTEGRATION.md](./GEMINI_INTEGRATION.md)** - Complete AI integration guide
- **[TEST_QUESTIONS.md](./TEST_QUESTIONS.md)** - Comprehensive test queries
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick setup guide
- **[.env.example](./.env.example)** - Environment variable template
