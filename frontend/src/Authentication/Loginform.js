import { useForm } from "react-hook-form";
import "./LoginForm.css"; // Import the CSS file
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { makeToast } from "../Toast/MakeToast";


function LoginForm() {
    const navigate = useNavigate();
    const {setUserDetails} = useContext(UserContext);  
    
    const Check_User_present = gql`
        query checkEmailExists($email: String!){
          userIsPresent(email: $email)
        }`
    const UserDetails = gql`
      query getUserDetails($email: String!){
        getUser(email: $email){
          email
          name,
          password,
          
        }
      }`
    
    const {
      register,
      handleSubmit,
      formState: { errors },
      
    } = useForm();

  const [checkEmailExists] = useLazyQuery(Check_User_present, {fetchPolicy: "network-only"});
  const [getUser] = useLazyQuery(UserDetails);
  
  
  
  const onSubmit = async (formdata) => {
    formdata.email = formdata.email.toLowerCase();
    const {data: checkData} = await checkEmailExists({variables: {email: formdata?.email}});
    
    if(checkData?.userIsPresent === true )
      {
        const {  data: getUserData } = await getUser({variables: {email: formdata.email}});
        if(formdata?.password === getUserData?.getUser?.password){
          makeToast("Logged In Successfully", 'success');  //store in userContext
          setUserDetails({name: getUserData.getUser.name, email: formdata.email});
          navigate('/persona');
        }
        else{
          makeToast("Invalid Password", 'error')
        }    
        }
        else{
          makeToast("Email not registered Go to Register", 'info');
        }
        
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="login_header">
            <h2>Login</h2>
            <p className="logo">tringapps</p>
          </div>


      <div className="form-group">
        <label>Email:</label>
        <input
          type="text"
          {...register("email", 
            {                             
                validate: {
                    requiredCheck: (value) =>   value?.length > 0 || "Email is required"
                  },
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email should be valid"
                }
              })}
          className={errors.email ? "login_input error-input" : "login_input"}
        />
        {errors.email && <p className="error-message">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {value: 8, message:"Password Should contain at least 8 Characters"}
           
          })}
          className={errors.password ? "login_input error-input" : "login_input"}
        />
        {errors.password && <p className="error-message">{errors.password.message}</p>}
      </div>

      <button type="submit" className="login-button button_color">Login</button>
      <footer>
            <p>Don't have an Account?</p>
            <Link to="/register" className="redirect_tag" >Register</Link>
      </footer>
    </form>
  );
}

export default LoginForm;
