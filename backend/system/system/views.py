from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from .models import Client, Message
from .serializers import ClientSerializer, MessageSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.utils import jwt_decode_handler

def encode(client):
    jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
    jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

    payload = jwt_payload_handler(client)
    token = jwt_encode_handler(payload)

    decodeJWT(token)
    return token

def decodeJWT(token):
    obj = None
    try:
        obj = jwt_decode_handler(token)
    except:
        obj = None

    return obj

@csrf_exempt
def send_message(request):
    if(request.method != 'POST'):
        return JsonResponse({'success': False,'err':'Wrong method'})
    token = request.headers.get('Authorization')
    
    if(token == None):
        return JsonResponse({'success': False,'err':'Missing token'})

    user = decodeJWT(token)

    if(user == None):
        return JsonResponse({'success': False,'err':'Wrong token'})
    
    data = JSONParser().parse(request)
    data['sender'] = user['email']

    serializer = MessageSerializer(data=data)

    if(serializer.is_valid()):
        serializer.save()
        return JsonResponse({'success': True,'message':'Message has been sent'})
    
    return JsonResponse({'success': False, 'err':serializer.errors})

@csrf_exempt
def get_messages(request, action = ''):
    if(request.method != 'GET' or (action != 'sent' and action != 'received')):
        return JsonResponse({'success': False,'err':'Wrong method/action'})

    token = request.headers.get('Authorization')
    
    if(token == None):
        return JsonResponse({'success': False,'err':'Missing token'})

    user = decodeJWT(token)

    if(user == None):
        return JsonResponse({'success': False,'err':'Wrong token'})

    if(action == 'sent'):
        messages = Message.objects.filter(sender=user['email'])
    else:
        messages = Message.objects.filter(receiver=user['email'])

    messages_serializer = MessageSerializer(messages, many=True)

    return JsonResponse({'success': True,'messages':messages_serializer.data})

@csrf_exempt
def delete_message(request, id):
    if(request.method != 'GET'):
        return JsonResponse({'success': False,'err':'Wrong method'})

    token = request.headers.get('Authorization')
    
    if(token == None):
        return JsonResponse({'success': False,'err':'Missing token'})

    user = decodeJWT(token)

    if(user == None):
        return JsonResponse({'success': False,'err':'Wrong token'})

    messages = Message.objects.filter(id=id)
    
    if(len(messages) == 0 or messages[0].receiver.email != user['email']): #Only user who received the message can delete it
        return JsonResponse({'success': False,'err':'Message not found'})
    

    messages[0].delete()

    return JsonResponse({'success': True,'message':'Deleted successfully'})

@csrf_exempt
def search_email(request):
    if(request.method != 'POST'):
        return JsonResponse({'success': False,'err':'Wrong method'})

    token = request.headers.get('Authorization')
    
    if(token == None):
        return JsonResponse({'success': False,'err':'Missing token'})

    user = decodeJWT(token)

    if(user == None):
        return JsonResponse({'success': False,'err':'Wrong token'})

    data = JSONParser().parse(request)
    if(not data['email']):
        return JsonResponse({'success': False, 'err': 'email not found'})
    
    email = data['email']

    if(len(email) < 3):
        return JsonResponse({'success': False, 'err': 'Too Short'})
    
    obj = Client.objects.filter(email__contains=email)[:10]
    serializer = ClientSerializer(obj, many=True, context={'fields': ['email']});
    return JsonResponse({'success': True, 'suggestions': serializer.data})

@csrf_exempt
def register(request):
    if(request.method == 'POST'):
        data = JSONParser().parse(request)
        serializer = ClientSerializer(data=data)

        if(serializer.is_valid()):
            token = encode(serializer.save())
            return JsonResponse({'success': True, 'token': token})

        return JsonResponse({'success': False, 'err':serializer.errors})
    else:
        return JsonResponse({'success': False,'err':'Wrong method'})

@csrf_exempt
def login(request):
    if(request.method == 'POST'):
        data = JSONParser().parse(request)

        if(not data['email'] or not data['password']):
            return JsonResponse({'success': False, 'err':'Missing paramters'})
        
        obj = Client.objects.filter(email=data['email'], password=data['password'])
        
        if(len(obj) == 0):
            return JsonResponse({'success': False, 'message': 'Wrong Credentials'})

        
        token = encode(obj[0])

        
        #print(jwt_decode_handler('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiZ2VucnlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJnZW5yeSIsImV4cCI6MTU5MjkyMzczNCwiZW1haWwiOiJnZW5yeUBnbWFpbC5jb20ifQ.Wn1SofKWwnO-UXjNltuSp5GsKw1wSE7Tu24BzEpAGk4'))
        

        return JsonResponse({'success': True, 'token': token})
    else:
        return JsonResponse({'success': False, 'err':'Wrong method'})

