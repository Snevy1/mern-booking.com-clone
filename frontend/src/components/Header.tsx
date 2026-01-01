
import { Link } from "react-router-dom"
import { useAppContext } from "../contexts/Appcontext"
import SignOutButton from "./SignOutButton"

const  Header = () => {
  const {isLoggedIn} = useAppContext()
  return (
    <div className="bg-[#74B9CB] py-6">
        <div className="container mx-auto  flex  justify-between">
<span
  className="text-5xl font-bold tracking-tight"
  style={{
    fontFamily: "'Allura', cursive", 
    color: "#fff",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
    display: "inline-block"
  }}
>
  <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
    Avaly.com
  </Link>
</span>

            <span className="flex space-x-2 ">
              {isLoggedIn ? <>
              <Link className="flex items-center text-white px-3 font-bold font-quicksand hover:bg-blue-600" to="/my-bookings">My Bookings</Link>
              <Link className="flex items-center text-white px-3 font-bold font-quicksand hover:bg-blue-600"  to="/my-hotels">My Hotels</Link>
              <SignOutButton />
              
              
              </>:<Link to="/sign-in" className="flex items-center text-blue-600 font-quicksand px-3 font-bold hover: bg-gray-100">Sign In</Link>}
                
            </span>

        </div>

    </div>
  )
}

export default Header