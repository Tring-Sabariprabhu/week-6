

import { Personas } from './Pages/Persona/Personas.js'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { EditPage } from './Pages/EditPage/EditPage.js';
import { Home } from './Pages/Home/Home.js';
import LoginForm from './Authentication/Loginform.js';
import SignupForm from './Authentication/SignupForm.js';

function App() {
  
  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/persona" element={<Personas />} />
            <Route path="/editpage" element={<EditPage />} />
            <Route path="/login" element={<LoginForm /> } />
            <Route path="/register" element={<SignupForm />} />
          </Routes>
      </Router>  
    </>
  );
}

export default App;
