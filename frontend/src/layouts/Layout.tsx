import Footer from "../components/Footer"
import Header from "../components/Header"
import Hero from "../components/Hero"
import SearchBar from "../components/SearchBar"

interface Props{
    children: React.ReactNode
}

const Layout = ({children}: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <Hero />
        {/* Added px-4 for mobile gutters */}
        <div className="container mx-auto px-4 md:px-0">
          <SearchBar />
        </div>
        
        {/* Added px-4 here as well */}
        <div className="container mx-auto py-10 px-4 md:px-0 flex-1">
            {children}
        </div>
        <Footer />
    </div>
  )
}

export default Layout;


// Original
/* const Layout = ({children}: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <Hero />
        <div className="container mx-auto">
          <SearchBar />

        </div>
        <div className="container mx-auto  py-10 flex-1">
            {children}
        </div>
        <Footer />
    </div>
  )
}

export default Layout */