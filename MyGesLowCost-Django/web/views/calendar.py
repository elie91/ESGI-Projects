import json
from pprint import pprint

from django.core import serializers
from django.shortcuts import render, get_object_or_404, redirect
from ..models import Slot, Course, Promotion
from ..decorators import group_required
from ..forms.slots import SlotForm
from ..utils import format_slots
from django.db.models import Q


@group_required(['teacher', 'manager', 'student'], login_url='login')
def calendar(request):
    errors = []
    if request.method == 'POST':
        form = SlotForm(request.POST)
        pprint(form.errors)
        if form.is_valid():
            course = get_object_or_404(Course, id=request.POST['course'])
            promotion = get_object_or_404(Promotion, id=request.POST['promotion'])
            start = request.POST['date'] + " " + request.POST['start'] + "+02:00"
            end = request.POST['date'] + " " + request.POST['end'] + "+02:00"
            if start > end:
                errors.append('La date de debut doit etre inferieur à la date de fin')
            else:
                instance = Slot(
                    start=start,
                    end=end,
                    course=course,
                    promotion=promotion,
                )

                is_exist = Slot.objects.filter(Q(promotion_id=promotion.id) &
                                               ((Q(start__lte=start) & Q(end__lte=end) & Q(end__gt=start)) |
                                                (Q(start__lte=start) & Q(end__gte=end)) |
                                                (Q(start__gte=start) & Q(end__lte=end)) |
                                                (Q(start__gte=start) & Q(end__gte=end) & Q(start__lt=end))))
                if len(is_exist) > 0:
                    errors.append("Vous ne pouvez pas ajouter de cours sur ce créneau")
                else:
                    instance.save()

                if len(errors) == 0:
                    return redirect('calendar')

    else:
        form = SlotForm()

    if request.user.role == 'manager':
        events = format_slots(Slot.objects.all())
    elif request.user.role == 'teacher':
        events = format_slots(Slot.objects.filter(course__teacher=request.user.id))
    else:
        # FAUT FIXER CA
        events = []
        for promotion in Promotion.objects.filter(users__exact=request.user):
            events.extend(format_slots(promotion.slot_set.all()))

    return render(request, 'web/calendar/calendar.html', {
        'slots': json.dumps(events),
        'form': form,
        'promotions': Promotion.objects.all(),
    })
