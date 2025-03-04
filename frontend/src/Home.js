import { useNavigate } from 'react-router-dom';

import './Personas.css';
import './Home.css';
import { UserContext } from './Context/UserContext';
import { useContext } from 'react';
import { makeToast } from './Toast/MakeToast';

export const Home=()=>{
    const navigate = useNavigate();

    const { user, setUser} = useContext(UserContext);

    const AfterClickLogout=()=>{
        setUser({email : null});
        makeToast('Logout Successfully', 'info');
    }
    return(
        <div className='HomePage CardListPage'>
            <div className='Header'>
                    <div className='logo'>
                        <p >tringapps</p>
                    </div>
                    <div className='buttons'>      
                        {
                            user.email == null ? 
                            <>
                            <button className='button_color' onClick={()=>navigate('/login')}>Login</button>
                            <button className='button_color' onClick={()=>navigate('/register')}>Register</button>
                            </>
                            :
                            <>
                            <p className='username'>{user.name ? "Username : " + user.name : "No user found"}</p>
                            <button className='button_color' 
                                onClick={()=>AfterClickLogout()}
                                >Logout</button>
                            </>
                        }
                        
                    </div>
            </div>
            
            { user.email &&  <div className='bottom_container'>
                                    <button className='button_color' onClick={()=>navigate('/persona')}>Go to Persona Page </button>
                            </div> }
        </div>
        
    )
}