
import './App.css';
import { Personas } from './Personas.js';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { EditPage } from './EditPage.js';
import { Home } from './Home.js';
import LoginForm from './Authentication/Loginform.js';
import SignupForm from './Authentication/SignupForm.js';



function App() {
  
  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/persona" element={<Personas />} />
            <Route path="/editpage/:key?" element={<EditPage />} />
            <Route path="/login" element={<LoginForm /> } />
            <Route path="/register" element={<SignupForm />} />
          </Routes>
      </Router>  
    </>
  );
}

export default App;
