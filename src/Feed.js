import { Button } from '@material-ui/core'
import { AddAPhoto } from '@material-ui/icons'
import React, {useState, useEffect} from 'react'
import "./Feed.css"
import { db, storage } from './firebase'
import Post from './Post'
import { useStateProvider } from './StateProvider'
import firebase from "firebase/app"
import FlipMove from "react-flip-move"


const Feed = () => {
    const [posts, setPosts] = useState([])
    const [{user}] = useStateProvider()
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0);
    

    useEffect(() => {
        db.collection("posts").orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
            setPosts(snapshot.docs.map((doc) => ({
                id : doc.id,
                data : doc.data()
            })))
        })
    }, [])

    const imageUpload = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
    }}

    const handleUpload = (e) => {
        e.preventDefault();
        const uploadTask = storage.ref(`images/${image?.name}`).put(image);

        uploadTask.on("state_changed", 
        (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred/snapshot.totalBytes) * 100
            )
            setProgress(progress)
        }, (error) => {
            console.log(error.message)
        },() => {
            storage.ref("images")
            .child(image?.name)
            .getDownloadURL()
            .then(
            (url) => {
                db.collection("posts").add({
                    image : url,
                    caption : caption,
                    Likes : [],
                    comments : [],
                    src    : user?.photoURL,
                    username:user?.displayName,
                    timestamp : firebase.firestore.FieldValue.serverTimestamp()      
                         })
                         setCaption("")
                         setProgress(0)
                         setImage(null)
            })
        }
        )
    }
    return (
        <div className="feed">
        {user ? (
            <div className="feed__createPost">
            <h2>Create Post</h2>
            <textarea 
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="add a caption"/>
            {progress !== 0 && 
            <div className="feed__barInfo">
            <progress value={progress} max="100" className="feed__bar"/>
             {progress !== 0 && <p>{progress}{"%"}</p>}
            </div>
            }
            <div  className="feed__createPostUpload">
            <label htmlFor="fileUpload">
            <AddAPhoto   style={{marginLeft : "10px",marginRight : "100px",fontSize : "24px", cursor:"pointer" }}/>
            </label>
           
            <input className="feed__upload" 
            id="fileUpload"
             type="file"
             accept="image/*"
             onChange={imageUpload}
             />
            <Button onClick={handleUpload}  className="feed__btn">Upload</Button>
            </div>
            
        </div>
        ) : (
            <>
            <p className="feed__NotUser">Sign In to create a post, or comment</p>
            </>
        )}

            <FlipMove>
        {posts.map(({id, data}) => (
            <Post 
            key={id}
            id={id}
            src={data.src}
            username={data.username}
            image={data.image}
            caption={data.caption}
            comments={data.comments}
            />
        ))}
        </FlipMove>

        </div>
    )
}

export default Feed
