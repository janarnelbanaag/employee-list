import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import RootLayout from './layouts/RootLayout'
import './App.css'

function App() {
    return (
        <Routes>
            <Route element={<RootLayout />}>
                <Route
                    index
                    element={<Home />}
                />
            </Route>
        </Routes>
    )
}

export default App
