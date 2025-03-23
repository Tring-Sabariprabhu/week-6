
import db from '../dbconnect.js'
export const resolvers = {
    Query:{
        getUser: async (_, {email}) =>{
            const user = await db.query(`SELECT * FROM users WHERE email = $1` ,[email] );
            return user.rows[0];
        },
        
        userIsPresent: async (_, {email})=>{
            const message = await db.query(`SELECT checkValidUser($1) AS valid`,[email]);
            return message.rows[0].valid;
        },
        personaValid: async (_, {email, id})=>{
            const message = await db.query(`SELECT checkValidPersona($1, $2) AS valid`,[email, id]);
            return message.rows[0].valid;
        },
        
      
    },
    user:{
        personas: async (parent)=>{
            const personas = await db.query(`SELECT * FROM persona WHERE useremail = $1 ORDER BY id`, [parent.email]);
            return personas.rows || [];
        }
        
    },
    Mutation:{
        createUser: async (_, {email, name, password}) =>{
            try{
                await db.query(`INSERT INTO users(email, name, password) VALUES($1,$2,$3) `,[email, name, password]);
                return true;
            }
            catch(err){
                return false;
            }
        },
        deleteUser: async (_, {email})=>{
            try{
                await db.query(`DELETE FROM users WHERE email = $1`, [email]);
                return "Deletion Successfully";
            }
            catch(err){
                return `Deletion failed ${err}`;
            }
        },
        updateUser: async (_, {email, name, password}) =>{
            try{
                await db.query(`UPDATE users SET name = $1, password = $2 WHERE email = $3`, [name, password, email]);
                return "Updation Successfully";
            }
            catch(err){
                return `Upadtion failed ${err}`;
            }
        },
       
        insertPersona: async (_, {email, name, image, quote, description, attitudes, painpoints, jobs, activities})=>{
            try{
                const userValid = await resolvers.Query.userIsPresent(_, { email });
                if(userValid){
                    let prev_personaCount = await db.query(`SELECT getPersonaCount($1) AS count`, [email]);
                    const curr_count = prev_personaCount.rows[0].count + 1;
                    await db.query(`INSERT INTO persona(id, useremail, name, image, quote, description, attitudes, painpoints, jobs, activities) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                                                       [ curr_count, email, name, image, quote, description, attitudes, painpoints, jobs, activities]);
                    await db.query("SELECT setPersonaCount($1,$2)",[email, curr_count]);
                    return `Persona details Inserted Successfully , Persona ID : ${curr_count}`;
                }
                else{
                    throw new Error('User Invalid');
                }
            }
            catch(err){
                return `Persona details Insertion failed ${err}`;
            }
        },
        deletePersona: async (_, {email, id})=>{
            try{
                const userValid = await resolvers.Query.userIsPresent(_, { email });
                    if(!userValid){
                        throw new Error('User Invalid');
                    }
                    const personaValid = await resolvers.Query.personaValid(_, {email, id});
                    if(!personaValid){
                        throw new Error('Persona Id Invalid');
                    }

                    await db.query(`DELETE FROM persona WHERE useremail = $1 AND id = $2`, [email, id] );
                    return "Persona details Deleted Succussfully";
                
            }
            catch(err){
                return `Persona details Deletion failed ${err}`;
            }
        },
        updatePersona: async (_, {email, id, name, image, quote, description, attitudes, painpoints, jobs, activities})=>{
            try{
                if(name || quote || description || attitudes || painpoints || jobs || activities || image)
                {
                    const userValid = await resolvers.Query.userIsPresent(_, { email });
                    if(!userValid){
                        throw new Error('User Invalid');
                    }
                    const personaValid = await resolvers.Query.personaValid(_, {email, id});
                    if(!personaValid){
                        throw new Error('Persona Id Invalid');
                    }
                        await db.query(
                            `UPDATE persona 
                            SET name = $1, quote = $2, description = $3, attitudes = $4, painpoints = $5, jobs = $6, activities = $7, image = $8 WHERE useremail = $9 AND id = $10`,
                            [name, quote, description, attitudes, painpoints, jobs, activities, image, email, id]
                        );
                                                          
                        return "Persona details Updated Succussfully";
                    }
                else{
                    throw new Error('Any one field required for Updation');
                }
            }
            catch(err){
                return `Persona details Updation failed ${err}`;
            }
        }
        
    }
}

