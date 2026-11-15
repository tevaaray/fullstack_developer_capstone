from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import Course, Question, Choice, Submission

def submit(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    
    # Сбор выбранных вариантов ответов из формы
    selected_ids = []
    for key, value in request.POST.items():
        if key.startswith('choice_'):
            selected_ids.append(int(value))
            
    # Сохранение отправки
    enrollment = request.user.enrollment_set.get(course=course)
    submission = Submission.objects.create(enrollment=enrollment)
    for choice_id in selected_ids:
        choice = Choice.objects.get(pk=choice_id)
        submission.choices.add(choice)
        
    return HttpResponseRedirect(reverse('onlinecourse:show_exam_result', args=(course.id, submission.id)))

def show_exam_result(request, course_id, submission_id):
    course = get_object_or_404(Course, pk=course_id)
    submission = get_object_or_404(Submission, pk=submission_id)
    
    total_score = 0
    max_score = 0
    
    questions = course.question_set.all()
    for question in questions:
        max_score += question.grade
        selected_choices = submission.choices.filter(question=question)
        selected_ids = [choice.id for choice in selected_choices]
        if question.is_get_score(selected_ids):
            total_score += question.grade
            
    context = {
        'course': course,
        'submission': submission,
        'total_score': total_score,
        'max_score': max_score,
    }
    return render(request, 'onlinecourse/exam_result_bootstrap.html', context)