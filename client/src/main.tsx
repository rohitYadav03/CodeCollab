import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext.tsx'
import { Toaster} from "sonner"

createRoot(document.getElementById('root')!).render(
 <UserProvider>
 <BrowserRouter>
  <App />
  <Toaster position='top-center' richColors />
  </BrowserRouter>
  </UserProvider>
)
