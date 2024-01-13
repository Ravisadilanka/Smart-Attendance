import os
import pickle
import cv2
import face_recognition
import numpy as np
import cvzone
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import storage
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.common.by import By

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://smart-attendance-system-fb1ba-default-rtdb.firebaseio.com/",
    'storageBucket': "smart-attendance-system-fb1ba.appspot.com"
})

bucket = storage.bucket()

# Set the IP address of your ESP32 camera
esp32_camera_ip = "http://192.168.100.77"

# Use Selenium to open the web page and click the "Start Stream" button
driver = webdriver.Chrome()  # You need to have ChromeDriver installed and in your PATH
driver.get(esp32_camera_ip)
time.sleep(2)  # Allow time for the page to load

# Find the "Start Stream" button and click it
start_stream_button = driver.find_element(By.XPATH, "//button[text()='Start Stream']")
start_stream_button.click()

# Wait for a moment to allow the stream to start
time.sleep(2)

# VideoCapture using the IP address
esp32_camera_url = "http://192.168.100.77"
cap = cv2.VideoCapture(esp32_camera_url)

# Set the desired frame width and height
frame_width = 640  # replace with your desired width
frame_height = 480  # replace with your desired height
cap.set(cv2.CAP_PROP_FRAME_WIDTH, frame_width)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_height)

imgBackground = cv2.imread('Resource/bg.png')

folderModePath = 'Resource/Modes'
modePathList = os.listdir(folderModePath)
imgModeList = [cv2.imread(os.path.join(folderModePath, path)) for path in modePathList]

# Load the encoding file
print("Loading encode file...")
file = open('EncodeFile.p', 'rb')
encodeListKnownWithIds = pickle.load(file)
file.close()
encodeListKnown, studentIds = encodeListKnownWithIds
print("Encode file loaded")

modeType = 0
counter = 0
id = -1
imgStudent = []

while True:
    success, img = cap.read()

    # Check if the frame is successfully captured
    if not success:
        print("Failed to capture frame. Exiting...")
        break

    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

    faceCurFrame = face_recognition.face_locations(imgS)
    encodeCurFrame = face_recognition.face_encodings(imgS, faceCurFrame)

    imgBackground[150:150+480,72:72+640] = img
    imgBackground[150:150+480, 786:786 + 480] = imgModeList[modeType]

    # rest of your code...


    if faceCurFrame:
        for encodeFace, faceLoc in zip(encodeCurFrame, faceCurFrame):
            matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
            faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
            # print("matches", matches)
            # print("faceDis", faceDis)

            matchIndex = np.argmin(faceDis)
            # print("matchIndex", matchIndex)

            if matches[matchIndex]:
                # print("Known face detected")
                # print(studentIds[matchIndex])
                y1, x2, y2, x1 = faceLoc
                y1, x2, y2, x1 = y1*4, x2*4, y2*4, x1*4
                bbox = 72+x1, 150+y1, x2 - x1, y2 - y1
                imgBackground = cvzone.cornerRect(imgBackground, bbox, rt=0)
                id = studentIds[matchIndex]

                if counter == 0:
                    cvzone.putTextRect(imgBackground, "Loading", (275, 400))
                    cv2.imshow("Face Attendance", imgBackground)
                    cv2.waitKey(1)
                    counter = 1
                    modeType = 3

        if counter != 0:

            if counter == 1:
                # Get the Data
                studentInfo = db.reference(f'Students/{id}').get()
                print(studentInfo)

                #Get the Image from the storage
                blob = bucket.get_blob(f'Images/{id}.jpg')
                array = np.frombuffer(blob.download_as_string(),np.uint8)
                imgStudent = cv2.imdecode(array,cv2.COLOR_BGRA2BGR)

                # Update data of attendance
                datetimeObject = datetime.strptime(studentInfo['Last_attendance_time'],
                                                  "%Y-%m-%d %H:%M:%S")
                secondsElapsed = (datetime.now() - datetimeObject).total_seconds()
                print(secondsElapsed)
                if secondsElapsed > 30:
                    ref = db.reference(f'Students/{id}')
                    ref.child('Last_attendance_time').set(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                else:
                    modeType = 1
                    counter = 0
                    imgBackground[150:150 + 480, 786:786 + 480] = imgModeList[modeType]

            if modeType != 1:
                if 10 < counter < 20:
                    modeType = 2

                imgBackground[150:150 + 480, 786:786 + 480] = imgModeList[modeType]

                if counter <= 10:
                        # cv2.putText(imgBackground, str(studentInfo['Last_attendance_time']), (1000, 325),
                        #             cv2.FONT_HERSHEY_COMPLEX, 0.8, (0, 0, 0), 1)

                    cv2.putText(imgBackground, str(studentInfo['name']), (1000, 525),
                                cv2.FONT_HERSHEY_COMPLEX, 0.8, (255, 255, 255), 1)

                    cv2.putText(imgBackground, str(studentInfo['id']), (1000, 445),
                                cv2.FONT_HERSHEY_COMPLEX, 0.8, (255, 255, 255), 1)

                    imgBackground[175:175+216, 909:909+216] = imgStudent

                counter += 1

                if counter >= 20:
                    counter = 0
                    modeType = 0
                    studentInfo = []
                    imgStudent = []
                    imgBackground[150:150 + 480, 786:786 + 480] = imgModeList[modeType]
    else:
        modeType = 0
        counter = 0
    # cv2.imshow("Webcam", img)
    cv2.imshow("Face Attendance", imgBackground)
    cv2.waitKey(1)