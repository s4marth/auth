import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import AWS from 'aws-sdk';

const S3_BUCKET ='equip9-testing';
const REGION ='ap-south-1';
const ACCESS_KEY ='AKIA3KZVK3RM6V72UAHV';
const SECRET_ACCESS_KEY ='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';




    


const Register = () => {
    const [user, setUser] = useState({
        email:"",
        password:"",
        name: "",
        number: ""
    })
   
    const [msg,setMsg]= useState("");

    
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          // Upload the file to AWS S3
          uploadFileToS3(file);
        }
      };
      const uploadFileToS3 = async(file) => {
        // Set your AWS credentials and S3 bucket configuration
        AWS.config.update({
          accessKeyId: 'AKIA3KZVK3RM6V72UAHV',
          secretAccessKey: '0rMJ2oKSdPdnI+tM53XJcse2fY4VvZoJ3xBJPy4j',   //it has a special character
          region: 'ap-south-1',
        });
        const s3 = new AWS.S3();
        // Set the S3 bucket name and key (filename)
        const bucketName = 'equip9-testing';
        const fileName = file.name;
        // Prepare the object parameters for the S3 upload
        const params = {
          Bucket: bucketName,
          Key: fileName,
          Body: file,
          ACL: 'public-read',
        };
        // Upload the file to S3
        // try {
        //     await s3.putObject(params).promise();
        //     console.log('Image uploaded successfully!');
        //   } catch (err) {
        //     console.error('Error uploading image:', err);
        //   }
        s3.upload(params, function (err, data) {
            if (err) console.log('Error:', err);
            else console.log('Upload success:', data.Location);
          });
    };
    

   const his=useHistory();
   axios.defaults.withCredentials = true;
   


    const onSub= async (e)=>{
        e.preventDefault();

       let val=  await axios.post("http://localhost:8000/register",user);

      
       if(val.data.msg)
       {
        setMsg(val.data.msg);
       }else{
        his.push("/login");
       }
    // console.log(val)

        

    }

    useEffect(() => {
        const checkLogin= async ()=>{
         let val= await axios.get("http://localhost:8000/login");
        
         if(val.data.user)
         {
             his.push("/profile")
             // console.log(val.data.user[0].email);
         }
        }
        checkLogin();
     }, [])
 
   

    const userInput=(event)=>{
        const {name,value}=event.target;
        setUser((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        })

    }

    


    return (
        <>
       <div className="container" id="formm">
       <div className="row">
           <div className="col-lg-6 col-md-8 col-12 mx-auto">
           {
                  msg ? (
                       <>
                      <div class="alert alert-danger alert-dismissible">
  <button type="button" class="close" data-dismiss="alert">&times;</button>
  <strong>ERROR!</strong> {msg}
</div>
                       
                       
                       </>
                   ):null
               }
               <br />
<form onSubmit={onSub}>

  <div className="form-group">
    <label >Email address:</label>
    <input type="email" className="form-control" placeholder="Enter email" name="email" value={user.email} onChange={userInput}  required/>
  </div>

  <div className="form-group">
    <label for="pwd">Password:</label>
    <input type="password" className="form-control" placeholder="Enter password" name="password" value={user.password} onChange={userInput} required />
  </div>

   <div className="form-group">
    <label >Full name:</label>
    <input type="text" className="form-control" placeholder="Enter full name" name="name" value={user.name} onChange={userInput}  required/>
  </div> 

   <div className="form-group">
    <label >Number:</label>
    <input type="number" className="form-control" placeholder="Enter number" name="number" value={user.number} onChange={userInput}  required/>
  </div>

  <div className="form-group">
    <label >Profile picture:</label>
    <input type="file" onChange={handleFileInputChange} className="form-control" placeholder="Enter image" name="image"/>
  </div>
  
  <button type="submit"  className="btn btn-primary">Submit</button>
</form>
           </div>
       </div>
       </div>
            
        </>
    )
}

export default Register
