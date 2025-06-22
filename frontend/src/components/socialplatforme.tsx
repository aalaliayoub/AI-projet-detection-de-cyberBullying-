"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Share2, Send, Home, Search, Bell, Plus } from "lucide-react"
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from "react"
import SuccessAlert from "./alertS"
import AlertEchec from "./alertE"
import { SuiteContext } from "node:test"
import { error } from "console"
interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
}
interface typeData{
  prediction:string
}
interface Post {
  id: string
  author: string
  content: string
  timestamp: string,
  likes: number
  comments: Comment[]
  isLiked: boolean
}

export default function Component() {

  const url="https://385f-34-170-210-143.ngrok-free.app/predict" //remplacer par l'url de votre API sans supprimer /predict 

  const [posts, setPosts] = useState<Post[]>([])

  const [isgood,setIsgood]=useState(false)
  const [iscyberBullying,setIscyberbullying]=useState(false)

  const [newPost, setNewPost] = useState("")
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({})

  useEffect(()=>{
    fetch("http://127.0.0.1:5000/posts",{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
       .then(res => res.json())
      .then(data => {
        console.log(data.posts)    
        setPosts(data.posts) 
      })
      .catch(error => {
        console.error('Erreur lors de lenvoi du post :', error)
      })

  },[])

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id:uuidv4(),
        author: "Vous",
        content: newPost,
        timestamp:new Date().toISOString(),
        likes: 0,
        comments: [],
        isLiked: false,
      }
      
      // predcite clAass

      fetch(url,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          'text':newPost
        })
      })
      .then(res=>res.json())
      .then(data=>{
        console.log(data.prediction)
        if(data.prediction=="other_cyberbullying" || data.prediction=="not_cyberbullying"){
           setIsgood(true)

        }
        else{
          setIscyberbullying(true)

        }
      })
      .catch(error=>{
        console.log(error)
      })

      //fetching data
      if(!iscyberBullying){
        fetch("http://127.0.0.1:5000/posts",{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...post
          })
        })
        .then(res => res.json())
        .then(data => {
          if(data.message="success"){
            setPosts([post, ...posts])
            setNewPost(" ")
          }
        })
        .catch(error => {
          console.error('Erreur lors de lenvoi du post :', error)
        })
    }
      
    }
  }

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
              
            }
          : post,
      ),
    )
    let postLiked=posts.find(post =>post.id === postId)|| {
        id:uuidv4(),
        author: "Vous",
        content: newPost,
        timestamp:new Date().toISOString(),
        likes: 0,
        comments: [],
        isLiked: false,

    }
    fetch("http://localhost:5000/posts/like/"+postId,{
      method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "likes": postLiked.isLiked ? postLiked.likes - 1 : postLiked.likes + 1
        })
    })
    .then(res=>res.json)
    .then(data=>{
      console.log(data)
    })
    .catch(error=>{
      console.log(error)
    })
  }

  const handleAddComment = (postId: string) => {
    const commentText = commentInputs[postId]
    if (commentText?.trim()) {
      const newComment: Comment = {
        id:uuidv4(),
        author: "Vous",
        content: commentText,
        timestamp:new Date().toISOString(),
      }
      // predicte comment class
      fetch(url,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          'text':commentText
        })
      })
      .then(res=>res.json)
      .then(data=>{
        console.log(data)
      })
      .catch(error=>{
        console.log(error)
      })
      
      fetch("http://localhost:5000/posts/comment/"+postId,{
      method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newComment
        })
    })
    .then(res=>res.json)
    .then(data=>{
      console.log(data)
    })
    .catch(error=>{
      console.log(error)
    })
      setPosts(posts.map((post) => (post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post)))

      setCommentInputs({ ...commentInputs, [postId]: "" })
    }
  }

  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInputs({ ...commentInputs, [postId]: value })
  }

  const handleErreur=()=>{
    setIscyberbullying(false)
    setIsgood(false)
  }
  return (<>
  {
    isgood&&
    <SuccessAlert message={"Publié avec succès"} handleClose={handleErreur}/>
  }
  {
    iscyberBullying&&
    <AlertEchec message={"Ce post ou commentaire contient du cyberBullying. Nous ne le partageons pas."} handleErreur={handleErreur}/>
  }
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-600">CyberBullying</h1>
              <div className="hidden md:flex space-x-6">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span>Accueil</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Rechercher</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8 bg-amber-600" >
                
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Créer un post */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Avatar>
               
                <AvatarFallback>V</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Quoi de neuf ?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
                />
              </div>
            </div>
          </CardHeader>
          <CardFooter className="pt-0">
            <div className="flex justify-between items-center w-full">
              <div className="flex space-x-2">
                <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                  <Plus className="w-3 h-3 mr-1" />
                  Photo
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                  <Plus className="w-3 h-3 mr-1" />
                  Vidéo
                </Badge>
              </div>
              <Button onClick={handleCreatePost} disabled={!newPost.trim()} className="bg-blue-600 hover:bg-blue-700">
                Publier
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Liste des posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar>
                   
                    <AvatarFallback>
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{post.author}</h3>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-800 leading-relaxed">{post.content}</p>
              </CardContent>

              <CardFooter className="flex-col space-y-4">
                {/* Actions du post */}
                <div className="flex justify-between items-center w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 ${post.isLiked ? "text-red-500" : "text-gray-500"}`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                    <span>{post.likes}</span>
                  </Button>

                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-500">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.length}</span>
                  </Button>

                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-500">
                    <Share2 className="w-4 h-4" />
                    <span>Partager</span>
                  </Button>
                </div>

                {/* Commentaires existants */}
                {post.comments.length > 0 && (
                  <div className="w-full space-y-3">
                    <Separator />
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="w-6 h-6">
                          
                          <AvatarFallback className="text-xs">
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p className="font-semibold text-sm">{comment.author}</p>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ajouter un commentaire */}
                <div className="flex space-x-3 w-full">
                  <Avatar className="w-6 h-6">
                   
                    <AvatarFallback className="text-xs">V</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex space-x-2">
                    <Input
                      placeholder="Écrire un commentaire..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddComment(post.id)
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
 </> )
}




