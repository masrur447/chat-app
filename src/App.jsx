import { RouterProvider } from "react-router-dom"
import router from "./router/Index"
import Toastify from "./components/Toastify"


function App() {

  return (
    <>
      <Toastify />
      <RouterProvider router={router} />
    </>
  )
}

export default App
