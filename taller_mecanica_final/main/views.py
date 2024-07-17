from django.http.response import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.utils import timezone
from django.core.mail import send_mail
from .models import Usuario
from .forms import LoginForm, RegisterForm, VerifyForm
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.http import HttpResponse
from django.views.generic import TemplateView, ListView
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.core.exceptions import PermissionDenied


#VISTAS PRINCIPALES INICIO, REGISTRO, VERIFICACIÓN
class RegisterView(TemplateView):
    template_path = "register.html"
    register_form = RegisterForm
    context_variables = {
        "register_form": RegisterForm
    }

    def get(self, request):
        return render(request, self.template_path, self.context_variables)

    def post(self, request):
        if request.method == "POST":
            form = RegisterForm(request.POST)

        if form.is_valid():
            usuario = form.save(commit=False)
            usuario.password = make_password(form.cleaned_data['password'])
            usuario.token_expiracion = timezone.now() + timezone.timedelta(hours=1)
            usuario.save()
            send_mail(
                'CÓDIGO DE VERIFICACIÓN',
                f'Tu código de registro es {usuario.token_registro}',
                'testing.mecanica@gmail.com',
                [usuario.email],
                fail_silently=False
            )
            return redirect('verify_view')
        else:
            messages.error(request, "Usuario ya registrado(a)!")
            print(form.errors)
            return render(request, self.template_path, {'register_form': form})

class LoginView(TemplateView):
    template_path = "login.html"
    login_form = LoginForm
    context_variables = {
        "login_form": LoginForm
    }

    def get(self, request):
        return render(request, self.template_path, self.context_variables)

    def post(self, request):
        if request.method == "POST":
            form = LoginForm(request.POST)

        if form.is_valid():
            try:
                usuario = Usuario.objects.get(email=form.cleaned_data['email'])
                if check_password(form.cleaned_data['password'], usuario.password):
                    auth_login(request, usuario)
                    if usuario.rol == 'ESTUDIANTE':
                        return redirect('home_estudiante_view')
                    
                    elif usuario.rol == 'GUARDIA':
                        return redirect('home_guardia_view')
                    
                    elif usuario.rol == 'PROFESOR':
                        return redirect('home_profesor_view')
                    else:
                        None
                else:
                    form.add_error(None, 'Contraseña Inválida')
            except Usuario.DoesNotExist:
                form.add_error(None, 'Correo Inválido')
        
        return render(request, self.template_path, {'login_form': form})

class VerifyView(TemplateView):
    template_path = "verify.html"
    verify_form = VerifyForm
    context_variables = {
        "verify_form": VerifyForm
    }

    def get(self, request):
        return render(request, self.template_path, self.context_variables)

    def post(self, request):
        if request.method == "POST":
            form = VerifyForm(request.POST)

        if form.is_valid():
            try:
                usuario = Usuario.objects.get(email=form.cleaned_data['email'], token_registro=form.cleaned_data['token'])
                if usuario.token_expiracion > timezone.now():
                    usuario.is_active = True
                    usuario.token_registro = None
                    usuario.token_expiracion = None
                    usuario.save()
                    return redirect('login_view')
                else:
                    form.add_error(None, 'El Token Expiró')
            except Usuario.DoesNotExist:
                form.add_error(None, 'Correo o Token Inválidos')
        
        self.context_variables["verify_form"] = form
        return render(request, self.template_path, self.context_variables)

def logout_view(request):
    auth_logout(request)
    return redirect('login_view')

#VERIFICADOR ROL
class RoleRequiredMixin(UserPassesTestMixin):
    required_rol = None

    def test_func(self):
        return self.request.user.rol == self.required_rol
    
    def handle_no_permission(self):
        raise PermissionDenied("No tienes permiso para acceder a esta página.")


#VISTAS ESPECIFICAS SEGÚN ROL USUARIO

class EstudianteView(RoleRequiredMixin,LoginRequiredMixin, TemplateView):
    template_path = "estudiante/home_estudiante.html"
    required_rol = 'ESTUDIANTE'

    def get(self, request):
        return render(request, self.template_path, {})


class GuardiaView(RoleRequiredMixin,LoginRequiredMixin, TemplateView):
    template_path = "guardia/home_guardia.html"
    required_rol = 'GUARDIA'

    def get(self, request):
        return render(request, self.template_path, {})

class ProfesorView(RoleRequiredMixin,LoginRequiredMixin, TemplateView):
    template_path = "profesor/home_profesor.html"
    required_rol = 'PROFESOR'

    def get(self, request):
        return render(request, self.template_path, {})