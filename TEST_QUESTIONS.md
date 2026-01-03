# ShoeStore Chat Assistant - Test Questions

This document contains sample questions you can use to test the chatbot functionality. The chatbot understands natural language and can respond with text, voice, product carousels, and quick reply buttons.

## Greeting & Help

- "Hello"
- "Hi there"
- "Hey"
- "Help me"
- "What can you do?"

## Category Queries

### Running Shoes
- "Show me running shoes"
- "I need running shoes"
- "What running shoes do you have?"
- "Show running shoes"

### Casual Shoes
- "Show me casual shoes"
- "I'm looking for casual sneakers"
- "What casual shoes are available?"

### Basketball Shoes
- "Do you have basketball shoes?"
- "Show basketball sneakers"

### Training Shoes
- "I need training shoes"
- "Show me workout shoes"

### Trail Running
- "Do you have trail running shoes?"
- "Show trail shoes"

## Brand Queries

- "Show me Nike shoes"
- "Do you have Adidas?"
- "I want New Balance shoes"
- "Show Reebok products"
- "Do you carry Converse?"
- "Show me Asics running shoes"
- "What Salomon shoes do you have?"
- "Show On Running shoes"
- "What brands do you have?"
- "Show all brands"

## Price Range Queries

- "Shoes under $100"
- "Show me shoes less than $80"
- "Cheap running shoes"
- "Shoes under $150"
- "What's the cheapest option?"
- "Show shoes between $100 and $150"
- "Affordable casual shoes"

## Sales & Discounts

- "What's on sale?"
- "Show me discounted shoes"
- "Do you have any deals?"
- "Show sale items"
- "Running shoes on sale"

## Product Features & Ratings

- "Show me the best rated shoes"
- "What are your top rated products?"
- "Show me shoes with good reviews"
- "What's the highest rated running shoe?"

## Size Queries

- "Do you have size 10?"
- "Show me shoes in size 9"
- "What sizes are available?"
- "Size 11 running shoes"

## Color Queries

- "Show me black shoes"
- "Do you have white sneakers?"
- "I want blue running shoes"
- "Show red shoes"
- "What colors are available?"

## Stock Availability

- "What's in stock?"
- "Show available shoes"
- "Do you have the Air Max 270 in stock?"

## General Browsing

- "Show me everything"
- "Browse all shoes"
- "Show all products"
- "What do you have?"

## Complex Queries (Combining Multiple Criteria)

- "Show me Nike running shoes under $100"
- "Black Adidas shoes on sale"
- "Running shoes in size 10"
- "Best rated shoes under $150"
- "Casual shoes in white"

## Conversational Follow-ups

After getting results, you can ask:
- "Tell me more about the first one"
- "Show me the cheapest"
- "What's the best rated?"
- "Any on sale?"
- "Show other brands"
- "Filter by price"
- "Show other colors"

## Voice Testing Tips

1. **Speak clearly** - The Web Speech API works best with clear pronunciation
2. **Use natural language** - The chatbot understands conversational queries
3. **Wait for the beep** - Make sure the mic icon shows it's listening before speaking
4. **Test in a quiet environment** - Background noise can affect recognition accuracy
5. **Chrome works best** - The Web Speech API has the best support in Chrome/Edge

## Expected Response Types

### Text Only (with voice)
- Greetings, help queries, brand lists

### Text + Quick Replies
- Category questions, follow-up prompts

### Text + Product Carousel
- Category searches, brand queries, price ranges

### Text + Product Carousel + Quick Replies
- Most product-related queries combine all three

## Browser Compatibility Notes

- **Voice Input**: Works best in Chrome, Edge, and Safari (iOS)
- **Text-to-Speech**: Supported in all modern browsers
- **Mobile**: Fully optimized for mobile touch interactions

## Troubleshooting

If voice input doesn't work:
1. Check browser permissions for microphone access
2. Try using HTTPS (required for some browsers)
3. Use Chrome or Edge for best compatibility
4. Check that your microphone is working in other apps

If text-to-speech doesn't work:
1. Check browser volume settings
2. Try a different browser
3. Some browsers require user interaction before playing audio
