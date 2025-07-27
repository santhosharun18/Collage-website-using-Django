from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact_view, name='contact'),
    path('courses/', views.courses, name='courses'),
    path('placements/', views.placements, name='placements'),
    path('students/', views.students, name='students'),
]

