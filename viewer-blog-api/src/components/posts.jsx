import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
export default function Posts({posts, reload, user}) {
  const commentContent = useRef([]);
  const navigate = useNavigate();
  const [inputStates, setInputStates] = useState({});
  const commentRefs = useRef([]);

  const commentInput = (id) => {
    setInputStates((prevStates) => ({ ...prevStates, [id]: true }));
  };
  const updateComment = async (commentId) => {
    console.log(commentRefs.current[commentId])
    fetch(`http://localhost:3000/comment/${commentId}`, {
      mode: "cors",
      method: "PUT", body: JSON.stringify({
        content: commentRefs.current[commentId].value
      }),
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()});
      commentRefs.current[commentId].value = ''
      setInputStates((prevStates) => ({ ...prevStates, [commentId]: false }))
      reload(true)
      navigate('/')
  }
  const leaveComment = async (postId) =>{
    fetch(`http://localhost:3000/comment/${postId}`, {
      mode: "cors",
      method: "POST", body: JSON.stringify({
        content: commentContent.current[postId].value
      }),
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()});
      commentContent.current[postId].value = ''
      reload(true)
      navigate('/')
  }
  const removeComment = async (commentId) => {
    fetch(`http://localhost:3000/comment/${commentId}`, {
      mode: "cors",
      method: "DELETE",
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response=>{ 
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json()});
      reload(true)
      navigate('/')
  }
  
  return(
    <div>
      {(posts && posts.length > 0)?
      (posts.map(post=>
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {(post.updateAt)? (
            <p>Update at {Date(post.updateAt)}</p>
          ):(
            <p>Created at {Date(post.createdAt)}</p>
          )}
          <p>Comments</p>
          {post.comments.map(comment=>
            <>
              <p>{comment.author.username}:</p>
              <p>{comment.content}</p>
              {(comment.updateAt)? (
                <p>Update at {Date(comment.updateAt)}</p>
              ):(
                <p>Created at {Date(comment.createdAt)}</p>
              )}
              {user ? (<>
              {(comment.authorId === user.id && !inputStates[comment.id])?(
                <button onClick={()=>commentInput(comment.id)}>Update</button>
              ):(comment.authorId === user.id && inputStates[comment.id])?(
                <>
                <input ref={el => commentRefs.current[comment.id] = el} type="text" defaultValue={comment.content}></input>
                <button onClick={()=>updateComment(comment.id)}>Update Comment</button>
                </>
              ):(
                <></>
              )}
              {(parseInt(comment.authorId) === parseInt(user.id) )?(
                <button onClick={()=>removeComment(comment.id)}>Delete</button>
              ):(
                <></>
              )}
            
              </>):(<></>)}
              
          </>
          )}
          <br></br>
          <label>Leave a comment: <input ref={el =>commentContent.current[post.id] = el} type="text"></input><button onClick={()=>leaveComment(post.id)}>Submit Comment</button></label>
          </div>
         )
      ) : (
        <p>No posts yet</p>
      )
      }
     
      </div>
  )
  }


Posts.propTypes = {
  posts: PropTypes.array,
  reload: PropTypes.func,
  user: PropTypes.object
}