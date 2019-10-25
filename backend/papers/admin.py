"""admin.py"""
from django.contrib import admin

from .models.author import Author
from .models.keyword import Keyword
from .models.paper_author import PaperAuthor
from .models.paper_keyword import PaperKeyword
from .models.paper_publication import PaperPublication
from .models.paper import Paper
from .models.publication import Publication
from .models.publisher import Publisher
from .models.reference import Reference

# Register your models here.
admin.site.register(Author)
admin.site.register(Paper)
admin.site.register(Publisher)
admin.site.register(Keyword)
admin.site.register(Publication)
