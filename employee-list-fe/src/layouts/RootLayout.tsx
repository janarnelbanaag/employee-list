import { Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <div className="min-h-screen min-w-screen bg-slate-900 text-white">
        <Outlet />
    </div>
  )
}

export default RootLayout