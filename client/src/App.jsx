import {Navbar,Transactions,Welcome,Footer,Loader,Services} from "./components/index"
const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar/>
        <Welcome/>
      </div>
      <Services/>
      <Transactions/>
      <Footer/>
    </div>
  );
};

export default App;
