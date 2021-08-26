from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    GENDERS = (
        ('M', 'Homme'),
        ('W', 'Femme'),
        ('O', 'Autre'),
    )
    ROLES = (
        ('teacher', 'teacher'),
        ('manager', 'manager'),
        ('student', 'student'),
    )
    gender = models.CharField(max_length=1, choices=GENDERS)
    role = models.CharField(max_length=7, choices=ROLES, default='student')
    picture = models.ImageField(null=True, upload_to='uploads/images')
    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
    )
    email = models.EmailField(
        _('email address'),
        unique=True,
        error_messages={
            'unique': _("A user with that email already exists."),
        },
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Course(models.Model):
    ordering = ('created_at',),
    name = models.CharField(max_length=100, unique=True)
    coefficient = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    teacher = models.ForeignKey(User, on_delete=models.PROTECT, null=True)


class Promotion(models.Model):
    name = models.CharField(max_length=200)
    start = models.DateTimeField()
    end = models.DateTimeField()
    courses = models.ManyToManyField(Course)
    users = models.ManyToManyField(User)


class Document(models.Model):
    DOCUMENT_TYPES = (
        ('S', 'Syllabus'),
        ('C', 'Cours'),
    )
    type = models.CharField(max_length=1, choices=DOCUMENT_TYPES)
    name = models.CharField(max_length=200)
    file = models.FileField(upload_to='uploads/documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)


class Grade(models.Model):
    value = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    course = models.ForeignKey(Course, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)


class Slot(models.Model):
    start = models.DateTimeField()
    end = models.DateTimeField()
    course = models.ForeignKey(Course, on_delete=models.PROTECT)
    promotion = models.ForeignKey(Promotion, on_delete=models.PROTECT)


class UserSlot(models.Model):
    present = models.BooleanField()
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    slot = models.ForeignKey(Slot, on_delete=models.PROTECT)
