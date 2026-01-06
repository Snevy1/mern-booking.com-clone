import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppContextProvider } from './contexts/Appcontext.tsx'
import { SearchContextProvider } from './contexts/searchContext.tsx'

const queryClient = new QueryClient({
  defaultOptions:{
    queries: {
      retry:0
    }
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <SearchContextProvider>
          <App />
        </SearchContextProvider>
      

      </AppContextProvider>


    </QueryClientProvider>
    
  </StrictMode>,
)
