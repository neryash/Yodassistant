import speech_recognition as sr
r = sr.Recognizer()
mic = sr.Microphone(device_index=0)
with mic as source:
    r.adjust_for_ambient_noise(source,duration=0.1)
    print("fin")
    audio = r.listen(source)
print("ruts")
try:
    result = r.recognize_google(audio)
except sr.UnknownValueError:
    print("nope")
print(result)
