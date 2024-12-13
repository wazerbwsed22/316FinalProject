
import React, { useState } from "react";
import axios from "axios";


const EditTags = ({tag , setShowModifyTagScreen}) => {
  const [newTagName, setNewTagName] = useState("");



  const handleModifyTagClick = async (event) => {
    event.preventDefault();
    let data = JSON.stringify({
      "tag_id": tag._id,
      "name": newTagName,
    });
    
    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: 'http://localhost:8000/api/tags',
      headers: { 
        'Content-Type': 'application/json', 
      },
      data : data,
      withCredentials: true,
    };
    
    await axios.request(config)
    .then((response) => {
      setShowModifyTagScreen(false);
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      setShowModifyTagScreen(false);
      console.log(error);
    });
  }


  const deleteTaghandle = async () => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/tags?tag_name=${tag.name}`,
      headers: {},
      withCredentials: true,
    };
    
    axios.request(config)
    .then((response) => {
      setShowModifyTagScreen(false);

      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      setShowModifyTagScreen(false);
      console.log(error);
    });
  }


  return (
    <div className="form">
      <form
       style={{ flexGrow: 2 }}
        onSubmit={(event) => handleModifyTagClick(event)}
 >
        <h1>Tag Name</h1>
        <input
          type="text"
          className="line_textbox"
          id="questiontitle-input"
          required
          minLength="1"
          maxLength="50"
          onChange={(event) => setNewTagName(event.target.value)}
        />

        <div
          style={{ display: "flex", marginTop: "2vh" }}>
          <input type="submit" value="Edit Tag" />
          <button  onClick={ async () => 
            await deleteTaghandle()}>Delete
            </button>
            <button  onClick={ async () => setShowModifyTagScreen(false)}>Cancel</button>
        </div>
        
      </form>
    </div>
  );

}

export default EditTags;