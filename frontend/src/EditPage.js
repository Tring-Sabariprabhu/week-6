import './EditPage.css';

import { useLocation, useNavigate} from 'react-router-dom';
import DefaultImage from './Images/Banner.png';
import { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { UserContext } from './Context/UserContext';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { makeToast } from './Toast/MakeToast';


export const EditPage=()=>{
    const navigate = useNavigate();

    const location = useLocation();
 
    // const editPersonaKey = URLStatus.key == undefined ? undefined : Number.parseInt(URLStatus.key);      // Saving Persona key from the URL
    
    const editPersonaKey = location?.state ? location?.state?.index : undefined;
    const [ EditStatus, setEditStatus] = useState(false);                   // It declares Whether this page for Creation or Editing
    
    
    const { user, personas, setEditedPersona, personaAdding,  personaDeletion } = useContext(UserContext);
    

    const [ SavedImage, setSavedImage] = useState(null);           // Storing Image using State
    const [ ImageSelected, setImageSelected] = useState(false);         // Temporarily storing Image for Preview 


    const [ EditImageState, setEditImageState] = useState(false);    // For Edit Image popup
    const [ DeleteCardState, setDeleteCardState] = useState(false);  // For Delete Card popup

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: { name: null, image: null, quote: null, description: null, attitudes: null, painpoints: null, jobs: null, activities: null},
        mode: "onChange"
    });

    
    useEffect( ()=>{
    
        // console.log("UseEffect Running..")
        if(user?.name == null){
            navigate('/');
        }
        else if(editPersonaKey === undefined){      // Create Persona 
            setEditStatus(false);
        }
      
        else{                                       // Editing Persona 
            setEditStatus(true);                   
            const Prev_data = personas.find(persona=> persona.id === editPersonaKey);   // Fetching Previous persona data   

            Object.keys(Prev_data).forEach((key) => {
                setValue(key, Prev_data[key]); // Update form fields
              });

            if(Prev_data.image != null ){
                setSavedImage(Prev_data.image);
            }    
        }
       
    }, []);


    
    const ImageExist = (SavedImage!=null && SavedImage===ImageSelected);
    
    const DeletePopup=()=>{          // Deleting Persona Confirmation
        return(
        <div className='Popup Delete_Popup'>
            <p>Do you want to Delete</p>
            <div className='Buttons_container'>
                    <div className='LeftSide'>

                    </div>
                    <div className='RightSide'>
                        <button type='button' className='Btn1' onClick={()=>setDeleteCardState(false)}>Cancel</button>
                        <button type='button'  className='button_color' onClick={()=>DeleteCard()}>Confirm</button>
                    </div>
                </div>
        </div>)
    }
    const EditPopup=()=>{                          // Image Preview for User
        return(
            <div className='Popup'>
                <div onClick={()=>SetEditImgPopup(false)} className='close_button'>x</div>
                <div className='Image_container' style={{backgroundImage: `url(${ImageSelected ? ImageSelected : DefaultImage})`,}}>

                </div>
                <button type='button' id='image_Browse_button' onClick={()=> document.getElementById('image_input').click()} > Browse</button>
                <input
                        type="file"
                        id='image_input'
                        onChange={handleSelected}
                        accept="image/*"
                        style={{display:"none"}}
                        
                    />
                <div className='Buttons_container'>
                    <div className='LeftSide'>
                        
                            <button type='button' className='Btn1' onClick={()=>SetImageRemoved()} 
                                disabled={ (ImageExist) ? false : true} 
                                style={{color:( (ImageExist) ? "red" : "gray" )}}
                                >Delete</button>
                    </div>
                    <div className='RightSide'>
                        {/* <button type='button' onClick={()=>SetEditImgPopup(false)} className='Btn1'>Cancel</button> */}
                        <button type='button' onClick={()=>AfterClickSave() } className='button_color'>Save</button>
                    </div>
                </div>
            </div>
        )
    };

    const SetImageRemoved=()=>{              // After clicking Delete Button in Image Preview
   
        if(SavedImage){
            setSavedImage(null);
            setImageSelected(null);   // Optional
            setEditImageState(false);            
            makeToast('Image Deleted', 'success');
        }
    }
    const SetEditImgPopup=(BoolValue)=>{                       // Set Edit Image Popup
        if(BoolValue && SavedImage)
            setImageSelected(SavedImage);      // Show SavedImage 
        else    
            setImageSelected(null);        

        setEditImageState(BoolValue);      
    }

    const handleSelected=(event)=>{                                  // Onchange event for Image  (After Choosing Image)
        const allowedExtensions = [".jpg", ".jpeg", ".png",".svg"];
        const ImgURL = (event?.target?.files[0]?.name);
        const ext = ImgURL?.slice(ImgURL.indexOf("."));
        
        if(allowedExtensions.includes(ext) === false){
            setEditImageState(false);
            makeToast('Valid Image file extensions (.jpg, .jpeg, .png, .svg)','warning');
        }
        else{
            const reader = new FileReader();
            reader.readAsDataURL(event?.target?.files[0]);
            reader.onloadend = ()=> setImageSelected(reader.result);
            // setImageSelected(URL.createObjectURL(event?.target?.files[0]));   // Store Selected Image Temporary
        }
        
    }

    const AfterClickSave=()=>{                          // After click Save in Image Preview
        if(ImageSelected == null && SavedImage === null){
            makeToast('No Image Selected', 'info');
        }
        else if(SavedImage && ImageSelected === SavedImage){
            makeToast('Selected Image is already exist', 'info');
        }
        else if(ImageSelected){
            setSavedImage(ImageSelected);   // Save Selected Image
            setEditImageState(false);    // Hide Popup
            makeToast('Image Saved', 'success');
        }
        else{
            makeToast('Please select any Image file before click \'Save\'', 'info');
        }
    }

  
  
    const handleQuillChange=(field, value)=>{                       // Onchange Function for RichTextArea inputs
        setValue(field, value);
        
    }
 
    const onSubmit = (data) => {                                    // After Submitting form
        // console.log(data);
        // console.log("image : " + SavedImage);
        data.name = data.name.trim();
        if (EditStatus) {
            data.image = SavedImage;
            setEditedPersona(editPersonaKey, data);  // Save changes of Existing data
            makeToast("Changes Saved Successfully", 'success');
            navigate(-1);
        } else {
            data.image = SavedImage;
            // addPersona(data);                        // Save new Data
            personaAdding(data);
            makeToast('Persona Created Successfully', 'success');
            navigate(-1);
        }
        
        
    };

    const DeleteCard=()=>{                                   // For Deleting Card
        personaDeletion(editPersonaKey);
        setDeleteCardState(false);
        navigate(-1);
        makeToast('Persona Deleted Successfully', 'success');
    }
    
 
   
    return(
        <>
       
        
        {   
            EditImageState && EditPopup()                  // Edit Image Popup
           }
        {
            DeleteCardState && DeletePopup()                  // Delete Card Popup
           }

        <form className="EditPage"  onSubmit={handleSubmit(onSubmit)}>                  
            <div className="Image_container" style={{backgroundImage: `url(${SavedImage ? SavedImage : DefaultImage})`,}}>
                <div className='Input_Area'>
                    <div className='Content' >
                        <p className='title'>Persona Name <span className='asterick'>*</span></p>
                        <input                                   
                                type="text"
                                className="personaName"
                                name='name'
                                placeholder="Sample"
                                
                                {...register("name", 
                                    {                             
                                        validate: {
                                            requiredCheck: (value) =>   value?.length > 0 || "Persona Name is required",
                                            checkMin: (value)=> value?.length <= 20 || "Persona Name Should contain 20 characters"
                                          },
                                        pattern: {
                                            value: /^[A-Za-z\s{2,}]*$/,
                                            message: "Persona Name should only contain alphabets "
                                        }, 
                                  
                                  
                                })} 
                                value={watch("name") || ""}
                                // onChange={handleChange}
                                
                                
                                />
                            {errors.name && <span className='error_msg'>{errors.name.message}</span>} 
                       
                        
                    </div>
                    <button type='button' className='editImageBtn' onClick={()=>SetEditImgPopup(true)}>
                        {SavedImage ? "Edit Image" : "Upload Image"}
                    </button>
                </div>
                
            </div>
            <div className='Input_container'>
                <div className='Input'>
                    <label>Notable Quote</label><br/>
                    <textarea placeholder='Enter quote that identifies the persona' name='quote' 
                        {...register('quote', { 
                            pattern: {
                                value: /^[A-Za-z!@#$%^&*(),.?":{}|<>-_+=\s"';:/~]*$/,
                                message: 'Quote should only contain alphabets and special symbols'
                            }   
                        })} 
                        value={watch("quote") || ""}/>
                        {errors.quote && <span className='error_msg'>{errors.quote.message}</span>}
                </div>
                <div className='Input'>
                    <label>Description</label><br/>
                    <textarea placeholder='Enter a general description/bio about the persona' name='description' 
                        {...register('description', { 
                            pattern: {
                                value: /^[A-Za-z!@#$%^&*(),.?":{}|<>-_+=\s"';:/~]*$/,
                                message: 'Description should only contain alphabets and special symbols'
                            }
                            
                        })}
                        value={watch("description") || ""}/>
                        {errors.description && <span className='error_msg'>{errors.description.message}</span>}
                </div>
                <div className='Input'>
                    <label>Attitudes / Motivations</label><br/>
                    <textarea placeholder='What drives and incentives the persona to reach desired goals? What mindset the persona have?' name='attitudes'  
                        {...register('attitudes', { 
                            pattern: {
                                value: /^[A-Za-z!@#$%^&*(),.?":{}|<>-_+=\s"';:/~]*$/,
                                message: 'Attitudes should only contain alphabets and special symbols'
                            }
                        })} 
                        value={watch("attitudes") || ""}/>
                        {errors.attitudes && <span className='error_msg'>{errors.attitudes.message}</span>}
                </div>
                <div className='Input react_quill'  >
                    <label>Pain Points</label><br/>
                    <ReactQuill theme="snow"   value={watch("painpoints") || ""} 
                     placeholder='What are the biggest challenges that the persona faces in their job?' 
                     onChange={(value)=>handleQuillChange("painpoints", value)}
                     />
                     

                </div>
                <div className='Input react_quill'>
                    <label>Jobs / Needs </label><br/>
                     <ReactQuill  theme="snow" 
                     placeholder="What are the persona's functional, social and emotional needs to be successful at their job?" 
                     value={watch("jobs") || ""} onChange={(value)=>handleQuillChange("jobs", value)}/> 
                </div>
                <div className='Input react_quill'>
                    <label>Activities</label><br/>
                    <ReactQuill  theme="snow"   
                     placeholder='What does the persona like to do in their free time?' 
                     value={watch("activities") || ""} onChange={(value)=>handleQuillChange("activities", value)}/> 
                </div>
            </div>
           
            <div className='Submit_container Buttons_container'>
                    <div className='LeftSide'>
                        {
                            EditStatus && <button type='button' className='Btn1' onClick={()=>setDeleteCardState(true)} >Delete</button>
                        }
                    </div>
                    <div className='RightSide'>
                        <button type='button' className='Btn1' onClick={()=>navigate(-1)}>Close</button>
                        <button type='submit' className='Btn2 button_color' >
                            { EditStatus ? "Update Persona" : "Create Persona"}
                        </button>
                    </div>
            </div>
        </form>
        </>
    )
}