# main/forms.py

from django import forms

# Define choices for the 'interest' field
INTEREST_CHOICES = [
    ('', 'Select a program'), # This is the default empty option
    ('computer-science', 'Computer Science & Engineering'),
    ('business', 'Business Administration'),
    ('mechanical', 'Mechanical Engineering'),
    ('biotechnology', 'Biotechnology'),
    ('digital-marketing', 'Digital Marketing'),
    ('graphic-design', 'Graphic Design'),
    ('data-science', 'Data Science'),
    ('psychology', 'Psychology'),
    ('other', 'Other'),
]

# Define choices for the 'inquiryType' field
INQUIRY_TYPE_CHOICES = [
    ('admission', 'Admission Information'),
    ('program', 'Program Details'),
    ('financial', 'Financial Aid'),
    ('campus', 'Campus Visit'),
    ('other', 'Other'),
]

class ContactForm(forms.Form):
    first_name = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={'placeholder': 'Your First Name'})
    )
    last_name = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={'placeholder': 'Your Last Name'})
    )
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'placeholder': 'your.email@example.com'})
    )
    phone = forms.CharField(
        max_length=20,
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'e.g., (123) 456-7890'})
    )
    interest = forms.ChoiceField(
        choices=INTEREST_CHOICES,
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'}) # You might have a class in your CSS
    )
    inquiry_type = forms.ChoiceField(
        choices=INQUIRY_TYPE_CHOICES,
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    message = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 5, 'placeholder': 'Tell us more about your inquiry...'}),
        required=True
    )

    # Optional: Add a clean method for global form validation if needed
    # def clean(self):
    #     cleaned_data = super().clean()
    #     # Example: If 'other' is selected for interest, ensure message is detailed
    #     interest = cleaned_data.get('interest')
    #     message = cleaned_data.get('message')
    #     if interest == 'other' and not message:
    #         self.add_error('message', 'Please provide details when selecting "Other" for Area of Interest.')
    #     return cleaned_data