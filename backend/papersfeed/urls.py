"""urls.py"""
# -*- coding: utf-8 -*-
# pylint: skip-file

from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
    path('token', views.token, name='token'),
    url(r'^(?P<api>\w+)$', views.api_entry, name='api_entry'),
    url(r'^(?P<api>\w+)/(?P<second_api>\w+)$', views.api_entry, name='api_entry'),
    url(r'^(?P<api>\w+)/(?P<second_api>\w+)/(?P<third_api>\w+)$', views.api_entry, name='api_entry'),
    url(r'^(?P<api>\w+)/(?P<second_api>\w+)/(?P<third_api>\w+)/(?P<fourth_api>\w+)$', views.api_entry, name='api_entry')
]
