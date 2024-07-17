from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.LoginView.as_view(), name="login_view"),
    path("register/", views.RegisterView.as_view(), name="register_view"),
    path("verify/", views.VerifyView.as_view(), name="verify_view"),
    path("logout/", views.logout_view, name="logout_view"),
    path("home_estudiante/", views.EstudianteView.as_view(), name="home_estudiante_view"),
    path("home_guardia/", views.GuardiaView.as_view(), name="home_guardia_view"),
    path("home_profesor/", views.ProfesorView.as_view(), name="home_profesor_view")
]

