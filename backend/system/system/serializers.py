from rest_framework import serializers
from .models import Client, Message

class ClientSerializer(serializers.ModelSerializer):
    def get_field_names(self, *args, **kwargs):
        field_names = self.context.get('fields', None)
        if field_names:
            return field_names

        return super(ClientSerializer, self).get_field_names(*args, **kwargs)
        
    class Meta:
        model = Client
        fields = ['email', 'password', 'username']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id','subject', 'message', 'sender', 'receiver', 'creation_date']
