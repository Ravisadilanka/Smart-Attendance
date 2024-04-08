import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL' :"https://smart-attendance-system-fb1ba-default-rtdb.firebaseio.com/"
})

ref = db.reference('Students')

data = {
    "19APC3960":
        {
            "name": "Shashini",
            "id": "19APC3960",
            "Department": "Computing and Information Systems",
            "AcademicYear": "2019/20",
            "Last_attendance_time": "2023-09-24 00:54:34"
        },
    "19APC4030":
        {
            "name": "John",
            "id": "19APC4030",
            "Department": "Computing and Information Systems",
            "AcademicYear": "2019/20",
            "Last_attendance_time": "2023-09-24 01:25:25"
        },
    "19APC5030":
        {
            "name": "Raveesha",
            "id": "19APC5030",
            "Department": "Computing and Information Systems",
            "AcademicYear": "2019/20",
            "Last_attendance_time": "2023-09-24 01:25:25"
        },
    "19APC5060":
        {
            "name": "Isuru",
            "id": "19APC5060",
            "Department": "Computing and Information Systems",
            "AcademicYear": "2019/20",
            "Last_attendance_time": "2023-09-24 01:25:25"
        },
}

for key,value in data.items():
    ref.child(key).set(value)