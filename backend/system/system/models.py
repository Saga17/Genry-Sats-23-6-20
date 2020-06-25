from django.db import models

class Client(models.Model):
    email = models.EmailField(max_length=100, unique=True, primary_key=True)
    password = models.CharField(max_length=15)
    username = models.CharField(max_length=20)
    
    class Meta:
        app_label = 'system'
        managed = True

    def __str__(self):
        return self.email

class Message(models.Model):
    id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=255)
    creation_date = models.DateField(auto_now_add=True)
    message = models.TextField(max_length=1000)
    sender = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='receiver')

    class Meta:
        app_label = 'system'
        managed = True

    def __str__(self):
        return self.subject


