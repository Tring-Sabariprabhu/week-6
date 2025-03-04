import { createContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { gql, useLazyQuery } from "@apollo/client";
import { makeToast } from "../Toast/MakeToast";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [ user, setUser ] = useState({ name: null, email: null });
  const [ personas, setPersonas] = useState([]);
  
  const UserDetails = gql`
        query getUserDetails($email: String!){
          getUser(email: $email){
    
            personas{
              id,
              name,
              image,
              quote,
              description,
              attitudes,
              painpoints,
              jobs,
              activities
            }
           
          }
        }`
        
  const persona_Create = gql`
    mutation insert_Persona($email: String!, $name: String!, $image: String, $quote: String, $description: String, $attitudes: String, $painpoints: String, $jobs: String, $activities: String ){
      insertPersona(email: $email, name: $name, image: $image, quote: $quote, description: $description, attitudes: $attitudes, painpoints: $painpoints, jobs: $jobs, activities: $activities)
    }`

  const persona_Delete = gql`
  mutation delete_Persona($email: String!, $id: Int!){
    deletePersona(email: $email, id: $id)
  }
  `
  const persona_Update = gql`
  mutation update_Persona($email: String!, $id: Int!, $name: String, $image: String, $quote: String, $description: String, $attitudes: String, $painpoints: String, $jobs: String, $activities: String ){
    updatePersona(email: $email, id: $id, name: $name, image: $image, quote: $quote, description: $description, attitudes: $attitudes, painpoints: $painpoints, jobs: $jobs, activities: $activities)
  }
  `

  const [getUser] = useLazyQuery(UserDetails,{fetchPolicy:"network-only"});
  const [insertPersona] = useMutation(persona_Create);
  const [deletePersona] = useMutation(persona_Delete);
  const [updatePersona] = useMutation(persona_Update);
  
  useEffect(()=>{
    
    if(user?.email){
      console.log("user context useEffect running")
      storeAllPersonasToContext()
    }
  },[user]);
  
  const setUserDetails=(userData)=>{
    setUser(userData);
  }
  const storeAllPersonasToContext = async ()=>{    
    if(user.email != null){
      const {data: result} = await getUser({variables:{email: user.email}});
      const personas = Object.values(result.getUser.personas);
      setPersonas(personas)
    }
  
    }
 
  const personaDeletion = async (persona_id) => {
    if(user.email){
      const { data: result, errors}= await deletePersona({variables: {email: user.email, id: persona_id}})
      if(result)
        console.log(result.deletePersona);
      if(!errors){
        storeAllPersonasToContext()
      }
      else{
        makeToast("error occurr", 'error')
      }
      
    }
  }
  const personaAdding = async (newPersona) => {
    if(user.email){
      const { data: result, errors } = await insertPersona({variables: {email: user.email, name: newPersona.name, image: newPersona.image, quote: newPersona.quote, description: newPersona.description, attitudes: newPersona.attitudes, painpoints: newPersona.painpoints, jobs: newPersona.jobs, activities: newPersona.activities}})
      if(result)
        console.log(result.insertPersona)
      if(!errors){
        storeAllPersonasToContext()
      }
      else{
        makeToast("error occurr", 'error')
      }
      
      
    }
  };
  const setEditedPersona = async (persona_id, data)=>{
    if(user.email){
      const {data: result, errors} = await updatePersona({variables:{id: persona_id, email: user.email, name: data.name, image: data.image, quote: data.quote, description: data.description, attitudes: data.attitudes, painpoints: data.painpoints, jobs: data.jobs, activities: data.activities}})
      if(result){
        console.log(result.updatePersona)
      }
      if(!errors){
        storeAllPersonasToContext();
      }
      else{
        makeToast("error occurr", 'error')
      }
      
      
    }
  }

  return (
    <UserContext.Provider value={
        {   user,
            setUser,
            setUserDetails,
            personas,
            setPersonas,
            personaAdding, 
            personaDeletion,
            setEditedPersona,
            storeAllPersonasToContext
            }
        }>
      {children}
    </UserContext.Provider>
  );
};
