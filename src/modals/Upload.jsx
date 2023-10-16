import React, { useState } from "react";
import "../css/Modal.css";
import { AiOutlineClose } from "react-icons/ai";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../src/firebase";
import axios from "axios";
import { useCookies } from "react-cookie";

const Upload = ({ handleModal }) => {

  const [ cookies, setCookie, removeCookie] = useCookies(null);

  const [file, setFile] = useState(null);
  const [inputs, setInputs] = useState({});
  const [progressBar, setProgressBar] = useState(null);
  const [showBar, setShowBar] = useState(false);

  const authToken = cookies.AuthToken;

  const handleUpload = (e) => {
     e.preventDefault();


   const fileName = new Date().getTime() + file.name;

   const storage = getStorage(app);
   const storageRef = ref(storage, fileName);

   const uploadTask = uploadBytesResumable(storageRef, file);

// Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on(
  "state_changed", 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    setProgressBar(progress);
    setShowBar(true);

    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
        default:
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
      console.log(downloadURL);

      // "file_name": "string",
      // "file_url": "string"
      const  folder_name = fileName;

      const userFiles = {...inputs, file:  downloadURL };

      console.log(userFiles.file);

      try {
        const res = await axios.post('https://japaconsults.sammykingx.tech/documents/upload',
         userFiles,
         {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
        );
            
        // https://luxury.onrender.com/api/add-property

        console.log('File uploaded:', res.data);
      } catch(err) {
        console.log('Error uploading file:', err);
      }
    });
  }
);
  }

  


  return (
    <div className="modal-form">
      <form>
        <h3>UPLOAD FILE</h3>
        <div>
          <label htmlFor="">Upload File</label>
          <input type="file" 
          id="file"
          onChange={e=>setFile(e.target.files[0])}
          />
        </div>
        <div>
        {showBar ? <p>Uploading {progressBar}% done</p> : ""}
          <button onClick={handleUpload}>UPLOAD</button>
        </div>
        <AiOutlineClose onClick={handleModal} />
      </form>
    </div>
  );
};

export default Upload;
