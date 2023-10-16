import React, { useState } from "react";
import "../css/AddModal.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const AddModal = ({ handleShowAddModal }) => {

  const navigate = useNavigate();

  const [ cookies, setCookie, removeCookie] = useCookies(null);

  const authToken = cookies.AuthToken;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !editorState) {
      setIsLoading(false);
      return toast.error("PLEASE FILL ALL FIELDS");
    }

    try {
      const contentState = editorState.getCurrentContent();
      const contentHTML = draftToHtml(convertToRaw(contentState));

      const form = {
        title: title,
        content: contentHTML, // Pass the HTML content to the server
        date_created: new Date(),
      };

      console.log(form);
      // Send the form data to your server
      const response = await axios.post(
        "https://japaconsults.sammykingx.tech/notes/save",
        form,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.success("DRAFT CREATED");
      handleShowAddModal();
      // window.location.reload();
      // console.log(token);
      console.log("Draft created successfully:", response.data);
    } catch (error) {

      toast.error("DRAFT CREATION FAILED");
      if (error.response) {
        console.error("Server returned an error:", error.response.data);
        const errDetail = error.response.data.detail
        console.log(errDetail);
        if(errDetail === "expired access token") {
          navigate("/");
        } else if (errDetail === "User not verified");
        toast.error("UNVERIFIED USER");
        // You can access error.response.data for the server's error response
      } else {
        console.error("An unexpected error occurred:", error);
        // Handle other types of errors (e.g., network issues)
      }
      
      console.log("Error creating draft:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-form">
      <form onSubmit={handleFormSubmit}>
        <h3>CREATE DRAFT</h3>
        <AiOutlineClose onClick={handleShowAddModal} />
        <div>
          <label htmlFor="title">Draft title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">Draft Content</label>
          <div
            style={{
              border: "1px solid rgba(0,0,0,0.05)",
              padding: "10px",
              height: "300px",
              marginTop: "10px",
            }}
          >
            <Editor
            value={content}
            onChange={(e) => setContent(e.target.value)}
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={onEditorStateChange}
            />
          </div>
          <div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "CREATING DRAFT..." : "CREATE DRAFT"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddModal;
