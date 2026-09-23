
import './App.css'
import './index.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import HomePage from './components/HomePage'
import VideoPage from './components/VideoPage'
import ErrorBoundary from './ErrorBoundary'

function App() {
const router = createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/room/:id",
    element:<VideoPage/>
  }
])

  return (
    <div className='App'>
      <ErrorBoundary>
        <RouterProvider router={router}/>
      </ErrorBoundary>
    </div>
  )
}

export default App
