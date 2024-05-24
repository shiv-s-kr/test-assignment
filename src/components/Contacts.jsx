import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Grid, Heading, Popover, PopoverCloseButton, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react'
import "../Css/Contact.css"
import { Link } from 'react-router-dom'
import axios from 'axios'
import {v4} from "uuid"
import { useDispatch, useSelector } from 'react-redux'
import { addContact } from '../Redux/Add_Contacts/addContacts.action.js'
import Header from './Header'

const getData=async()=>{
    return await axios.get("https://taiyo-ai-server.onrender.com/contacts")
}


const Contacts = () => {
    const [flag,setFlag]=useState(false)
    const [contacts,setContacts]=useState([{name:String,lastName:String,status:String}])
    const [edit,setEdit]=useState({name:"",lastName:"",status:""})
    const [data,setData]=useState([])
    const dispatch=useDispatch()
    const [view,setView]=useState(false)


const handleChange=(e)=>{
        const {name,value}=e.target;
      
          setContacts({...contacts,[name]:value});
    }


const handleSubmit=(e)=>{
        e.preventDefault()
        if(contacts.name && contacts.lastName && contacts.status){
            dispatch(addContact({
                id:v4(),
                ...contacts
                
            }))
            
        }else{
          alert("please fill all creadentials")
        }
        setContacts({})
    }


const handleChangeEdit=(e)=>{
    const {name,value}=e.target;
  
      setEdit({...edit,[name]:value});

}
const handleSubmitEdit=(e,id)=>{
    e.preventDefault();    
    try{
      axios.put(`https://taiyo-ai-server.onrender.com/contacts/${id}`,{name:edit.name,lastName:edit.lastName,status:edit.status}).then(()=>alert("Contact Edit Successfully")).then(()=>getData().then((res)=>setContacts(res.data)))
    }
    catch(err){
      console.log(err)
    }       
}
const deleteContact=(id)=>{
    axios.delete(`https://taiyo-ai-server.onrender.com/contacts/${id}`).then((res)=>alert("Contact Delete Successfully")).then(()=>getData().then((res)=>setContacts(res.data)))
}
useEffect(()=>{
        getData().then((res)=>setData(res.data))
    },[handleSubmit])

const onOpen=()=>{
    setFlag(true)
}

const onClose=()=>{
    setFlag(false)
}

const viewContact=()=>{
    setView(!view)
}

  return (
    <div id="contact_page">
      <Header></Header>

        <Heading ></Heading>
        <div id="contact_page_div">
            {window.innerWidth>900?<Box padding={"10px"} w={"19%"} boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}>
               <Box><Link style={{textDecoration:"none",fontSize:"20px",fontWeight:"bold"}} to="/">Contacts</Link></Box>
               <br />
               <br />
               <Box><Link style={{textDecoration:"none",fontSize:"20px",fontWeight:"bold"}} to="/chartsandmaps">Charts & Maps</Link></Box>
            </Box>:<Flex justifyContent={"space-evenly"} w={"100%"} margin={'auto'} marginBottom={"20px"} p={"10px 0px"}  boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}>
               <Box><Link style={{textDecoration:"none",fontSize:"20px",fontWeight:"bold"}} to="/">Contacts</Link></Box>
               <Box><Link style={{textDecoration:"none",fontSize:"20px",fontWeight:"bold"}} to="/chartsandmaps">Charts & Maps</Link></Box>
            </Flex>}
            <Box padding={"30px"} margin={'auto'}  w={"79%"} boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"} border={"1px solid gray"}>
          {flag ? <></> : <Button marginTop={"20px"} onClick={onOpen} className='btn btn-info '>Create Contact</Button>}
               <Box>
                {
                    flag?
                    <form onSubmit={handleSubmit} id="form" className='card'>
                  <Heading onClick={onClose} className='text-danger'><span className='text-info'>Add Contact</span><button className='btn btn-danger ml-3'>X</button> </Heading>
                  <input type="text" className='form-control' placeholder='First Name' id="name" name="name" onChange={handleChange} />
                    <br />
                  <input type="text" className='form-control' placeholder='Last Name' id="lastName" name="lastName" onChange={handleChange}/>
                    <br />
                  <label><span className='pr-2'>Status:</span>
                    <input type="radio" className='form-radio' id="status" name="status" value="active" onChange={handleChange} />
                    <label className='pl-2 pr-2'>Active</label>
                    <input type="radio" className='form-radio' id="status" name="status" value="inactive" onChange={handleChange} />
                    <label className='pl-2'>Inactive</label>
 </label>
                  
                 
                   
                  <input type="submit" className='btn btn-info' value="Save Contact"/>
                    </form>:<></>
                }
               </Box>
               
               {data.length<1?
                    <Box id="empty"   marginTop={"4%"} >
              <span className='bg-light  p-2'>No Contact Found Please add contact from Create Contact Button</span>
              <Heading></Heading>
                    </Box>:
                    <Box marginTop={"4%"}>
                      <hr />
                        <div id="data_container">
                            {data.map((el)=>(
                              <div key={el.id}>
                                <Text fontWeight={"bold"}>{el.name} {el.lastName}</Text>
                                <Popover >
                                   <PopoverTrigger  >
                                    <button onClick={viewContact} className='btn btn-outline-success'>View</button>
                                   </PopoverTrigger>
                                  <PopoverContent className='alert alert-success' padding={'20px'} color='white' margin={'auto'}  >
                                   
                                    <Text color={"black"}> <b>Name : </b> {el.name}</Text>
                                    <Text color={"black"}> <b>Last Name :</b> {el.lastName}</Text>
                                    <Text color={"black"}> <b>Status :</b> {el.status}</Text>
                                   </PopoverContent>
                                </Popover>
                                <Popover >
                               <PopoverTrigger  >
                                    <button className='btn btn-outline-primary'>Edit</button>
                               </PopoverTrigger>
                                  <PopoverContent className='alert alert-primary'   >
                                   
                                          <input type="text" className='form-control' placeholder='Name' id="name" name="name" onChange={handleChangeEdit} />
                                            <br />
                                        
                                    <input type="text" className='form-control' placeholder='Last Name' id="lastName" name="lastName" onChange={handleChangeEdit}/>
                                             
                                          <br />  
                                    <label >Status:<input type="radio" id="status" className='ml-2' name="status" value="active" onChange={handleChangeEdit}/>
                                      <label className='pl-2 pr-2'>Active</label>
                                           <input type="radio" id="status" name="status" value="inactive" onChange={handleChangeEdit}/>
                                      <label className='pl-2'>Inactive</label></label>
                                          <br />
                                    
                                          <button className='btn btn-primary'
                                            onClick={(e)=>handleSubmitEdit(e,el.id)}
                                            >Submit</button>
                                </PopoverContent>
                            </Popover>
                            <button onClick={()=>deleteContact(el.id)} className='btn btn-danger' >Delete</button>
                              </div>
                            ))} 
                        </div>
                    </Box>
                }
            </Box>
        </div>
    </div>
  )
}

export default Contacts