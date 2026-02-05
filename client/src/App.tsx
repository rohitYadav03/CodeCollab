import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage.tsx"
import Roompage from "./components/Roompage.tsx"

function App() {

  return (
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/room/:id" element={<Roompage /> } />
    </Routes>
  )
}

export default App
