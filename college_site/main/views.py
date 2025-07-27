
from django.shortcuts import render , redirect
from django.urls import reverse
from .models import ContactMessage
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from .forms import ContactForm
def index(request):
    return render(request, 'main/index.html')

def about(request):
    return render(request, 'main/about.html')


def contact_view(request):
    form = ContactForm() # Initialize form with a default empty instance

    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            email = form.cleaned_data['email']
            phone = form.cleaned_data.get('phone')
            interest = form.cleaned_data.get('interest')
            inquiry_type = form.cleaned_data['inquiry_type']
            message = form.cleaned_data['message']

            try:
                # 1. Save to Database (Still recommended and kept)
                ContactMessage.objects.create(
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    phone=phone,
                    interest=interest,
                    inquiry_type=inquiry_type,
                    message=message
                )
                messages.success(request, 'Your message has been sent successfully! We will get back to you shortly.')

                # Removed: Email Sending Logic
                # The send_mail call and its related try-except block are removed here.

            except Exception as e:
                # This catch-all now handles errors for database saving, etc.
                print(f"Error processing contact form: {e}") # Log the specific error
                messages.error(request, 'There was an error processing your message. Please try again later.')

            # Redirect to prevent re-submission on page refresh
            # We redirect to the same page, and Django messages will display the outcome.
            return redirect(reverse('contact'))

    # Render the contact page with the form
    return render(request, 'main/contact.html', {'form': form})


        
def courses(request):
    return render(request, 'main/courses.html')

def placements(request):
    return render(request, 'main/placements.html')

def students(request):
    return render(request, 'main/students.html')




