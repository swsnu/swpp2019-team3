"""__init__.py"""

# Base
from papersfeed.models.base_models import *

# Collections
from papersfeed.models.collections.collection import Collection
from papersfeed.models.collections.collection_like import CollectionLike
from papersfeed.models.collections.collection_paper import CollectionPaper
from papersfeed.models.collections.collection_user import CollectionUser

# Papers
from papersfeed.models.papers.author import Author
from papersfeed.models.papers.keyword import Keyword
from papersfeed.models.papers.paper import Paper
from papersfeed.models.papers.paper_author import PaperAuthor
from papersfeed.models.papers.paper_keyword import PaperKeyword
from papersfeed.models.papers.paper_like import PaperLike
from papersfeed.models.papers.paper_publication import PaperPublication
from papersfeed.models.papers.publication import Publication
from papersfeed.models.papers.publisher import Publisher
from papersfeed.models.papers.reference import Reference

# Replies
from papersfeed.models.replies.reply import Reply
from papersfeed.models.replies.reply_collection import ReplyCollection
from papersfeed.models.replies.reply_like import ReplyLike
from papersfeed.models.replies.reply_review import ReplyReview

# Reviews
from papersfeed.models.reviews.review import Review
from papersfeed.models.reviews.review_like import ReviewLike
from papersfeed.models.reviews.review_paper import ReviewPaper

# Users
from papersfeed.models.users.user import User
from papersfeed.models.users.user_follow import UserFollow
