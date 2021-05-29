import { Avatar, Button } from '@material-ui/core';
import React ,{useState,  forwardRef}from 'react'
import { db, storage } from './firebase'
import "./Post.css"
import { useStateProvider } from './StateProvider'
import firebase from "firebase/app"

const Post = forwardRef(({src,id, image, username,comments, caption},ref) => {
    const [{user}] = useStateProvider()
    const [comment, setComment] = useState("")

    const handlePost = () => {
        if(comment !== ""){

        db.collection("posts").doc(id).update({
            comments  : firebase.firestore.FieldValue.arrayUnion({
                username : user?.displayName,
                text : comment,
                
            }),
        }).then(() => {
            console.log()
            setComment("")
        }).catch((error) => {
            console.log(error.message)
        })
    }

    setComment("")
    }

    const handleDelete = () => {
       let ImageUrl = storage.refFromURL(image);

       ImageUrl.delete()
        .then(() => {
            console.log("Deleted Image Successfully")
        })
        .catch(error => {
            console.log(`Deleted Image Error ${error.message} `);
        })

       db.collection("posts").doc(id)
        .delete()
        .then(() => {
            console.log("Deleted Post Successfully")
        })
        .catch(error => {
            console.log(`Deleted Post Error ${error.message}`);
        })
    }

    return (
        <div ref={ref} className="post">
            <div className="post__header">
                <div className="post__left">
                <Avatar src={src}className="post__avatar"/>
                <h3>{username}</h3>
                </div>
               {user && 
                <div className="post__delete">
                    <Button onClick={handleDelete} className="post__deleteBtn">Delete</Button>
                </div>
            }
            </div>
            <img src={image} alt="post"/>
            <div className="post__footer">
                <p>
                   <strong>{username} </strong> {caption}
                </p>
            </div>
            <div className="post__comments">
            <p className="post__commentsView">{comments?.length} Comments</p>

            {comments ? (
                comments.map((data) => (
                <p >
                    <strong>{data.username} </strong> {data.text}
                </p>
                ))
               
               
            ) : (
                <>
                </>
            )}
              
            </div>
            {user && 
            <div className="post__commentUpload">
            
                
                <input 
                type="text"
                placeholder="text a comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                />
                <button onClick={handlePost}>Post</button>
            
            </div>
            }
            <div className="post__like">
                <p>Like</p>
                <p>Comment</p>
                <p>Share</p>
            </div>
        </div>
    )
})

export default Post
