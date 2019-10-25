"""admin.py"""
from django.contrib import admin

from .models.author import Author
from .models.keyword import Keyword
from .models.paper import Paper
from .models.publication import Publication
from .models.publisher import Publisher

# Register your models here.
admin.site.register(Author)
admin.site.register(Paper)
admin.site.register(Publisher)
admin.site.register(Keyword)
admin.site.register(Publication)
