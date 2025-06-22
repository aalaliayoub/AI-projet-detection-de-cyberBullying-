import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Post(Base):
    __tablename__ = 'posts'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    author = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(Text)
    likes = Column(Integer, default=0)

    comments = relationship('Comment', back_populates='post', cascade='all, delete-orphan')
    liked_by = relationship('Like', back_populates='post', cascade='all, delete-orphan')


class Comment(Base):
    __tablename__ = 'comments'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    author = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(Text)

    post = relationship('Post', back_populates='comments')


class Like(Base):
    __tablename__ = 'likes'
    __table_args__ = (UniqueConstraint('post_id', 'user_id', name='unique_like_per_user_post'),)

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(String, nullable=False)

    post = relationship('Post', back_populates='liked_by')
