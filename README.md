# Flex Living Reviews Dashboard

A comprehensive full-stack application for managing and displaying property reviews from multiple sources including Hostaway and Google Reviews. Built with modern React and Node.js architecture following industry best practices.

## Project Overview

This application provides a complete solution for property management companies to:
- Aggregate reviews from multiple sources (Hostaway API, Google Places API)
- Manage and approve reviews through an admin dashboard
- Display approved reviews on public property pages
- Analyze review trends and performance metrics
- Integrate with Google Reviews for comprehensive coverage

## Architecture

### Technology Stack

**Backend (Node.js/Express)**
- Express.js - Web framework
- TypeScript - Type safety and development experience
- Axios - HTTP client for external API calls
- Winston - Structured logging
- Node-cache - In-memory caching
- Helmet - Security middleware
- CORS - Cross-origin resource sharing
- Express-validator - Request validation

**Frontend (React)**
- React 19 - UI library with latest features
- TypeScript - Type safety
- React Router v7 - Client-side routing
- TanStack Query - Data fetching and caching
- Tailwind CSS v4 - Utility-first styling
- Recharts - Data visualization
- Lucide React - Icon library
- Vite - Build tool and dev server


## Key Features

### Admin Dashboard
- **Review Management**: View, filter, and approve reviews from all sources
- **Analytics**: Comprehensive charts showing review trends, ratings distribution, and performance metrics
- **Property Performance**: Individual property rating breakdowns and comparisons
- **Filtering & Sorting**: Advanced filtering by rating, category, source, and date range
- **Bulk Operations**: Approve/reject multiple reviews at once
- **Export Functionality**: CSV export for data analysis

### Public Property Pages
- **Clean Design**: Professional property showcase with approved reviews
- **Responsive Layout**: Optimized for all device sizes
- **Review Display**: Star ratings, guest names, and detailed comments
- **Property Information**: High-quality images and property details

### Google Reviews Integration
- **Place Search**: Find and import Google Business Profile reviews
- **Automatic Normalization**: Convert Google reviews to internal format
- **Category Detection**: Intelligent categorization of review content
- **API Management**: Secure Google Places API integration

## Best Practices Implemented

### Backend Architecture

**Separation of Concerns**
- Controllers handle HTTP requests/responses
- Services contain business logic
- Models define data structures
- Middleware handles cross-cutting concerns

**Error Handling**
- Centralized error handling middleware
- Structured logging with Winston
- Graceful fallbacks for external API failures
- Proper HTTP status codes

**Security**
- Helmet for security headers
- CORS configuration
- Input validation with express-validator
- Environment variable management

**Performance**
- In-memory caching with node-cache
- Request/response compression
- Efficient data normalization
- Lazy loading of external data

### Frontend Architecture

**Component Organization**
- Feature-based folder structure
- Reusable component library
- Clear separation between pages and components
- Custom hooks for business logic

**State Management**
- TanStack Query for server state
- Zustand for client state
- Local state with React hooks
- Optimistic updates for better UX

**Type Safety**
- Comprehensive TypeScript coverage
- Shared type definitions
- Runtime validation with Zod
- Proper error boundaries

**Performance Optimization**
- Code splitting with React.lazy
- Memoization with useMemo/useCallback
- Efficient re-rendering patterns
- Image optimization

### Data Flow

**API Integration**
- Centralized API client configuration
- Request/response interceptors
- Automatic retry logic
- Error handling and fallbacks

**Data Normalization**
- Consistent data format across sources
- Category extraction from review text
- Rating scale normalization (1-5 to 1-10)
- Source tracking and metadata

**Caching Strategy**
- Server-side caching for external APIs
- Client-side caching with React Query
- Cache invalidation strategies
- Background data refresh

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Google Cloud Console account (for Google Places API)
- Hostaway API credentials (provided in task)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
HOSTAWAY_BASE_URL=https://api.hostaway.com/v1
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
CACHE_TTL=3600000
CORS_ORIGIN=http://localhost:5173
GOOGLE_PLACE_IDS=place_id_1,place_id_2
```

5. Start development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

### Google Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Places API
4. Create API credentials
5. Restrict API key to your domain
6. Add API key to backend `.env` file

## API Endpoints

### Reviews Management
- `GET /api/reviews/hostaway` - Fetch Hostaway reviews
- `GET /api/reviews/all` - Get all reviews (combined sources)
- `GET /api/reviews/stats` - Get review statistics
- `GET /api/reviews/approved` - Get approved reviews for public display
- `PATCH /api/reviews/:id/approval` - Update review approval status


## Google Reviews Integration Findings

### Feasibility Assessment
- **Successfully Integrated**: Google Places API provides access to business reviews
- **API Access**: Requires Google Cloud Console setup and API key
- **Data Quality**: Reviews include rating, text, author, and timestamp
- **Limitations**: Limited to 5 most recent reviews per place
- **Requirements**: Business must have Google Business Profile

### Implementation Details
- **API Endpoint**: Google Places API Details endpoint
- **Authentication**: API key-based authentication
- **Rate Limits**: 1000 requests/day (free tier)
- **Data Normalization**: Automatic conversion from Google format to internal format
- **Category Detection**: AI-powered text analysis for review categorization

### Challenges Encountered
1. **Business Profile Requirement**: Flex Living properties need verified Google Business Profiles
2. **Review Availability**: Not all properties have Google reviews
3. **Data Consistency**: Different rating scales (1-5 vs 1-10) require normalization
4. **API Costs**: Production usage may require paid Google Cloud credits

### Recommendations
- Verify all Flex Living properties have Google Business Profiles
- Implement fallback to other review sources if Google reviews unavailable
- Consider paid Google Cloud plan for production usage
- Regular sync to capture new reviews

### Example Integration
```javascript
// Search for Flex Living properties
const searchQueries = [
  "Flex Living Shoreditch Heights",
  "Flex Living Canary Wharf",
  "Flex Living London apartments"
];


### API Behaviors
- **Search**: `GET /api/reviews/google/search` - Find properties by name
- **Import**: `GET /api/reviews/google/:placeId` - Import reviews for specific property
- **Status**: `GET /api/reviews/google/status` - Check integration health

### Property Management
- `GET /api/reviews/listing/:id` - Get reviews for specific property
- `GET /api/properties/:id` - Get property details

## Testing the Application

### Admin Dashboard
1. Navigate to `http://localhost:5173`
2. Use the dashboard to:
   - View and filter reviews
   - Approve/reject reviews
   - Analyze performance metrics
   - Export data

### Public Property Pages
1. Click on property names in the dashboard
2. Or navigate directly to `/property/:listingId`
3. View approved reviews and property details

### Google Reviews Integration
1. Go to Settings page
2. Search for Google Places
3. Import reviews from Google Business Profiles

## Production Deployment

### Backend Deployment
1. Build the application:
```bash
npm run build
```

2. Set production environment variables
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean)

### Frontend Deployment
1. Build for production:
```bash
npm run build
```

2. Deploy the `dist` folder to a static hosting service (Vercel, Netlify, AWS S3)

### Environment Configuration
- Set `NODE_ENV=production`
- Configure production database
- Set up proper CORS origins
- Configure logging levels
- Set up monitoring and error tracking

## Contributing

### Code Standards
- Follow TypeScript best practices
- Use meaningful variable and function names
- Write comprehensive error handling
- Include proper logging
- Follow the established folder structure

### Development Workflow
1. Create feature branches
2. Write tests for new functionality
3. Ensure all linting passes
4. Test both frontend and backend
5. Submit pull requests with clear descriptions

## Troubleshooting

### Common Issues

**Backend won't start**
- Check if port 5000 is available
- Verify all environment variables are set
- Check for TypeScript compilation errors

**Frontend styles not loading**
- Ensure Tailwind CSS is properly configured
- Check PostCSS configuration
- Verify Vite is running correctly

**Google API errors**
- Verify API key is correct and active
- Check API quotas and billing
- Ensure Places API is enabled

**Hostaway API 403 errors**
- This is expected in sandbox mode
- Application falls back to mock data
- No action required for development

