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

cap = cv2.VideoCapture("http://192.168.43.77:81/stream")
cap.set(3, 640)
cap.set(4, 480)

imgBackground = cv2.imread('Resource/bg.png')

# Importinq the mode images into a list
folderModePath = 'Resource/Modes'
modePathList = os.listdir(folderModePath)
imgModeList = []
for path in modePathList:
    imgModeList.append(cv2.imread(os.path.join(folderModePath,path)))

# Load the encoding file
print("Loading encode file...")
file = open('EncodeFile.p','rb')
encodeListKnownWithIds = pickle.load(file)
file.close()
encodeListKnown, studentIds = encodeListKnownWithIds
# print(studentIds)
print("Encode file loaded")

modeType = 0
counter = 0
id = -1
imgStudent = []

while True:
    success, img = cap.read()

    imgS = cv2.resize(img, (0,0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

    faceCurFrame = face_recognition.face_locations(imgS)
    encodeCurFrame = face_recognition.face_encodings(imgS, faceCurFrame)

    imgBackground[150:150+480,72:72+640] = img
    imgBackground[150:150+480, 786:786 + 480] = imgModeList[modeType]

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