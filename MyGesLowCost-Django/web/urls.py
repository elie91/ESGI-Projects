from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import security, index, users, courses, students, promotions, calendar

urlpatterns = [
    path('login', security.login, name='login'),
    path('logout', security.logout, name='logout'),
    path('profile', security.profile, name='profile'),
    #path('password_change', auth_views.PasswordChangeView.as_view(), name='password_change'),
    #path('password_change_done', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),

    path('', index.home, name='index'),

    path('courses', courses.courses_list, name='courses'),
    path('courses/add', courses.courses_add, name='courses_add'),
    path('courses/notation/<int:course_id>', courses.courses_notation, name='courses_notation'),
    path('courses/<int:course_id>', courses.courses_show, name='courses_show'),
    path('courses/course-supports', courses.courses_supports, name='courses_supports'),
    path('courses/course-supports/add', courses.courses_add_supports, name='courses_add_supports'),
    path('courses/<int:course_id>/edit', courses.courses_edit, name='courses_edit'),
    path('courses/<int:course_id>/delete', courses.courses_delete, name='courses_delete'),

    path('users', users.users_list, name='users'),
    path('users/add', users.users_add, name='users_add'),
    path('users/import', users.users_import, name='users_import'),
    path('users/<int:user_id>', users.users_edit, name='users_edit'),
    path('users/<int:user_id>/delete', users.users_delete, name='users_delete'),

    path('grades', students.grades, name='grades'),
    path('grades/<int:student_id>', students.student_grades_show, name='grades_show'),

    path('promotions', promotions.promotions_list, name='promotions'),
    path('promotions/add', promotions.promotions_add, name='promotions_add'),
    path('promotions/<int:promotion_id>/edit', promotions.promotions_edit, name='promotions_edit'),
    path('promotions/<int:promotion_id>', promotions.promotions_show, name='promotions_show'),
    path('promotions/<int:promotion_id>/delete', promotions.promotions_delete, name='promotions_delete'),
    path('promotions/<int:promotion_id>/courses', promotions.promotion_courses, name='promotion_courses'),

    path('promotions/students', promotions.promotions_students, name='promotions_students'),

    path('calendar', calendar.calendar, name='calendar'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
