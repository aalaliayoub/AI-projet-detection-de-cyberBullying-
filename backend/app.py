from flask import Flask,request,jsonify
from db_setup import session
from models import Post,Comment,Like
import uuid
from sqlalchemy.orm import joinedload
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])


@app.route('/posts', methods=['GET'])

def get_posts():
    try:
        
        posts = session.query(Post).options(joinedload(Post.comments)).all()
        data = []
        for post in posts:
            post_data = {
                'id': str(post.id),
                'author': post.author,
                'content': post.content,
                'timestamp': post.timestamp.isoformat(),
                'likes': post.likes,
                'comments': [
                    {
                        'id': str(comment.id),
                        'author': comment.author,
                        'content': comment.content,
                        'timestamp': comment.timestamp.isoformat()
                    }
                    for comment in post.comments
                ],
                # isLiked est à calculer côté client ou via un utilisateur donné
                'isLiked': False  # ou gérer dynamiquement si un user_id est fourni
            }
            data.append(post_data)
        return jsonify({"posts": data})

    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }, 500

@app.route('/posts', methods=['POST']) 
def add_post():
    data= request.json
    author = data.get('author')
    content = data.get('content')
    id=data.get('id')
    date= data.get('timestamp')
    likes=data.get('likes')
    print(date)
    try:
        if not author or not content:
            return {
                'status': 'error',
                'message': 'Author and content are required'
            }, 400

        new_post = Post(
            id=id or str(uuid.uuid4()),
            author=author,
            content=content,
            timestamp=date,
            likes=likes
        )
        session.add(new_post)
        session.commit()
        return {
            'status': 'success',
            'message': 'Post added successfully',
            'post_id': str(new_post.id)
        }, 201

    except Exception as e:
        session.rollback()
        return {
            'status': 'error',
            'message': str(e)
        }, 500

@app.route('/posts/comment/<id>', methods=['POST'])
def add_comment(id):
    try:
        data = request.json
        post = session.query(Post).filter(Post.id == id).first()
        if not post:
            return {
                'status': 'error',
                'message': 'Post not found'
            }, 404

        new_comment = Comment(
            id=data.get('id') ,
            post_id=post.id,
            author=data.get('author'),
            content= data.get('content'),
            timestamp=data.get('timestamp')
        )
        session.add(new_comment)
        session.commit()
        return {
            'status': 'success',
            'message': 'Comment added successfully',
            'comment_id': str(new_comment.id)
        }, 201

    except Exception as e:
        session.rollback()
        return {
            'status': 'error',
            'message': str(e)
        }, 500

@app.route('/posts/like/<id>', methods=['POST'])
def modify_likes(id):
    pass
    data= request.json  
    likes= data.get('likes')
    post= session.query(Post).filter(Post.id == id).first()
    if not post:
        return {
            'status': 'error',
            'message': 'Post not found'
        }, 404
    else:
        post.likes = likes
        session.commit()
        return {
            'status': 'success',
            'message': 'Likes updated successfully',
            'likes': post.likes
        }, 200
app.run(debug=True, host='localhost', port=5000)